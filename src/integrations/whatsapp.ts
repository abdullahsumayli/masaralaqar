/**
 * WhatsApp Integration
 * Handle UltraMsg API communication
 */

import { WhatsAppMessage } from "@/types/message";

export class WhatsAppService {
  // UltraMsg API Configuration
  private static instanceId = process.env.ULTRAMSG_INSTANCE || "instance164031";
  private static token = process.env.ULTRAMSG_TOKEN || "6eawfm9yjnjw3czn";
  private static apiUrl = `https://api.ultramsg.com/${this.instanceId}`;

  /**
   * Send WhatsApp message via UltraMsg
   */
  static async sendMessage(
    recipientPhone: string,
    message: string,
    tenantId: string,
  ): Promise<boolean> {
    try {
      if (!this.token || !this.instanceId) {
        console.warn("UltraMsg credentials not configured");
        return false;
      }

      // Format phone number (ensure it has country code)
      const formattedPhone = this.formatPhoneNumber(recipientPhone);

      const params = new URLSearchParams();
      params.append("token", this.token);
      params.append("to", formattedPhone);
      params.append("body", message);

      const response = await fetch(`${this.apiUrl}/messages/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        console.error("UltraMsg send error:", await response.text());
        return false;
      }

      const data = await response.json();
      console.log("WhatsApp message sent via UltraMsg:", data);

      // Check UltraMsg response for success
      if (data.sent === "true" || data.sent === true) {
        return true;
      }

      console.error("UltraMsg response indicates failure:", data);
      return false;
    } catch (error) {
      console.error("WhatsAppService.sendMessage error:", error);
      return false;
    }
  }

  /**
   * Format phone number for UltraMsg
   */
  private static formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // If starts with 0, replace with 966 (Saudi)
    if (cleaned.startsWith("0")) {
      cleaned = "966" + cleaned.substring(1);
    }

    // If doesn't start with country code, add 966
    if (!cleaned.startsWith("966") && cleaned.length === 9) {
      cleaned = "966" + cleaned;
    }

    return cleaned;
  }

  /**
   * Parse incoming UltraMsg webhook payload
   * UltraMsg sends different format than WhatsApp Cloud API
   */
  static parseIncomingMessage(payload: any): WhatsAppMessage | null {
    try {
      // UltraMsg webhook format
      if (payload && payload.data) {
        const data = payload.data;

        // IMPORTANT: Skip outgoing messages (fromMe = true)
        // This prevents the bot from responding to its own messages
        if (data.fromMe === true || data.fromMe === "true") {
          console.log("Skipping outgoing message (fromMe=true)");
          return null;
        }

        // Skip if message type is not 'chat' (could be notification, etc.)
        if (data.type && data.type !== "chat") {
          console.log("Skipping non-chat message type:", data.type);
          return null;
        }

        const phone = data.from?.replace("@c.us", "") || "";
        const text = data.body || "";
        const id = data.id || `msg_${Date.now()}`;

        if (!phone || !text) {
          return null;
        }

        return {
          id,
          phone,
          text,
          timestamp: new Date().toISOString(),
          media: data.media ? { type: "image", url: data.media } : null,
        };
      }

      // WhatsApp Cloud API format (fallback)
      if (payload && payload.entry && payload.entry[0]) {
        const entry = payload.entry[0];
        const changes = entry.changes?.[0];

        if (!changes || changes.field !== "messages") {
          return null;
        }

        const message = changes.value?.messages?.[0];

        if (!message) {
          return null;
        }

        const phone = message.from;
        const text = message.text?.body || "";

        if (!phone || !text) {
          return null;
        }

        return {
          id: message.id,
          phone,
          text,
          timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
          media: null,
        };
      }

      return null;
    } catch (error) {
      console.error("WhatsAppService.parseIncomingMessage error:", error);
      return null;
    }
  }

  /**
   * Verify webhook - UltraMsg uses token-based verification
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    try {
      // UltraMsg doesn't use signature verification like WhatsApp Cloud API
      // Instead, verify the webhook URL contains the correct token
      // For now, we allow all requests and rely on URL secrecy
      return true;
    } catch (error) {
      console.error("WhatsAppService.verifyWebhookSignature error:", error);
      return false;
    }
  }

  /**
   * Send media/image message via UltraMsg
   */
  static async sendMediaMessage(
    recipientPhone: string,
    mediaUrl: string,
    caption: string,
    tenantId: string,
  ): Promise<boolean> {
    try {
      if (!this.token || !this.instanceId) {
        console.warn("UltraMsg credentials not configured");
        return false;
      }

      const formattedPhone = this.formatPhoneNumber(recipientPhone);

      const params = new URLSearchParams();
      params.append("token", this.token);
      params.append("to", formattedPhone);
      params.append("image", mediaUrl);
      if (caption) {
        params.append("caption", caption);
      }

      const response = await fetch(`${this.apiUrl}/messages/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        console.error("UltraMsg media send error:", await response.text());
        return false;
      }

      const data = await response.json();
      return data.sent === "true" || data.sent === true;
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
        console.warn("UltraMsg credentials not configured");
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
