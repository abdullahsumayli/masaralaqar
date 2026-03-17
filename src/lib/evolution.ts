/**
 * Evolution API v2.x — Connection helpers
 * Instance: سقر (saqr) — instance واحد مشترك لكل المنصة
 * Base URL: https://evo.masaralaqar.com (via Traefik, no direct IP)
 */

const EVO_URL =
  process.env.EVOLUTION_API_URL ||
  process.env.EVOLUTION_URL ||
  "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";
export const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || "saqr";

function headers() {
  return { "Content-Type": "application/json", apikey: EVO_KEY };
}

/** Create / ensure the saqr instance exists (with webhook) */
export async function createInstance(_userId?: string) {
  const webhookUrl = `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;

  const res = await fetch(`${EVO_URL}/instance/create`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      instanceName: EVO_INSTANCE,
      integration: "WHATSAPP-BAILEYS",
      qrcode: true,
      webhook: {
        url: webhookUrl,
        byEvents: true,
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // 400 / 409 "already exists" → set webhook anyway, then return
    if ((res.status === 400 || res.status === 409) && text.toLowerCase().includes("exist")) {
      console.log(`[evolution] instance "${EVO_INSTANCE}" already exists — setting webhook`);
      await setWebhook(webhookUrl).catch((e) =>
        console.error("[evolution] setWebhook after existing:", e),
      );
      return { instance: { instanceName: EVO_INSTANCE, status: "existing" } };
    }
    console.error(`[evolution] createInstance failed (${res.status}):`, text);
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }

  return res.json();
}

/** Set/update webhook on the saqr instance */
export async function setWebhook(webhookUrl?: string) {
  const url = webhookUrl || `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;
  const res = await fetch(`${EVO_URL}/webhook/set/${EVO_INSTANCE}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      url,
      webhook_by_events: true,
      webhook_base64: false,
      events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Evolution setWebhook ${res.status}: ${text}`);
  }
  return res.json().catch(() => ({}));
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
