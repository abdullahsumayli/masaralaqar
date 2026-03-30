/**
 * WAHA HTTP API — shared client (multi-tenant sessions).
 * https://waha.devlike.pro/docs/how-to/sessions/
 */

export function wahaBaseUrl(): string {
  return (process.env.WAHA_API_URL || "").replace(/\/$/, "");
}

export function wahaApiKey(): string {
  return process.env.WAHA_API_KEY?.trim() || "";
}

export function wahaConfigured(): boolean {
  return !!(wahaBaseUrl() && wahaApiKey());
}

export function defaultWebhookUrl(): string {
  const site =
    process.env.NEXT_PUBLIC_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return `${site.replace(/\/$/, "")}/api/webhook/whatsapp`;
}

function headers(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Api-Key": wahaApiKey(),
  };
}

const enc = (s: string) => encodeURIComponent(s);

export async function wahaFetchSession(
  sessionName: string,
): Promise<Record<string, unknown> | null> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(sessionName)}`, {
    headers: headers(),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`WAHA get session ${res.status}: ${t.slice(0, 200)}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

export function wahaStatusToOpen(state: string): boolean {
  return String(state).toUpperCase() === "WORKING";
}

/** Map WAHA session.status to Evolution-compatible { instance.state } for existing callers. */
export function wahaLivePayload(sessionJson: Record<string, unknown> | null): {
  instance: { state: string };
} | null {
  if (!sessionJson) return null;
  const st = String(sessionJson.status ?? "");
  return {
    instance: { state: wahaStatusToOpen(st) ? "open" : "close" },
  };
}

export async function wahaCreateSession(
  sessionName: string,
  webhookUrl: string,
): Promise<unknown> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      name: sessionName,
      config: {
        webhooks: [
          {
            url: webhookUrl,
            events: ["message", "session.status"],
          },
        ],
      },
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    if (
      (res.status === 400 || res.status === 409) &&
      text.toLowerCase().includes("exist")
    ) {
      return { name: sessionName, existing: true };
    }
    throw new Error(`WAHA create session ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function wahaSyncWebhooks(
  sessionName: string,
  webhookUrl: string,
): Promise<void> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(sessionName)}/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      config: {
        webhooks: [
          {
            url: webhookUrl,
            events: ["message", "session.status"],
          },
        ],
      },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`WAHA sync webhooks ${res.status}: ${t.slice(0, 300)}`);
  }
}

export async function wahaStartSession(sessionName: string): Promise<void> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(sessionName)}/start`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok && res.status !== 409) {
    const t = await res.text();
    throw new Error(`WAHA start ${res.status}: ${t.slice(0, 200)}`);
  }
}

export async function wahaRestartSession(sessionName: string): Promise<void> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(sessionName)}/restart`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok && res.status !== 409) {
    const t = await res.text();
    throw new Error(`WAHA restart ${res.status}: ${t.slice(0, 200)}`);
  }
}

export async function wahaDeleteSession(sessionName: string): Promise<void> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(sessionName)}/`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok && res.status !== 404) {
    const t = await res.text();
    throw new Error(`WAHA delete ${res.status}: ${t.slice(0, 200)}`);
  }
}

export async function wahaLogoutSession(sessionName: string): Promise<void> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions/${enc(sessionName)}/logout`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok && res.status !== 404) {
    const t = await res.text();
    throw new Error(`WAHA logout ${res.status}: ${t.slice(0, 200)}`);
  }
}

function extractQrBase64(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const candidates = [o.qr, o.value, o.base64, o.data];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) {
      if (c.startsWith("data:image")) return c;
      if (/^[A-Za-z0-9+/=]+$/.test(c.slice(0, 100)))
        return `data:image/png;base64,${c}`;
      return c;
    }
  }
  return null;
}

export async function wahaFetchQrJson(sessionName: string): Promise<{
  base64: string | null;
  raw: unknown;
}> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/${enc(sessionName)}/auth/qr`, {
    headers: headers(),
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
  return { base64: extractQrBase64(raw), raw };
}

export async function wahaSendText(
  sessionName: string,
  chatId: string,
  text: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sendText`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ session: sessionName, chatId, text }),
  });
  const body = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, body };
}

export async function wahaSendImage(
  sessionName: string,
  chatId: string,
  imageUrl: string,
  caption: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sendImage`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      session: sessionName,
      chatId,
      caption: caption || "",
      file: {
        mimetype: "image/jpeg",
        url: imageUrl,
        filename: "image.jpg",
      },
    }),
  });
  const body = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, body };
}

/** Health: list sessions endpoint. */
export async function wahaPing(): Promise<{ ok: boolean; status: number }> {
  const b = wahaBaseUrl();
  const res = await fetch(`${b}/api/sessions/`, {
    headers: { ...headers(), Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });
  return { ok: res.ok, status: res.status };
}
