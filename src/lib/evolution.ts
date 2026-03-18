/**
 * Evolution API v2.x — Connection helpers
 *
 * Multi-tenant: each office has its own instance named office_{officeId}.
 * All functions require an explicit instanceName — no global default.
 *
 * Base URL: https://evo.masaralaqar.com (via Traefik, no direct IP)
 */

const EVO_URL =
  process.env.EVOLUTION_API_URL ||
  process.env.EVOLUTION_URL ||
  "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";

function headers() {
  return { "Content-Type": "application/json", apikey: EVO_KEY };
}

/** Derive a deterministic Evolution instance name from an office UUID */
export function instanceNameForOffice(officeId: string): string {
  return `office_${officeId}`;
}

/** Create a new Evolution instance with webhook pre-configured */
export async function createInstance(instanceName: string) {
  const webhookUrl = `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;

  const res = await fetch(`${EVO_URL}/instance/create`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      instanceName,
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
    if (
      (res.status === 400 || res.status === 409) &&
      text.toLowerCase().includes("exist")
    ) {
      console.log(
        `[evolution] instance "${instanceName}" already exists — setting webhook`,
      );
      await setWebhook(instanceName, webhookUrl).catch((e) =>
        console.error("[evolution] setWebhook after existing:", e),
      );
      return { instance: { instanceName, status: "existing" } };
    }
    console.error(
      `[evolution] createInstance failed (${res.status}):`,
      text,
    );
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }

  return res.json();
}

/** Set/update webhook on an instance */
export async function setWebhook(instanceName: string, webhookUrl?: string) {
  const url =
    webhookUrl ||
    `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;
  const res = await fetch(`${EVO_URL}/webhook/set/${instanceName}`, {
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

/** Get QR code / connection link for a specific instance */
export async function getQRCode(instanceName: string) {
  const res = await fetch(`${EVO_URL}/instance/connect/${instanceName}`, {
    headers: headers(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[evolution] getQRCode failed (${res.status}):`,
      text,
    );
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }

  return res.json();
}

/** Get connection state for a specific instance */
export async function getConnectionState(instanceName: string) {
  const res = await fetch(
    `${EVO_URL}/instance/connectionState/${instanceName}`,
    { headers: headers() },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[evolution] connectionState failed (${res.status}):`,
      text,
    );
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

/** Delete a specific instance */
export async function deleteInstance(instanceName: string) {
  const res = await fetch(`${EVO_URL}/instance/delete/${instanceName}`, {
    method: "DELETE",
    headers: headers(),
  });

  if (!res.ok)
    throw new Error(`Evolution deleteInstance error ${res.status}`);
  return res.json();
}
