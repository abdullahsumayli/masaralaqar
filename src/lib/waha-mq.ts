/**
 * WAHA client for MQ test flow — single session (default `mq-test`).
 * Docs: https://waha.devlike.pro/docs/how-to/sessions/
 */

function baseUrl(): string {
  return (process.env.WAHA_API_URL || "").replace(/\/$/, "");
}

export function wahaMqConfigured(): boolean {
  return !!(baseUrl() && process.env.WAHA_API_KEY?.trim());
}

export function wahaMqSessionName(): string {
  return process.env.WAHA_MQ_SESSION?.trim() || "mq-test";
}

export function wahaMqWebhookUrl(): string {
  const site =
    process.env.NEXT_PUBLIC_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return `${site.replace(/\/$/, "")}/api/mq/waha/webhook`;
}

function headers(json = true): HeadersInit {
  const h: Record<string, string> = {
    "X-Api-Key": process.env.WAHA_API_KEY?.trim() || "",
  };
  if (json) {
    h["Accept"] = "application/json";
    h["Content-Type"] = "application/json";
  }
  return h;
}

const enc = (s: string) => encodeURIComponent(s);

export async function wahaGetSession(session: string): Promise<unknown | null> {
  const b = baseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(session)}`, {
    headers: headers(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`WAHA get session ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

/** Start session if stopped (idempotent). */
export async function wahaStartSession(session: string): Promise<void> {
  const b = baseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(session)}/start`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok && res.status !== 409) {
    const t = await res.text();
    throw new Error(`WAHA start ${res.status}: ${t.slice(0, 200)}`);
  }
}

/**
 * Fetch QR as data URL or raw base64 (depends on WAHA version).
 * GET /api/{session}/auth/qr — Accept: application/json
 */
export async function wahaGetQrJson(session: string): Promise<{
  raw: unknown;
  dataUrl: string | null;
}> {
  const b = baseUrl();
  const res = await fetch(`${b}/api/${enc(session)}/auth/qr`, {
    headers: headers(true),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`WAHA QR ${res.status}: ${text.slice(0, 200)}`);
  }
  let raw: unknown = text;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    raw = { _text: text };
  }
  const dataUrl = extractQrDataUrl(raw);
  return { raw, dataUrl };
}

function extractQrDataUrl(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const candidates = [o.qr, o.value, o.base64, o.data, o.image];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) {
      if (c.startsWith("data:image")) return c;
      if (/^[A-Za-z0-9+/=]+$/.test(c.slice(0, 80)))
        return `data:image/png;base64,${c}`;
      return c;
    }
  }
  return null;
}

/** POST /api/sendText */
export async function wahaSendText(
  session: string,
  chatId: string,
  text: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  const b = baseUrl();
  const res = await fetch(`${b}/api/sendText`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ session, chatId, text }),
  });
  const body = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, body };
}

/** Normalize Saudi-style input to WAHA chatId e.g. 9665xxxxxxxx@c.us */
export function phoneToChatId(phone: string): string | null {
  let d = phone.replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0")) d = "966" + d.slice(1);
  if (!d.startsWith("966")) d = "966" + d;
  return `${d}@c.us`;
}
