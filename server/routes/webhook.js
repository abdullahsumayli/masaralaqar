import { Router } from "express";
import { createLead } from "../services/leadService.js";
import { matchProperties } from "../services/matchingService.js";
import { extractLeadData } from "../services/openaiService.js";
import { getSession, upsertSession } from "../services/sessionService.js";
import { sendImage, sendText } from "../services/ultramsgService.js";
import { hashMessage, isDuplicate } from "../utils/dedupe.js";
import { logger } from "../utils/logger.js";

const router = Router();

const getIncomingPayload = (body) => {
  const data = body?.data || body;
  const phone = data?.from || data?.sender || data?.phone || data?.chatId;
  const message = data?.body || data?.message || data?.text || "";
  const messageId = data?.id || data?.messageId || data?.msgId || null;
  return { phone, message, messageId };
};

router.post("/webhook/ultramsg", async (req, res) => {
  try {
    const { phone, message, messageId } = getIncomingPayload(req.body);

    if (!phone || !message) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    const session = getSession(phone);
    const messageHash = hashMessage(message);

    if (
      session &&
      isDuplicate({
        messageId,
        messageHash,
        lastMessageId: session.last_message_id,
        lastMessageHash: session.last_message_hash,
        lastMessageAt: session.last_message_at,
      })
    ) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    const context = {
      city: session?.city || null,
      property_type: session?.property_type || null,
      purpose: session?.purpose || null,
      budget: session?.budget || null,
    };

    const ai = await extractLeadData({ message, context });

    const updated = {
      phone,
      city: ai?.city || context.city,
      property_type: ai?.property_type || context.property_type,
      purpose: ai?.purpose || context.purpose,
      budget: ai?.budget || context.budget,
      last_message_hash: messageHash,
      last_message_id: messageId,
      last_message_at: new Date().toISOString(),
    };

    upsertSession(updated);

    const isQualified =
      updated.city &&
      updated.property_type &&
      updated.purpose &&
      updated.budget;

    if (ai?.reply) {
      await sendText({ to: phone, body: ai.reply });
    }

    if (isQualified) {
      createLead({
        phone,
        city: updated.city,
        property_type: updated.property_type,
        purpose: updated.purpose,
        budget: updated.budget,
        message,
      });

      const results = matchProperties(updated);
      if (results.length === 0) {
        await sendText({
          to: phone,
          body: "لم أجد عقارات مطابقة حالياً. هل ترغب في خيارات بديلة؟",
        });
      } else {
        await sendText({
          to: phone,
          body: "هذه أفضل الخيارات المتاحة بناءً على طلبك:",
        });

        for (const property of results) {
          const caption = `${property.title}\nالمدينة: ${property.city}\nالنوع: ${property.property_type}\nالسعر: ${property.price}\nالرابط: ${property.link}`;
          if (property.image) {
            await sendImage({ to: phone, image: property.image, caption });
          } else {
            await sendText({ to: phone, body: caption });
          }
        }
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    logger.error({ err: error }, "Webhook failed");
    return res.status(500).json({ ok: false });
  }
});

export default router;
