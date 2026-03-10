import { Router } from "express";
import { createLead } from "../services/leadService.js";
import { matchProperties } from "../services/matchingService.js";
import { extractLeadData } from "../services/openaiService.js";
import { getSession, upsertSession } from "../services/sessionService.js";
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

// UltraMsg integration removed. Waiting for new WhatsApp provider details.
router.all("/webhook/ultramsg", (req, res) => {
  return res.status(410).json({
    ok: false,
    message: "UltraMsg webhook has been removed. Configure the new provider.",
  });
});

export default router;
