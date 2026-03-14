/**
 * Evolution API v2.x — Connection helpers
 * Instance: سقر (saqr) — instance واحد مشترك لكل المنصة
 *
 * Base URL : https://evo.masaralaqar.com
 * API Key  : iR8QFbVi9XafMvgVt6d4gdgx880Je6VB
 * Instance : saqr
 */

const EVO_URL      = process.env.EVOLUTION_URL      || "https://evo.masaralaqar.com";
const EVO_KEY      = process.env.EVOLUTION_API_KEY  || "iR8QFbVi9XafMvgVt6d4gdgx880Je6VB";
export const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || "saqr";

function headers() {
  return { "Content-Type": "application/json", apikey: EVO_KEY };
}

/** Create / ensure the saqr instance exists */
export async function createInstance(_userId?: string) {
  const res = await fetch(`${EVO_URL}/instance/create`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      instanceName: EVO_INSTANCE,
      integration: "WHATSAPP-BAILEYS",
      qrcode: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // 400 / 409 "already exists" → fine, continue
    if ((res.status === 400 || res.status === 409) && text.toLowerCase().includes("exist")) {
      console.log(`[evolution] instance "${EVO_INSTANCE}" already exists`);
      return { instance: { instanceName: EVO_INSTANCE, status: "existing" } };
    }
    console.error(`[evolution] createInstance failed (${res.status}):`, text);
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }

  return res.json();
}

/** Get QR code / connection link for the saqr instance */
export async function getQRCode(_userId?: string) {
  const res = await fetch(`${EVO_URL}/instance/connect/${EVO_INSTANCE}`, {
    headers: headers(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[evolution] getQRCode failed (${res.status}):`, text);
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }

  return res.json(); // { base64: 'data:image/png;base64,...', pairingCode?: '...' }
}

/** Get connection state for the saqr instance */
export async function getConnectionState(_userId?: string) {
  const res = await fetch(
    `${EVO_URL}/instance/connectionState/${EVO_INSTANCE}`,
    { headers: headers() },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`[evolution] connectionState failed (${res.status}):`, text);
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }

  return res.json();
}

/** Fetch all instances (admin use) */
export async function fetchInstances() {
  const res = await fetch(`${EVO_URL}/instance/fetchInstances`, {
    headers: headers(),
  });

  if (!res.ok) throw new Error(`Evolution fetchInstances error ${res.status}`);
  return res.json();
}

/** Delete the saqr instance (or any named instance) */
export async function deleteInstance(instanceName = EVO_INSTANCE) {
  const res = await fetch(`${EVO_URL}/instance/delete/${instanceName}`, {
    method: "DELETE",
    headers: headers(),
  });

  if (!res.ok) throw new Error(`Evolution deleteInstance error ${res.status}`);
  return res.json();
}
