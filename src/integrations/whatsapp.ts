/**
 * WhatsApp Integration — Evolution API v2 (multi-tenant)
 *
 * Each office has its own Evolution instance (office_{officeId}).
 * Instance name is resolved from the whatsapp_sessions table via officeId,
 * with an in-memory cache to avoid repeated DB lookups.
 */

import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { instanceNameForOffice } from "@/lib/evolution";
import { WhatsAppMessage } from "@/types/message";

const EVO_URL =
  process.env.EVOLUTION_API_URL ||
  process.env.EVOLUTION_URL ||
  "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";

function evoHeaders() {
  return { "Content-Type": "application/json", apikey: EVO_KEY };
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "966" + cleaned.substring(1);
  if (!cleaned.startsWith("966") && cleaned.length === 9)
    cleaned = "966" + cleaned;
  return cleaned;
}

// ── Instance Resolution Cache ────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedInstance {
  instanceName: string;
  ts: number;
}

const instanceCache = new Map<string, CachedInstance>();

/**
 * Resolve the Evolution instance name for a given officeId.
 * Checks in-memory cache first, then falls back to DB lookup.
 * If no session exists, derives the default name from the officeId.
 */
async function resolveInstanceName(officeId: string): Promise<string> {
  const cached = instanceCache.get(officeId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.instanceName;
  }

  try {
    const session = await WhatsAppSessionRepository.getByOfficeId(officeId);
    const instanceName =
      session?.instanceId || instanceNameForOffice(officeId);
    instanceCache.set(officeId, {
      instanceName,
      ts: Date.now(),
    });
    return instanceName;
  } catch {
    return instanceNameForOffice(officeId);
  }
}

/** Invalidate cached instance name when sessions change */
export function invalidateInstanceCache(officeId: string): void {
  instanceCache.delete(officeId);
}

// ── Evolution Instance Management ────────────────────────────

const QR_RETRY_ATTEMPTS = 4;
const QR_RETRY_DELAY_MS = 2500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeQRResponse(data: Record<string, unknown>): {
  base64: string | null;
  pairingCode: string | null;
} {
  const base64 =
    (typeof data.base64 === "string" && data.base64 ? data.base64 : null) ||
    (typeof data.qrcode === "object" &&
    data.qrcode &&
    typeof (data.qrcode as Record<string, unknown>).base64 === "string"
      ? (data.qrcode as Record<string, unknown>).base64 as string
      : null) ||
    (typeof data.code === "string" && data.code.startsWith("data:")
      ? data.code
      : null);
  const pairingCode =
    typeof data.pairingCode === "string" && data.pairingCode
      ? data.pairingCode
      : null;
  return { base64, pairingCode };
}

/** Create / ensure an Evolution instance exists for an office */
export async function createEvolutionInstance(instanceName: string) {
  const res = await fetch(`${EVO_URL}/instance/create`, {
    method: "POST",
    headers: evoHeaders(),
    body: JSON.stringify({
      instanceName,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      webhook: {
        url: `${process.env.NEXT_PUBLIC_URL}/api/webhook/whatsapp`,
        byEvents: true,
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
      },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    if (
      (res.status === 400 || res.status === 409) &&
      text.toLowerCase().includes("exist")
    ) {
      return { instance: { instanceName, status: "existing" } };
    }
    throw new Error(`Evolution createInstance ${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/** Get QR code for connecting a specific instance (with retry) */
export async function getEvolutionQR(
  instanceName: string,
  phoneNumber?: string,
) {
  const query = phoneNumber
    ? `?number=${encodeURIComponent(phoneNumber)}`
    : "";
  const url = `${EVO_URL}/instance/connect/${instanceName}${query}`;

  for (let attempt = 1; attempt <= QR_RETRY_ATTEMPTS; attempt++) {
    const res = await fetch(url, { headers: evoHeaders() });
    if (!res.ok)
      throw new Error(
        `Evolution QR ${res.status}: ${await res.text().catch(() => "")}`,
      );

    const data = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const { base64, pairingCode } = normalizeQRResponse(data);

    if (base64 || pairingCode) {
      return { base64, pairingCode, code: data.code ?? null };
    }

    if (attempt < QR_RETRY_ATTEMPTS) {
      await sleep(QR_RETRY_DELAY_MS);
    }
  }

  return { base64: null, pairingCode: null, code: null };
}

/** Set/update webhook URL on a specific instance */
export async function setEvolutionWebhook(
  instanceName: string,
  webhookUrl?: string,
) {
  const url =
    webhookUrl ||
    `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;

  const res = await fetch(`${EVO_URL}/webhook/set/${instanceName}`, {
    method: "POST",
    headers: evoHeaders(),
    body: JSON.stringify({
      url,
      webhook_by_events: true,
      webhook_base64: false,
      events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      `[Evolution] setWebhook failed (${res.status}):`,
      text,
    );
    throw new Error(`Evolution setWebhook ${res.status}: ${text}`);
  }

  const data = await res.json().catch(() => ({}));
  console.log(`[Evolution] Webhook set to: ${url}`, data);
  return data;
}

/** Get current webhook configuration for an instance */
export async function getEvolutionWebhook(instanceName: string) {
  const res = await fetch(`${EVO_URL}/webhook/find/${instanceName}`, {
    headers: evoHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

/** Get live connection state of an instance */
export async function getEvolutionStatus(instanceName: string) {
  const res = await fetch(
    `${EVO_URL}/instance/connectionState/${instanceName}`,
    {
      headers: evoHeaders(),
    },
  );
  if (!res.ok) return null;

  return res.json();
}

/** Delete an instance */
export async function deleteEvolutionInstance(instanceName: string) {
  const res = await fetch(`${EVO_URL}/instance/delete/${instanceName}`, {
    method: "DELETE",
    headers: evoHeaders(),
  });
  if (!res.ok) throw new Error(`Evolution deleteInstance ${res.status}`);
  return res.json();
}

/**
 * WhatsAppService — static class used across the codebase.
 *
 * All methods resolve the Evolution instance from officeId automatically.
 * The third parameter (officeId) is REQUIRED for multi-tenant routing.
 */
export class WhatsAppService {
  static formatPhoneNumber = formatPhoneNumber;

  /** Send a WhatsApp text message via the office's Evolution instance */
  static async sendMessage(
    recipientPhone: string,
    message: string,
    officeId: string,
  ): Promise<boolean> {
    try {
      const instanceName = await resolveInstanceName(officeId);
      const formattedPhone = formatPhoneNumber(recipientPhone);

      const response = await fetch(
        `${EVO_URL}/message/sendText/${instanceName}`,
        {
          method: "POST",
          headers: evoHeaders(),
          body: JSON.stringify({ number: formattedPhone, text: message }),
        },
      );

      if (!response.ok) {
        console.error(
          `[WhatsApp] sendMessage error (instance=${instanceName}):`,
          response.status,
          await response.text().catch(() => ""),
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("[WhatsApp] sendMessage exception:", error);
      return false;
    }
  }

  /** Send an image/media message via the office's Evolution instance */
  static async sendMediaMessage(
    recipientPhone: string,
    mediaUrl: string,
    caption: string,
    officeId: string,
  ): Promise<boolean> {
    try {
      const instanceName = await resolveInstanceName(officeId);
      const formattedPhone = formatPhoneNumber(recipientPhone);

      const response = await fetch(
        `${EVO_URL}/message/sendMedia/${instanceName}`,
        {
          method: "POST",
          headers: evoHeaders(),
          body: JSON.stringify({
            number: formattedPhone,
            mediatype: "image",
            media: mediaUrl,
            caption: caption || "",
          }),
        },
      );

      if (!response.ok) {
        console.error(
          `[WhatsApp] sendMedia error (instance=${instanceName}):`,
          await response.text().catch(() => ""),
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("[WhatsApp] sendMediaMessage exception:", error);
      return false;
    }
  }

  /** Parse incoming Evolution API webhook payload into WhatsAppMessage */
  static parseIncomingMessage(
    payload: Record<string, unknown>,
  ): WhatsAppMessage | null {
    try {
      const data = payload?.data as Record<string, unknown> | undefined;
      if (
        payload?.event === "messages.upsert" &&
        data?.messages
      ) {
        const messages = data.messages as Record<string, unknown>[];
        const msg = messages[0];
        if (!msg) return null;
        const key = msg.key as Record<string, unknown> | undefined;
        if (key?.fromMe) return null;

        const phone =
          (key?.remoteJid as string)?.replace("@s.whatsapp.net", "") || "";
        const msgBody = msg.message as Record<string, unknown> | undefined;
        const text =
          (msgBody?.conversation as string) ||
          ((msgBody?.extendedTextMessage as Record<string, unknown>)
            ?.text as string) ||
          "";
        const id = (key?.id as string) || `msg_${Date.now()}`;

        if (!phone || !text) return null;

        return {
          id,
          phone,
          text,
          timestamp: new Date().toISOString(),
          media: undefined,
        };
      }
      return null;
    } catch (error) {
      console.error("[WhatsApp] parseIncomingMessage error:", error);
      return null;
    }
  }

  /** Evolution uses API key auth — no per-request signature needed */
  static verifyWebhookSignature(
    _payload: string,
    _signature: string,
    _secret: string,
  ): boolean {
    return true;
  }
}
