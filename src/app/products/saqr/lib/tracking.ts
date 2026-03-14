// WhatsApp lead flow URL with pre-filled message
const WHATSAPP_NUMBER = "966545374069";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "مرحباً، أبي أجرب نظام صقر لاستقبال عملاء الواتساب تلقائياً 🏢",
);

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export function trackWhatsAppClick(source: string) {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "whatsapp_cta_click",
      source: "saqr_landing",
      cta_source: source,
    });
  }
}
