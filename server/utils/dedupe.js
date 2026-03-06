import crypto from "crypto";

export const hashMessage = (text = "") => {
  return crypto.createHash("sha256").update(text.trim()).digest("hex");
};

export const isDuplicate = ({
  messageId,
  messageHash,
  lastMessageId,
  lastMessageHash,
  lastMessageAt,
  windowMs = 60000,
}) => {
  if (messageId && lastMessageId && messageId === lastMessageId) return true;
  if (!messageHash || !lastMessageHash) return false;
  if (messageHash !== lastMessageHash) return false;
  if (!lastMessageAt) return false;
  const last = new Date(lastMessageAt).getTime();
  if (Number.isNaN(last)) return false;
  return Date.now() - last <= windowMs;
};
