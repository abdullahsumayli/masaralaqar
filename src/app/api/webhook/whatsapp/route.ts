/**
 * WhatsApp Webhook Handler (multi-tenant)
 *
 * Pipeline:
 *   Evolution API → POST /api/webhook/whatsapp
 *     1. Parse & deduplicate
 *     2. Extract instance name from payload → resolve office via session
 *     3. Send instant acknowledgment to customer (via the correct instance)
 *     4. Enqueue to Redis (1s timeout) — primary async path
 *     5. If Redis fails → InlineProcessor fallback
 *     6. Return < 2s in primary path
 *
 * Instance routing:
 *   Each office has its own Evolution instance (office_{officeId}).
 *   The webhook extracts the instance name from the payload and looks up
 *   the corresponding office in the whatsapp_sessions table.
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { captureError } from "@/lib/sentry";
import { enqueueMessage } from "@/queues/message.queue";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { InlineProcessor } from "@/services/inline-processor.service";
import { METRIC, MetricsService } from "@/services/metrics.service";
import { TenantService } from "@/services/tenant.service";
import { NextRequest, NextResponse } from "next/server";

// ── Constants ────────────────────────────────────────────────

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const ENQUEUE_TIMEOUT_MS = 1000;
const ACK_TIMEOUT_MS = 1500;
const ACK_MESSAGE = "⏳ تم استلام رسالتك، جاري البحث الآن...";

if (!WEBHOOK_SECRET) {
  console.error("WEBHOOK_SECRET environment variable is not set");
}

// ── Helpers ──────────────────────────────────────────────────

const processedMessages = new Set<string>();
const MAX_CACHE_SIZE = 1000;

function isDuplicate(messageId: string): boolean {
  if (processedMessages.has(messageId)) return true;
  if (processedMessages.size >= MAX_CACHE_SIZE) {
    const iter = processedMessages.values();
    for (let i = 0; i < 100; i++) {
      const v = iter.next().value;
      if (v) processedMessages.delete(v);
    }
  }
  processedMessages.add(messageId);
  return false;
}

function elapsed(start: number): number {
  return Date.now() - start;
}

// ── GET: Webhook verification ────────────────────────────────

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");

  if (WEBHOOK_SECRET && secret === WEBHOOK_SECRET) {
    return NextResponse.json({ status: "ok", message: "Webhook verified" });
  }

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (WEBHOOK_SECRET && mode === "subscribe" && token === WEBHOOK_SECRET) {
    return new NextResponse(challenge || "ok");
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// ── POST: Handle incoming messages ───────────────────────────

export async function POST(request: NextRequest) {
  const webhookStart = Date.now();

  try {
    const bodyText = await request.text();
    let payload: Record<string, unknown>;

    try {
      payload = JSON.parse(bodyText);
    } catch {
      const formData = new URLSearchParams(bodyText);
      payload = {
        data: {
          from: formData.get("from"),
          body: formData.get("body"),
          id: formData.get("id"),
          fromMe: formData.get("fromMe"),
          type: formData.get("type"),
        },
      };
    }

    // ── Evolution API Format ────────────────────────────────
    if (payload?.instance && payload?.event) {
      const instanceName = payload.instance as string;
      console.log(
        `[Webhook] ← event=${payload.event} instance=${instanceName} +${elapsed(webhookStart)}ms`,
      );

      // ── connection.update ─────────────────────────────────
      if (payload.event === "connection.update") {
        const data = payload.data as Record<string, unknown> | undefined;
        const isOpen = data?.state === "open";

        const session =
          await WhatsAppSessionRepository.getByInstanceId(instanceName);

        if (session) {
          await WhatsAppSessionRepository.updateStatus(
            session.id,
            isOpen ? "connected" : "disconnected",
          );
          console.log(
            `[Webhook] connection.update → office=${session.officeId} instance=${instanceName} status=${isOpen ? "connected" : "disconnected"} +${elapsed(webhookStart)}ms`,
          );
        } else {
          console.warn(
            `[Webhook] connection.update: no session for instance=${instanceName} — office must connect first`,
          );
        }
        return NextResponse.json({ ok: true });
      }

      // ── messages.upsert ───────────────────────────────────
      if (payload.event === "messages.upsert") {
        const data = payload.data as Record<string, unknown> | undefined;
        const messages = data?.messages as Record<string, unknown>[] | undefined;
        const msg = messages?.[0];
        const key = msg?.key as Record<string, unknown> | undefined;
        if (!msg || key?.fromMe) {
          return NextResponse.json({ ok: true });
        }

        const from =
          (key?.remoteJid as string)?.replace("@s.whatsapp.net", "") ?? "";
        const msgBody = msg.message as Record<string, unknown> | undefined;
        const text =
          (msgBody?.conversation as string) ||
          ((msgBody?.extendedTextMessage as Record<string, unknown>)
            ?.text as string) ||
          "";
        const messageId = (key?.id as string) || `evo_${Date.now()}`;

        if (!from || !text) {
          return NextResponse.json({ ok: true });
        }

        if (isDuplicate(messageId)) {
          console.log(`[Webhook] duplicate ${messageId} — skipped`);
          return NextResponse.json({ ok: true });
        }

        // Resolve office from the instance name
        const session =
          await WhatsAppSessionRepository.getByInstanceId(instanceName);

        if (!session) {
          console.error(
            `[Webhook] DROPPED: no session for instance=${instanceName} — office must connect first +${elapsed(webhookStart)}ms`,
          );
          return NextResponse.json({ ok: true });
        }

        const officeId = session.officeId;
        let businessPhone = session.phoneNumber;
        if (
          businessPhone === "pending" ||
          businessPhone === "auto-detected"
        ) {
          businessPhone = from;
        }

        console.log(
          `[Webhook] ← message from=${from} office=${officeId} instance=${instanceName} +${elapsed(webhookStart)}ms`,
        );

        MetricsService.track(METRIC.MESSAGES_RECEIVED, 1, {
          officeId,
          route: "evolution",
        });

        // ── Step 1: Send instant acknowledgment (non-blocking) ──
        const ackPromise = WhatsAppService.sendMessage(
          from,
          ACK_MESSAGE,
          officeId,
        )
          .then(() =>
            console.log(
              `[Webhook] ✓ ack sent to ${from} +${elapsed(webhookStart)}ms`,
            ),
          )
          .catch((err: unknown) =>
            console.warn(`[Webhook] ✗ ack failed:`, err),
          );

        // ── Step 2: Try Redis enqueue (1s timeout) ──────────
        let queued = false;
        try {
          await Promise.race([
            enqueueMessage({
              messageId,
              phone: from,
              message: text,
              officeId,
              businessPhone,
              timestamp: new Date().toISOString(),
              route: "evolution",
              instanceName,
            }),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Redis enqueue timeout")),
                ENQUEUE_TIMEOUT_MS,
              ),
            ),
          ]);
          queued = true;
          console.log(
            `[Webhook] ✓ enqueued ${messageId} +${elapsed(webhookStart)}ms`,
          );
        } catch (enqueueError) {
          console.warn(
            `[Webhook] ✗ enqueue failed +${elapsed(webhookStart)}ms:`,
            enqueueError instanceof Error
              ? enqueueError.message
              : enqueueError,
          );
          captureError(enqueueError, {
            module: "Webhook",
            action: "enqueueEvolution",
            officeId,
          });
        }

        // ── Step 3a: Redis succeeded → wait for ack, return fast ──
        if (queued) {
          const remaining = Math.max(
            0,
            ACK_TIMEOUT_MS - elapsed(webhookStart),
          );
          await Promise.race([
            ackPromise,
            new Promise((r) => setTimeout(r, remaining)),
          ]);
          console.log(
            `[Webhook] → done (queued) total=${elapsed(webhookStart)}ms`,
          );
          return NextResponse.json({ ok: true, queued: true });
        }

        // ── Step 3b: Redis failed → fallback to inline ──────
        console.log(
          `[Webhook] ↓ fallback to inline processing +${elapsed(webhookStart)}ms`,
        );
        try {
          await InlineProcessor.process({
            messageId,
            phone: from,
            message: text,
            officeId,
            businessPhone,
            ackSent: true,
          });
        } catch (inlineError) {
          console.error(
            `[Webhook] ✗ inline failed +${elapsed(webhookStart)}ms:`,
            inlineError,
          );
          captureError(inlineError, {
            module: "Webhook",
            action: "inlineFallback",
            officeId,
          });
        }

        console.log(
          `[Webhook] → done (inline) total=${elapsed(webhookStart)}ms`,
        );
        return NextResponse.json({ ok: true, queued: false });
      }

      // Other Evolution events
      return NextResponse.json({ ok: true });
    }

    // ── Fallback: Legacy format ─────────────────────────────
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get("secret");

    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    if (
      (payload?.data as Record<string, unknown>)?.fromMe === true ||
      (payload?.data as Record<string, unknown>)?.fromMe === "true"
    ) {
      return NextResponse.json({
        success: true,
        message: "Outgoing message ignored",
      });
    }

    const message = WhatsAppService.parseIncomingMessage(payload);
    if (!message) {
      return NextResponse.json({
        success: true,
        message: "No message to process",
      });
    }

    if (isDuplicate(message.id)) {
      return NextResponse.json({
        success: true,
        message: "Duplicate ignored",
      });
    }

    const tenant = await TenantService.getTenantByWebhook(secret!);
    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 },
      );
    }

    MetricsService.track(METRIC.MESSAGES_RECEIVED, 1, {
      officeId: tenant.id,
      route: "legacy",
    });

    // Legacy: ack + enqueue with 1s timeout
    const legacyAck = WhatsAppService.sendMessage(
      message.phone,
      ACK_MESSAGE,
      tenant.id,
    ).catch(() => {});

    try {
      await Promise.race([
        enqueueMessage({
          messageId: message.id,
          phone: message.phone,
          message: message.text,
          officeId: tenant.id,
          businessPhone: tenant.whatsappNumber || "",
          timestamp: new Date().toISOString(),
          route: "legacy",
          tenantId: tenant.id,
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Redis enqueue timeout")),
            ENQUEUE_TIMEOUT_MS,
          ),
        ),
      ]);
      await Promise.race([
        legacyAck,
        new Promise((r) => setTimeout(r, ACK_TIMEOUT_MS)),
      ]);
      console.log(
        `[Webhook] ✓ legacy enqueued total=${elapsed(webhookStart)}ms`,
      );
      return NextResponse.json({ success: true });
    } catch (enqueueError) {
      captureError(enqueueError, {
        module: "Webhook",
        action: "enqueueLegacy",
        officeId: tenant.id,
      });
      console.warn(
        `[Webhook] ✗ legacy enqueue failed total=${elapsed(webhookStart)}ms`,
      );
      return NextResponse.json(
        { error: "Failed to enqueue" },
        { status: 500 },
      );
    }
  } catch (error) {
    captureError(error, { module: "Webhook", action: "POST" });
    MetricsService.track(METRIC.WEBHOOK_ERROR, 1);
    console.error(
      `[Webhook] ✗ handler error total=${elapsed(webhookStart)}ms:`,
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
