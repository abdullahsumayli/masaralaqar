/**
 * WhatsApp Webhook Handler
 * Receives messages from Evolution API
 * Integrated with AI Engine for multi-tenant office routing
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { captureError } from "@/lib/sentry";
import { enqueueMessage } from "@/queues/message.queue";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { METRIC, MetricsService } from "@/services/metrics.service";
import { TenantService } from "@/services/tenant.service";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error("WEBHOOK_SECRET environment variable is not set");
}

// Simple in-memory cache to prevent duplicate message processing
const processedMessages = new Set<string>();
const MAX_CACHE_SIZE = 1000;

function addToProcessedCache(messageId: string) {
  if (processedMessages.size >= MAX_CACHE_SIZE) {
    const iterator = processedMessages.values();
    for (let i = 0; i < 100; i++) {
      const value = iterator.next().value;
      if (value) processedMessages.delete(value);
    }
  }
  processedMessages.add(messageId);
}

/**
 * GET: Webhook verification
 */
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

/**
 * POST: Handle incoming messages from Evolution API
 */
export async function POST(request: NextRequest) {
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

    // ── Evolution API Format ──────────────────────────────────────
    if (payload?.instance && payload?.event) {
      const instanceName = payload.instance as string;
      console.log(`[Webhook] event=${payload.event} instance=${instanceName}`);

      // Handle connection status updates
      if (payload.event === "connection.update") {
        const isOpen = payload.data?.state === "open";
        console.log(`[Webhook] connection.update state=${payload.data?.state} isOpen=${isOpen}`);

        // getByInstanceId now falls back to pending/disconnected sessions
        const session = await WhatsAppSessionRepository.getByInstanceId(instanceName);
        if (session) {
          await WhatsAppSessionRepository.updateStatus(
            session.id,
            isOpen ? "connected" : "disconnected",
          );
          console.log(`[Webhook] connection.update → office ${session.officeId} (session ${session.id}): ${isOpen ? "connected" : "disconnected"}`);
        } else {
          const legacyOfficeId = instanceName.replace("office_", "");
          const legacySession = await WhatsAppSessionRepository.getByOfficeId(legacyOfficeId);
          if (legacySession) {
            await WhatsAppSessionRepository.updateStatus(
              legacySession.id,
              isOpen ? "connected" : "disconnected",
            );
            console.log(`[Webhook] connection.update (legacy) → office ${legacyOfficeId}: ${isOpen ? "connected" : "disconnected"}`);
          } else {
            console.error(`[Webhook] connection.update: NO session found for instance=${instanceName}`);
          }
        }
        return NextResponse.json({ ok: true });
      }

      // Handle incoming messages
      if (payload.event === "messages.upsert") {
        const msg = payload.data?.messages?.[0];
        if (!msg || msg.key?.fromMe) {
          return NextResponse.json({ ok: true });
        }

        const from = msg.key?.remoteJid?.replace("@s.whatsapp.net", "") ?? "";
        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          "";
        const messageId = msg.key?.id || `evo_${Date.now()}`;

        if (!from || !text) {
          return NextResponse.json({ ok: true });
        }

        if (processedMessages.has(messageId)) {
          return NextResponse.json({ ok: true });
        }
        addToProcessedCache(messageId);

        let officeId = "";
        let businessPhone = "";

        const instanceSession = await WhatsAppSessionRepository.getByInstanceId(instanceName);
        if (instanceSession) {
          officeId = instanceSession.officeId;
          businessPhone = instanceSession.phoneNumber;
        } else {
          const legacyOfficeId = instanceName.replace("office_", "");
          const legacySession = await WhatsAppSessionRepository.getByOfficeId(legacyOfficeId);
          if (legacySession) {
            officeId = legacySession.officeId;
            businessPhone = legacySession.phoneNumber;
          }
        }

        if (!officeId) {
          console.error(`[Webhook] DROPPED: No office found for instance=${instanceName}. Check whatsapp_sessions table has a row with instance_id="${instanceName}".`);
          return NextResponse.json({ ok: true });
        }

        if (!businessPhone) {
          console.error(`[Webhook] DROPPED: No phone for office=${officeId}. Check whatsapp_sessions.phone_number.`);
          return NextResponse.json({ ok: true });
        }

        console.log(`[Webhook] messages.upsert from=${from} office=${officeId} phone=${businessPhone}`);

        MetricsService.track(METRIC.MESSAGES_RECEIVED, 1, {
          officeId,
          route: "evolution",
        });

        try {
          await enqueueMessage({
            messageId,
            phone: from,
            message: text,
            officeId,
            businessPhone,
            timestamp: new Date().toISOString(),
            route: "evolution",
          });
        } catch (enqueueError) {
          captureError(enqueueError, {
            module: "Webhook",
            action: "enqueueEvolution",
            officeId,
          });
          return NextResponse.json(
            { error: "Failed to enqueue" },
            { status: 500 },
          );
        }

        return NextResponse.json({ ok: true });
      }

      // Other Evolution events
      return NextResponse.json({ ok: true });
    }

    // ── Fallback: Legacy format ─────────────────────────────────────
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

    if (processedMessages.has(message.id)) {
      return NextResponse.json({ success: true, message: "Duplicate ignored" });
    }
    addToProcessedCache(message.id);

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

    try {
      await enqueueMessage({
        messageId: message.id,
        phone: message.phone,
        message: message.text,
        officeId: tenant.id,
        businessPhone: tenant.whatsappNumber || "",
        timestamp: new Date().toISOString(),
        route: "legacy",
        tenantId: tenant.id,
      });
    } catch (enqueueError) {
      captureError(enqueueError, {
        module: "Webhook",
        action: "enqueueLegacy",
        officeId: tenant.id,
      });
      return NextResponse.json(
        { error: "Failed to enqueue" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    captureError(error, { module: "Webhook", action: "POST" });
    MetricsService.track(METRIC.WEBHOOK_ERROR, 1);
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
