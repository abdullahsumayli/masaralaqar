/**
 * WhatsApp Integration — Evolution API v2
 * Base URL: https://evo.masaralaqar.com (via Traefik). Instance: saqr (مشترك).
 */

import { WhatsAppMessage } from "@/types/message";

const EVO_URL =
  process.env.EVOLUTION_API_URL ||
  process.env.EVOLUTION_URL ||
  "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || "saqr";

function evoHeaders() {
  return { "Content-Type": "application/json", apikey: EVO_KEY };
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "966" + cleaned.substring(1);
  if (!cleaned.startsWith("966") && cleaned.length === 9) cleaned = "966" + cleaned;
  return cleaned;
}

/** Create / ensure the saqr instance exists */
export async function createEvolutionInstance(_officeId?: string) {
  const res = await fetch(`${EVO_URL}/instance/create`, {
    method: "POST",
    headers: evoHeaders(),
    body: JSON.stringify({
      instanceName: EVO_INSTANCE,
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
    if ((res.status === 400 || res.status === 409) && text.toLowerCase().includes("exist")) {
      return { instance: { instanceName: EVO_INSTANCE, status: "existing" } };
    }
    throw new Error(`Evolution createInstance ${res.status}: ${text}`);
  }

  try { return JSON.parse(text); } catch { return {}; }
}

/** Evolution API v2 may return base64, code (data URL), or only pairingCode; sometimes count:0 at first — retry */
const QR_RETRY_ATTEMPTS = 4;
const QR_RETRY_DELAY_MS = 2500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Normalize Evolution connect response to { base64, pairingCode } for UI */
function normalizeQRResponse(data: Record<string, unknown>): { base64: string | null; pairingCode: string | null } {
  const base64 =
    (typeof data.base64 === "string" && data.base64 ? data.base64 : null) ||
    (typeof data.qrcode === "object" && data.qrcode && typeof (data.qrcode as any).base64 === "string"
      ? (data.qrcode as any).base64
      : null) ||
    (typeof data.code === "string" && data.code.startsWith("data:")
      ? data.code
      : null);
  const pairingCode =
    typeof data.pairingCode === "string" && data.pairingCode ? data.pairingCode : null;
  return { base64, pairingCode };
}

/** Get QR code for connecting the saqr instance (with retry — Evolution may return count:0 at first) */
export async function getEvolutionQR(_officeId?: string, phoneNumber?: string) {
  const query = phoneNumber ? `?number=${encodeURIComponent(phoneNumber)}` : "";
  const url = `${EVO_URL}/instance/connect/${EVO_INSTANCE}${query}`;

  for (let attempt = 1; attempt <= QR_RETRY_ATTEMPTS; attempt++) {
    const res = await fetch(url, { headers: evoHeaders() });
    if (!res.ok) throw new Error(`Evolution QR ${res.status}: ${await res.text().catch(() => "")}`);

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
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

/** Get live connection state of the saqr instance */
export async function getEvolutionStatus(_officeId?: string) {
  const res = await fetch(`${EVO_URL}/instance/fetchInstances`, {
    headers: evoHeaders(),
  });
  if (!res.ok) return null;

  const data = await res.json();
  const list = Array.isArray(data) ? data : [];
  return list.find(
    (i: Record<string, any>) =>
      i.instance?.instanceName === EVO_INSTANCE ||
      i.instanceName === EVO_INSTANCE,
  ) || null;
}

/** Delete the saqr instance */
export async function deleteEvolutionInstance(_officeId?: string) {
  const res = await fetch(`${EVO_URL}/instance/delete/${EVO_INSTANCE}`, {
    method: "DELETE",
    headers: evoHeaders(),
  });
  if (!res.ok) throw new Error(`Evolution deleteInstance ${res.status}`);
  return res.json();
}

/**
 * WhatsAppService — static class used across the codebase
 */
export class WhatsAppService {
  static formatPhoneNumber = formatPhoneNumber;

  /** Send a WhatsApp text message via the saqr instance */
  static async sendMessage(
    recipientPhone: string,
    message: string,
    _tenantOrOfficeId?: string, // kept for backward compat — no longer used
  ): Promise<boolean> {
    try {
      const formattedPhone = formatPhoneNumber(recipientPhone);

      const response = await fetch(
        `${EVO_URL}/message/sendText/${EVO_INSTANCE}`,
        {
          method: "POST",
          headers: evoHeaders(),
          body: JSON.stringify({ number: formattedPhone, text: message }),
        },
      );

      if (!response.ok) {
        console.error(
          "[WhatsApp] sendMessage error:",
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

  /** Send an image/media message via the saqr instance */
  static async sendMediaMessage(
    recipientPhone: string,
    mediaUrl: string,
    caption: string,
    _tenantOrOfficeId?: string,
  ): Promise<boolean> {
    try {
      const formattedPhone = formatPhoneNumber(recipientPhone);

      const response = await fetch(
        `${EVO_URL}/message/sendMedia/${EVO_INSTANCE}`,
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
          "[WhatsApp] sendMedia error:",
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
  static parseIncomingMessage(payload: any): WhatsAppMessage | null {
    try {
      if (payload?.event === "messages.upsert" && payload?.data?.messages) {
        const msg = payload.data.messages[0];
        if (!msg || msg.key?.fromMe) return null;

        const phone = msg.key?.remoteJid?.replace("@s.whatsapp.net", "") || "";
        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          "";
        const id = msg.key?.id || `msg_${Date.now()}`;

        if (!phone || !text) return null;

        return { id, phone, text, timestamp: new Date().toISOString(), media: undefined };
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
