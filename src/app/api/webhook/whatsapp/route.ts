/**
 * WhatsApp Webhook Handler — WAHA (multi-tenant)
 *
 * Handles both WAHA and Evolution payload formats.
 *
 * Pipeline:
 *   WAHA → POST /api/webhook/whatsapp
 *     1. Parse & deduplicate
 *     2. Extract session name → resolve office via whatsapp_sessions
 *     3. Send instant ack to customer
 *     4. Enqueue to Redis (1s timeout) — primary async path
 *     5. If Redis fails → InlineProcessor fallback
 *     6. Return < 2s
 *
 * WAHA events handled:
 *   message | message.any → incoming customer message
 *   session.status → connection state change (WORKING / SCAN_QR_CODE / FAILED)
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { captureError } from "@/lib/sentry";
import { enqueueMessage } from "@/queues/message.queue";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { InlineProcessor } from "@/services/inline-processor.service";
import { METRIC, MetricsService } from "@/services/metrics.service";
import { TenantService } from "@/services/tenant.service";
import { trackWhatsAppIncident } from "@/services/whatsapp-incident.service";
import { trackWhatsAppOnboarding } from "@/services/whatsapp-onboarding-tracking.service";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const ENQUEUE_TIMEOUT_MS = 1000;
const ACK_TIMEOUT_MS = 1500;
const ACK_MESSAGE = "⏳ تم استلام رسالتك، جاري البحث الآن...";

if (!WEBHOOK_SECRET) {
  console.error("WEBHOOK_SECRET environment variable is not set");
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

export async function POST(request: NextRequest) {
  const webhookStart = Date.now();

  try {
    const bodyText = await request.text();
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ ok: true });
    }

    // ── WAHA: session.status ──────────────────────────────
    if (payload?.event === "session.status") {
      const sessionName = payload.session as string;
      const p = payload.payload as Record<string, unknown> | undefined;
      const wahaStatus = p?.status as string | undefined;
      const isOpen = wahaStatus === "WORKING";

      console.log(`[Webhook] ← session.status session=${sessionName} status=${wahaStatus} +${elapsed(webhookStart)}ms`);

      const session = await WhatsAppSessionRepository.getByInstanceId(sessionName);
      if (session) {
        const wasPreviouslyConnected = session.sessionStatus === "connected";
        await WhatsAppSessionRepository.updateStatus(session.id, isOpen ? "connected" : "disconnected");

        if (!isOpen) {
          trackWhatsAppIncident(session.officeId, sessionName, "instance_disconnected", {
            wasConnected: wasPreviouslyConnected, wahaStatus,
          });
        }
        if (isOpen && !wasPreviouslyConnected) {
          trackWhatsAppOnboarding(session.officeId, "whatsapp_connected");
        }
        if (isOpen && !wasPreviouslyConnected && session.phoneNumber &&
          session.phoneNumber !== "pending" && session.phoneNumber !== "auto-detected") {
          WhatsAppService.sendMessage(
            session.phoneNumber,
            "تم ربط حسابك بنجاح مع نظام MQ ✅\n\nالرد الآلي الذكي جاهز لاستقبال رسائل عملائك.",
            session.officeId,
          ).catch((err) => console.warn("confirmation message failed:", err));
        }
      } else {
        console.warn(`[Webhook] session.status: no session for ${sessionName}`);
      }
      return NextResponse.json({ ok: true });
    }

    // ── WAHA: message ─────────────────────────────────────
    if (
      payload?.event === "message" ||
      payload?.event === "message.any"
    ) {
      const sessionName = payload.session as string;
      const p = payload.payload as Record<string, unknown> | undefined;
      if (!p || p.fromMe === true) return NextResponse.json({ ok: true });

      const fromRaw = typeof p.from === "string" ? p.from : "";
      const from = fromRaw
        .replace(/@s\.whatsapp\.net$/i, "")
        .replace(/@c\.us$/i, "")
        .replace(/@lid$/i, "");
      const text = (p.body as string) || "";
      const messageId = (p.id as string) || `waha_${Date.now()}`;

      if (!from || !text) return NextResponse.json({ ok: true });
      if (isDuplicate(messageId)) return NextResponse.json({ ok: true });

      console.log(`[Webhook] ← message from=${from} session=${sessionName} +${elapsed(webhookStart)}ms`);

      const session = await WhatsAppSessionRepository.getByInstanceId(sessionName);
      if (!session) {
        console.error(`[Webhook] DROPPED: no session for ${sessionName} +${elapsed(webhookStart)}ms`);
        return NextResponse.json({ ok: true });
      }

      const officeId = session.officeId;
      let businessPhone = session.phoneNumber;
      if (businessPhone === "pending" || businessPhone === "auto-detected") businessPhone = from;

      MetricsService.track(METRIC.MESSAGES_RECEIVED, 1, { officeId, route: "waha" });

      const ackPromise = WhatsAppService.sendMessage(from, ACK_MESSAGE, officeId)
        .then(() => console.log(`[Webhook] ✓ ack sent to ${from} +${elapsed(webhookStart)}ms`))
        .catch((err: unknown) => console.warn(`[Webhook] ✗ ack failed:`, err));

      let queued = false;
      try {
        await Promise.race([
          enqueueMessage({ messageId, phone: from, message: text, officeId, businessPhone,
            timestamp: new Date().toISOString(), route: "waha", instanceName: sessionName }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Redis enqueue timeout")), ENQUEUE_TIMEOUT_MS)),
        ]);
        queued = true;
        console.log(`[Webhook] ✓ enqueued ${messageId} +${elapsed(webhookStart)}ms`);
      } catch (enqueueError) {
        console.warn(`[Webhook] ✗ enqueue failed +${elapsed(webhookStart)}ms:`,
          enqueueError instanceof Error ? enqueueError.message : enqueueError);
        captureError(enqueueError, { module: "Webhook", action: "enqueueWAHA", officeId });
      }

      if (queued) {
        const remaining = Math.max(0, ACK_TIMEOUT_MS - elapsed(webhookStart));
        await Promise.race([ackPromise, new Promise((r) => setTimeout(r, remaining))]);
        return NextResponse.json({ ok: true, queued: true });
      }

      try {
        await InlineProcessor.process({ messageId, phone: from, message: text,
          officeId, businessPhone, ackSent: true });
      } catch (inlineError) {
        captureError(inlineError, { module: "Webhook", action: "inlineFallback", officeId });
      }
      return NextResponse.json({ ok: true, queued: false });
    }

    // ── Evolution compat: connection.update ───────────────
    if (payload?.event === "connection.update" && payload?.instance) {
      const instanceName = payload.instance as string;
      const data = payload.data as Record<string, unknown> | undefined;
      const isOpen = data?.state === "open";
      const session = await WhatsAppSessionRepository.getByInstanceId(instanceName);
      if (session) {
        const wasPreviouslyConnected = session.sessionStatus === "connected";
        await WhatsAppSessionRepository.updateStatus(session.id, isOpen ? "connected" : "disconnected");
        if (!isOpen) trackWhatsAppIncident(session.officeId, instanceName, "instance_disconnected", { wasConnected: wasPreviouslyConnected });
        if (isOpen && !wasPreviouslyConnected) trackWhatsAppOnboarding(session.officeId, "whatsapp_connected");
      }
      return NextResponse.json({ ok: true });
    }

    // ── Evolution compat: messages.upsert ─────────────────
    if (payload?.event === "messages.upsert" && payload?.instance) {
      const instanceName = payload.instance as string;
      const data = payload.data as Record<string, unknown> | undefined;
      const messages = data?.messages as Record<string, unknown>[] | undefined;
      const msg = messages?.[0];
      const key = msg?.key as Record<string, unknown> | undefined;
      if (!msg || key?.fromMe) return NextResponse.json({ ok: true });

      const from = (key?.remoteJid as string)?.replace("@s.whatsapp.net", "") ?? "";
      const msgBody = msg.message as Record<string, unknown> | undefined;
      const text = (msgBody?.conversation as string) ||
        ((msgBody?.extendedTextMessage as Record<string, unknown>)?.text as string) || "";
      const messageId = (key?.id as string) || `evo_${Date.now()}`;

      if (!from || !text || isDuplicate(messageId)) return NextResponse.json({ ok: true });

      const session = await WhatsAppSessionRepository.getByInstanceId(instanceName);
      if (!session) return NextResponse.json({ ok: true });

      const officeId = session.officeId;
      MetricsService.track(METRIC.MESSAGES_RECEIVED, 1, { officeId, route: "evolution-compat" });
      WhatsAppService.sendMessage(from, ACK_MESSAGE, officeId).catch(() => {});

      try {
        await Promise.race([
          enqueueMessage({ messageId, phone: from, message: text, officeId,
            businessPhone: session.phoneNumber, timestamp: new Date().toISOString(),
            route: "evolution-compat", instanceName }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ENQUEUE_TIMEOUT_MS)),
        ]);
      } catch {
        await InlineProcessor.process({ messageId, phone: from, message: text,
          officeId, businessPhone: session.phoneNumber, ackSent: true }).catch(() => {});
      }
      return NextResponse.json({ ok: true });
    }

    // ── Legacy secret-based ───────────────────────────────
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get("secret");
    if (secret && secret === WEBHOOK_SECRET) {
      const message = WhatsAppService.parseIncomingMessage(payload);
      if (!message || isDuplicate(message.id)) return NextResponse.json({ success: true });

      const tenant = await TenantService.getTenantByWebhook(secret);
      if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

      MetricsService.track(METRIC.MESSAGES_RECEIVED, 1, { officeId: tenant.id, route: "legacy" });
      WhatsAppService.sendMessage(message.phone, ACK_MESSAGE, tenant.id).catch(() => {});

      try {
        await Promise.race([
          enqueueMessage({ messageId: message.id, phone: message.phone, message: message.text,
            officeId: tenant.id, businessPhone: tenant.whatsappNumber || "",
            timestamp: new Date().toISOString(), route: "legacy", tenantId: tenant.id }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ENQUEUE_TIMEOUT_MS)),
        ]);
      } catch (err) {
        captureError(err, { module: "Webhook", action: "enqueueLegacy", officeId: tenant.id });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    captureError(error, { module: "Webhook", action: "POST" });
    MetricsService.track(METRIC.WEBHOOK_ERROR, 1);
    console.error(`[Webhook] handler error total=${elapsed(webhookStart)}ms:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
