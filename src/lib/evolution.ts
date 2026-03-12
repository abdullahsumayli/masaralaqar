/**
 * Evolution API v2.x — Create Instance & Connection helpers
 * Isolated module: does NOT modify any existing files.
 */

const EVO_URL = process.env.EVOLUTION_URL || "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";

export async function createInstance(userId: string) {
  const instanceName = `user_${userId}`;

  // Try to create — may already exist (409), which is fine
  const res = await fetch(`${EVO_URL}/instance/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: EVO_KEY,
    },
    body: JSON.stringify({
      instanceName,
      integration: "WHATSAPP-BAILEYS",
      qrcode: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // 400 "already exists" is okay — we'll fetch QR separately
    if (res.status === 400 && text.includes("already")) {
      console.log(`[evolution] instance ${instanceName} already exists`);
      return { instance: { instanceName, status: "existing" } };
    }
    console.error(`[evolution] createInstance failed (${res.status}):`, text);
    throw new Error(`Evolution API error ${res.status}`);
  }

  return res.json();
}

export async function getConnectionState(userId: string) {
  const instanceName = `user_${userId}`;

  const res = await fetch(
    `${EVO_URL}/instance/connectionState/${instanceName}`,
    { headers: { apikey: EVO_KEY } },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`[evolution] connectionState failed (${res.status}):`, text);
    throw new Error(`Evolution API error ${res.status}`);
  }

  return res.json();
}
