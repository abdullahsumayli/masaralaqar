/**
 * WhatsApp Webhook Handler
 *
 * Pipeline:
 *   Evolution API → POST /api/webhook/whatsapp
 *     1. Parse & deduplicate
 *     2. Resolve office from WhatsApp session
 *     3. Send instant acknowledgment to customer
 *     4. Enqueue to Redis (1s timeout) — primary async path
 *     5. If Redis fails → InlineProcessor fallback
 *     6. Return < 2s in primary path
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { captureError } from "@/lib/sentry";
import { supabaseAdmin } from "@/lib/supabase";
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

async function autoCreateSessionForInstance(
  instanceName: string,
  phoneFromMessage?: string,
) {
  const { data: recentOffice } = await supabaseAdmin
    .from("users")
    .select("office_id")
    .not("office_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (!recentOffice?.office_id) {
    console.error("[Webhook] autoCreateSession: No office found");
    return null;
  }

  const officeId = recentOffice.office_id;
  const { data, error } = await supabaseAdmin
    .from("whatsapp_sessions")
    .upsert(
      {
        office_id: officeId,
        phone_number: phoneFromMessage || "auto-detected",
        instance_id: instanceName,
        session_status: "connected",
        last_connected_at: new Date().toISOString(),
      },
      { onConflict: "office_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("[Webhook] autoCreateSession error:", error);
    return null;
  }

  console.log(
    `[Webhook] Auto-created session office=${officeId} instance=${instanceName}`,
  );
  return WhatsAppSessionRepository.formatSession(data);
}

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
    let payload: any;

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
        const isOpen = payload.data?.state === "open";

        let session =
          await WhatsAppSessionRepository.getByInstanceId(instanceName);
        if (!session && isOpen) {
          session = await autoCreateSessionForInstance(instanceName);
        }

        if (session) {
          await WhatsAppSessionRepository.updateStatus(
            session.id,
            isOpen ? "connected" : "disconnected",
          );
          console.log(
            `[Webhook] connection.update → office=${session.officeId} status=${isOpen ? "connected" : "disconnected"} +${elapsed(webhookStart)}ms`,
          );
        } else {
          console.error(
            `[Webhook] connection.update: no session for instance=${instanceName}`,
          );
        }
        return NextResponse.json({ ok: true });
      }

      // ── messages.upsert ───────────────────────────────────
      if (payload.event === "messages.upsert") {
        const msg = payload.data?.messages?.[0];
        if (!msg || msg.key?.fromMe) {
          return NextResponse.json({ ok: true });
        }

        const from =
          msg.key?.remoteJid?.replace("@s.whatsapp.net", "") ?? "";
        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          "";
        const messageId = msg.key?.id || `evo_${Date.now()}`;

        if (!from || !text) {
          return NextResponse.json({ ok: true });
        }

        if (isDuplicate(messageId)) {
          console.log(`[Webhook] duplicate ${messageId} — skipped`);
          return NextResponse.json({ ok: true });
        }

        // Resolve office
        let officeId = "";
        let businessPhone = "";

        let session =
          await WhatsAppSessionRepository.getByInstanceId(instanceName);
        if (!session) {
          console.warn(
            `[Webhook] No session for instance=${instanceName} — auto-creating`,
          );
          session = await autoCreateSessionForInstance(instanceName, from);
        }

        if (session) {
          officeId = session.officeId;
          businessPhone = session.phoneNumber;
          if (
            businessPhone === "pending" ||
            businessPhone === "auto-detected"
          ) {
            businessPhone = from;
          }
        }

        if (!officeId) {
          console.error(
            `[Webhook] DROPPED: no office for instance=${instanceName} +${elapsed(webhookStart)}ms`,
          );
          return NextResponse.json({ ok: true });
        }

        console.log(
          `[Webhook] ← message from=${from} office=${officeId} +${elapsed(webhookStart)}ms`,
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
      payload?.data?.fromMe === true ||
      payload?.data?.fromMe === "true"
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
