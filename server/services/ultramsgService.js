import { logger } from "../utils/logger.js";

const getBaseUrl = () => {
  const instance = process.env.ULTRAMSG_INSTANCE;
  return `https://api.ultramsg.com/${instance}`;
};

const sendText = async ({ to, body }) => {
  const token = process.env.ULTRAMSG_TOKEN;
  if (!token) {
    logger.warn("ULTRAMSG_TOKEN is missing");
    return;
  }

  const url = `${getBaseUrl()}/messages/chat`;
  const params = new URLSearchParams({
    token,
    to,
    body,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await response.json().catch(() => ({}));
  return data;
};

const sendImage = async ({ to, image, caption }) => {
  const token = process.env.ULTRAMSG_TOKEN;
  if (!token) {
    logger.warn("ULTRAMSG_TOKEN is missing");
    return;
  }

  const url = `${getBaseUrl()}/messages/image`;
  const params = new URLSearchParams({
    token,
    to,
    image,
    caption: caption || "",
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await response.json().catch(() => ({}));
  return data;
};

export { sendImage, sendText };

