/**
 * Evolution API v2.x — Get QR Code helper (multi-tenant).
 * Base URL: https://evo.masaralaqar.com
 */

const EVO_URL =
  process.env.EVOLUTION_API_URL ||
  process.env.EVOLUTION_URL ||
  "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getQRCode(instanceName: string) {
  const url = `${EVO_URL}/instance/connect/${instanceName}`;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", apikey: EVO_KEY },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(
        `[getQR] attempt ${attempt} failed (${res.status}):`,
        text,
      );
      throw new Error(`Evolution API error ${res.status}: ${text}`);
    }

    const data = await res.json();

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
