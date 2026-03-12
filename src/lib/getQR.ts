/**
 * Evolution API v2.x — Get QR Code helper
 * Isolated module: does NOT modify any existing files.
 *
 * In Evolution v2, QR may not be ready immediately after instance creation.
 * This function retries up to 3 times with a 3-second delay.
 */

const EVO_URL = process.env.EVOLUTION_URL || "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getQRCode(userId: string) {
  const instanceName = `user_${userId}`;
  const url = `${EVO_URL}/instance/connect/${instanceName}`;

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, { headers: { apikey: EVO_KEY } });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[getQR] attempt ${attempt} failed (${res.status}):`, text);
      throw new Error(`Evolution API error ${res.status}`);
    }

    const data = await res.json();

    // v2 returns { base64, code, count } when ready, or { count: 0 } when not
    if (data.base64 || data.code || data.qrcode) {
      return data;
    }

    console.log(
      `[getQR] attempt ${attempt}/${maxRetries}: QR not ready yet (count=${data.count})`,
    );

    if (attempt < maxRetries) {
      await sleep(3000);
    }
  }

  // Return whatever we got — the frontend will handle { count: 0 }
  return { count: 0, base64: null, code: null };
}
