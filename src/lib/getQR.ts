/**
 * Evolution API v2.x — Get QR Code helper
 * Instance: saqr (ثابت)
 *
 * يحاول جلب QR code مع retry تلقائي لأن Evolution قد لا يُولّده فوراً.
 */

const EVO_URL      = process.env.EVOLUTION_URL     || "https://evo.masaralaqar.com";
const EVO_KEY      = process.env.EVOLUTION_API_KEY || "iR8QFbVi9XafMvgVt6d4gdgx880Je6VB";
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || "saqr";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getQRCode(_userId?: string) {
  const url = `${EVO_URL}/instance/connect/${EVO_INSTANCE}`;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", apikey: EVO_KEY },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[getQR] attempt ${attempt} failed (${res.status}):`, text);
      throw new Error(`Evolution API error ${res.status}: ${text}`);
    }

    const data = await res.json();

    // Evolution v2 returns { base64, code, count } when ready
    if (data.base64 || data.code || data.qrcode) {
      console.log(`[getQR] QR ready on attempt ${attempt}`);
      return data;
    }

    console.log(
      `[getQR] attempt ${attempt}/${maxRetries}: QR not ready yet (count=${data.count})`,
    );

    if (attempt < maxRetries) await sleep(3000);
  }

  return { count: 0, base64: null, code: null };
}
