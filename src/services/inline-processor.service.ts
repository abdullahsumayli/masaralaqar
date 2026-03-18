/**
 * Inline Message Processor — Fallback when Redis/BullMQ is unavailable.
 *
 * Processes WhatsApp messages synchronously within the webhook request.
 * Slower than the queue path (~3-8s vs <50ms response), but ensures
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
  /** When true, webhook already sent an ack — skip sending our own fallback ack */
  ackSent?: boolean;
}

export class InlineProcessor {
  static async process(data: InlinePayload): Promise<boolean> {
    const { phone, message, officeId, businessPhone, messageId, ackSent } =
      data;
    const start = Date.now();

    try {
      console.log(
        `[Inline] ← processing ${messageId} office=${officeId} ackSent=${!!ackSent}`,
      );

      // 1. Create or update lead
      const leadStart = Date.now();
      const lead = await LeadService.createLeadFromMessage(
        officeId,
        phone,
        data.senderName || "",
        message,
        "whatsapp",
        officeId,
      );
      console.log(`[Inline] lead resolved in ${Date.now() - leadStart}ms`);

      // 2. Save incoming message
      if (lead) {
        await ConversationService.saveUserMessage(
          officeId,
          lead.id,
          message,
          officeId,
        );
      }

      // 3. Get conversation history
      const conversationHistory = lead
        ? await ConversationService.getConversationHistory(lead.id, 8)
        : [];

      // 4. Process via AI Engine
      const aiStart = Date.now();
      const engineResult = await AIEngine.processMessage(
        businessPhone,
        { phone, text: message, messageId },
        conversationHistory,
        officeId,
      );
      console.log(`[Inline] AI responded in ${Date.now() - aiStart}ms`);

      if (!engineResult) {
        console.warn("[Inline] AI returned null");
        if (!ackSent) {
          await WhatsAppService.sendMessage(
            phone,
            "مرحباً! شكراً لتواصلك. سيتم الرد عليك في أقرب وقت ممكن.",
            officeId,
          ).catch(() => {});
        }
        console.log(`[Inline] → done (no AI) total=${Date.now() - start}ms`);
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
        console.error(`[Inline] ✗ send failed to ${phone}`);
        return false;
      }

      // 7. Send property images (max 2 in inline mode)
      if (engineResult.properties?.length) {
        let imagesSent = 0;
        for (const property of engineResult.properties) {
          if (imagesSent >= 2) break;
          const images = property.images;
          const imageUrl =
            (Array.isArray(images) ? images[0] : undefined) ||
            property.image_url;
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

      console.log(
        `[Inline] ✓ done ${messageId} total=${Date.now() - start}ms`,
      );
      return true;
    } catch (error) {
      console.error(
        `[Inline] ✗ error total=${Date.now() - start}ms:`,
        error,
      );

      if (!ackSent) {
        try {
          await WhatsAppService.sendMessage(
            phone,
            "مرحباً! شكراً لتواصلك. سيتم الرد عليك قريباً.",
            officeId,
          );
        } catch {}
      }

      try {
        await supabaseAdmin.from("failed_messages").insert({
          message_id: messageId,
          phone,
          message_text: message,
          office_id: officeId,
          route: "inline-fallback",
          error_message:
            error instanceof Error ? error.message : String(error),
          attempts: 1,
        });
      } catch {}

      return false;
    }
  }
}
