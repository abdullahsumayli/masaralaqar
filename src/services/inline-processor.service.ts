/**
 * Inline Message Processor — Fallback when Redis/BullMQ is unavailable.
 *
 * Processes WhatsApp messages synchronously within the webhook request.
 * Slower than the queue path (~2-5s vs <50ms response), but ensures
 * messages are NEVER silently dropped when Redis is down.
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { supabaseAdmin } from "@/lib/supabase";
import { AIEngine } from "./ai-engine.service";
import { ConversationService } from "./conversation.service";
import { LeadService } from "./lead.service";

interface InlinePayload {
  messageId: string;
  phone: string;
  message: string;
  officeId: string;
  businessPhone: string;
  senderName?: string;
}

export class InlineProcessor {
  static async process(data: InlinePayload): Promise<boolean> {
    const { phone, message, officeId, businessPhone, messageId } = data;

    try {
      console.log(`[InlineProcessor] Processing message ${messageId} for office ${officeId}`);

      // 1. Create or update lead
      const lead = await LeadService.createLeadFromMessage(
        officeId,
        phone,
        data.senderName || "",
        message,
        "whatsapp",
        officeId,
      );

      // 2. Save incoming message
      if (lead) {
        await ConversationService.saveUserMessage(officeId, lead.id, message, officeId);
      }

      // 3. Get conversation history
      const conversationHistory = lead
        ? await ConversationService.getConversationHistory(lead.id, 12)
        : [];

      // 4. Process via AI Engine
      const engineResult = await AIEngine.processMessage(
        businessPhone,
        { phone, text: message, messageId },
        conversationHistory,
        officeId, // pass directly to skip phone lookup
      );

      if (!engineResult) {
        console.warn("[InlineProcessor] AI returned null — sending fallback");
        await WhatsAppService.sendMessage(
          phone,
          "مرحباً! شكراً لتواصلك. سيتم الرد عليك في أقرب وقت ممكن.",
          officeId,
        ).catch(() => {});
        return true;
      }

      // 5. Save assistant reply
      if (lead) {
        await ConversationService.saveAssistantMessage(
          officeId,
          lead.id,
          engineResult.reply,
          officeId,
        );
      }

      // 6. Send reply
      const sent = await WhatsAppService.sendMessage(
        phone,
        engineResult.reply,
        officeId,
      );

      if (!sent) {
        console.error(`[InlineProcessor] Failed to send reply to ${phone}`);
        return false;
      }

      // 7. Send property images (max 2 in inline mode to keep it fast)
      if (engineResult.properties?.length) {
        let imagesSent = 0;
        for (const property of engineResult.properties) {
          if (imagesSent >= 2) break;
          const images = property.images;
          const imageUrl =
            (Array.isArray(images) ? images[0] : undefined) || property.image_url;
          if (imageUrl) {
            const caption = `🏠 ${property.title}\n📍 ${property.city || property.location}\n💰 ${(property.price as number)?.toLocaleString()} ريال`;
            await WhatsAppService.sendMediaMessage(
              phone,
              imageUrl as string,
              caption,
              officeId,
            );
            imagesSent++;
          }
        }
      }

      console.log(`[InlineProcessor] Message ${messageId} processed successfully`);
      return true;
    } catch (error) {
      console.error("[InlineProcessor] Error:", error);

      // Last resort: send a basic reply so the customer isn't left hanging
      try {
        await WhatsAppService.sendMessage(
          phone,
          "مرحباً! شكراً لتواصلك. سيتم الرد عليك قريباً.",
          officeId,
        );
      } catch {}

      // Log to failed_messages for debugging
      try {
        await supabaseAdmin.from("failed_messages").insert({
          message_id: messageId,
          phone,
          message_text: message,
          office_id: officeId,
          route: "inline-fallback",
          error_message: error instanceof Error ? error.message : String(error),
          attempts: 1,
        });
      } catch {}

      return false;
    }
  }
}
