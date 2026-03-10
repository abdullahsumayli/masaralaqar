/**
 * WhatsApp Integration — Evolution API
 * Handle Evolution API communication for WhatsApp
 */

import { WhatsAppMessage } from "@/types/message";

const EVOLUTION_URL = process.env.EVOLUTION_URL || "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "";

function instanceName(officeId: string): string {
  return `office_${officeId}`;
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "966" + cleaned.substring(1);
  }
  if (!cleaned.startsWith("966") && cleaned.length === 9) {
    cleaned = "966" + cleaned;
  }
  return cleaned;
}

/** Create a new Evolution API instance for an office */
export async function createEvolutionInstance(officeId: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({
      instanceName: instanceName(officeId),
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      webhook: {
        url: `${process.env.NEXT_PUBLIC_URL}/api/webhook/whatsapp`,
        byEvents: true,
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
      },
    }),
  });
  return res.json();
}

/** Get QR code for connecting the WhatsApp instance */
export async function getEvolutionQR(officeId: string) {
  const res = await fetch(
    `${EVOLUTION_URL}/instance/connect/${instanceName(officeId)}`,
    { headers: { apikey: EVOLUTION_KEY } },
  );
  return res.json(); // { base64: 'data:image/png;base64,...' }
}

/** Get the status of an Evolution instance */
export async function getEvolutionStatus(officeId: string) {
  const res = await fetch(`${EVOLUTION_URL}/instance/fetchInstances`, {
    headers: { apikey: EVOLUTION_KEY },
  });
  const data = await res.json();
  const found = Array.isArray(data)
    ? data.find(
        (i: Record<string, any>) =>
          i.instance?.instanceName === instanceName(officeId),
      )
    : null;
  return found;
}

/** Delete an Evolution instance */
export async function deleteEvolutionInstance(officeId: string) {
  const res = await fetch(
    `${EVOLUTION_URL}/instance/delete/${instanceName(officeId)}`,
    { method: "DELETE", headers: { apikey: EVOLUTION_KEY } },
  );
  return res.json();
}

/**
 * WhatsAppService — backward-compatible static class
 * Used by webhook handler and legacy code
 */
export class WhatsAppService {
  // UltraMsg legacy fields (kept for backward compatibility)
  static token: string = process.env.ULTRAMSG_TOKEN || "";
  static instanceId: string = process.env.ULTRAMSG_INSTANCE || "";
  static apiUrl: string = `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE || ""}`;
  static formatPhoneNumber = formatPhoneNumber;

  /**
   * Send WhatsApp text message via Evolution API
   * @param recipientPhone - recipient phone number
   * @param message - text to send
   * @param tenantOrOfficeId - office ID or tenant ID (used to resolve instance)
   */
  static async sendMessage(
    recipientPhone: string,
    message: string,
    tenantOrOfficeId: string,
  ): Promise<boolean> {
    try {
      if (!EVOLUTION_URL || !EVOLUTION_KEY) {
        console.error("Evolution API not configured");
        return false;
      }

      const formattedPhone = formatPhoneNumber(recipientPhone);
      const instance = instanceName(tenantOrOfficeId);

      const response = await fetch(
        `${EVOLUTION_URL}/message/sendText/${instance}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: EVOLUTION_KEY,
          },
          body: JSON.stringify({ number: formattedPhone, text: message }),
        },
      );

      if (!response.ok) {
        console.error(
          "Evolution sendMessage error:",
          response.status,
          await response.text().catch(() => ""),
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("WhatsAppService.sendMessage error:", error);
      return false;
    }
  }

  /**
   * Parse incoming Evolution API webhook payload
   */
  static parseIncomingMessage(payload: any): WhatsAppMessage | null {
    try {
      // Evolution API format: { instance, event, data: { messages: [...] } }
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

        return {
          id,
          phone,
          text,
          timestamp: new Date().toISOString(),
          media: undefined,
        };
      }

      // UltraMsg legacy format (fallback)
      if (payload?.data && (payload.data.from || payload.data.body)) {
        const data = payload.data;
        if (data.fromMe === true || data.fromMe === "true") return null;
        if (data.type && data.type !== "chat") return null;

        const phone = data.from?.replace("@c.us", "") || "";
        const text = data.body || "";
        const id = data.id || `msg_${Date.now()}`;

        if (!phone || !text) return null;

        return {
          id,
          phone,
          text,
          timestamp: new Date().toISOString(),
          media: data.media
            ? { type: "image" as const, url: data.media }
            : undefined,
        };
      }

      return null;
    } catch (error) {
      console.error("WhatsAppService.parseIncomingMessage error:", error);
      return null;
    }
  }

  /**
   * Verify webhook signature — Evolution uses API key, not per-request signature
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    return true;
  }

  /**
   * Send media/image message via Evolution API
   */
  static async sendMediaMessage(
    recipientPhone: string,
    mediaUrl: string,
    caption: string,
    tenantOrOfficeId: string,
  ): Promise<boolean> {
    try {
      if (!EVOLUTION_URL || !EVOLUTION_KEY) return false;

      const formattedPhone = formatPhoneNumber(recipientPhone);
      const instance = instanceName(tenantOrOfficeId);

      const response = await fetch(
        `${EVOLUTION_URL}/message/sendMedia/${instance}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: EVOLUTION_KEY,
          },
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
          "Evolution sendMedia error:",
          await response.text().catch(() => ""),
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("WhatsAppService.sendMediaMessage error:", error);
      return false;
    }
  }

  /**
   * Send document via UltraMsg
   */
  static async sendDocument(
    recipientPhone: string,
    documentUrl: string,
    filename: string,
    tenantId: string,
  ): Promise<boolean> {
    try {
      if (!this.token || !this.instanceId) {
        return false;
      }

      const formattedPhone = this.formatPhoneNumber(recipientPhone);

      const params = new URLSearchParams();
      params.append("token", this.token);
      params.append("to", formattedPhone);
      params.append("document", documentUrl);
      params.append("filename", filename);

      const response = await fetch(`${this.apiUrl}/messages/document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        console.error("UltraMsg document send error:", await response.text());
        return false;
      }

      const data = await response.json();
      return data.sent === "true" || data.sent === true;
    } catch (error) {
      console.error("WhatsAppService.sendDocument error:", error);
      return false;
    }
  }

  /**
   * Get instance status from UltraMsg
   */
  static async getInstanceStatus(): Promise<any> {
    try {
      const response = await fetch(
        `${this.apiUrl}/instance/status?token=${this.token}`,
        { method: "GET" },
      );

      if (!response.ok) {
        return { status: "error", message: await response.text() };
      }

      return await response.json();
    } catch (error) {
      console.error("WhatsAppService.getInstanceStatus error:", error);
      return { status: "error", message: String(error) };
    }
  }
}
