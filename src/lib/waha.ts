/**
 * WAHA (WhatsApp HTTP API) — Low-level helpers
 *
 * Drop-in replacement for Evolution API.
 * Each office gets its own WAHA session named office_{officeId}.
 *
 * Base URL: WAHA_URL env var (falls back to EVOLUTION_API_URL for compat)
 * Auth:     X-Api-Key header (WAHA_API_KEY or EVOLUTION_API_KEY)
 */

const WAHA_URL =
  process.env.WAHA_URL ||
  process.env.EVOLUTION_API_URL ||
  process.env.EVOLUTION_URL ||
  "https://waha.masaralaqar.com";

const WAHA_KEY =
  process.env.WAHA_API_KEY ||
  process.env.EVOLUTION_API_KEY ||
  "";

export function wahaHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Api-Key": WAHA_KEY,
  };
}

/** Derive deterministic session name from office UUID */
export function instanceNameForOffice(officeId: string): string {
  return `office_${officeId}`;
}

/** Format phone to WAHA chatId: 966501234567 → 966501234567@c.us */
export function toChatId(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return `${cleaned}@c.us`;
}

// ── Session Management ────────────────────────────────────────

export interface WAHASessionStatus {
  name: string;
  status: "WORKING" | "SCAN_QR_CODE" | "FAILED" | "STOPPED" | "STARTING";
}

/** Create a new WAHA session with webhook pre-configured */
export async function createSession(sessionName: string): Promise<void> {
  const webhookUrl = `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;

  const res = await fetch(`${WAHA_URL}/api/sessions`, {
    method: "POST",
    headers: wahaHeaders(),
    body: JSON.stringify({
      name: sessionName,
      config: {
        webhooks: [
          {
            url: webhookUrl,
            events: ["message", "session.status"],
            retries: { delaySeconds: 2, attempts: 3 },
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // 422 = session already exists in WAHA
    if (res.status === 422 || text.toLowerCase().includes("exist")) {
      console.log(`[WAHA] session "${sessionName}" already exists`);
      return;
    }
    throw new Error(`WAHA createSession ${res.status}: ${text}`);
  }
}

/** Start a stopped session */
export async function startSession(sessionName: string): Promise<void> {
  const res = await fetch(`${WAHA_URL}/api/sessions/${sessionName}/start`, {
    method: "POST",
    headers: wahaHeaders(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WAHA startSession ${res.status}: ${text}`);
  }
}

/** Stop a session (keeps session, just disconnects) */
export async function stopSession(sessionName: string): Promise<void> {
  const res = await fetch(`${WAHA_URL}/api/sessions/${sessionName}/stop`, {
    method: "POST",
    headers: wahaHeaders(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WAHA stopSession ${res.status}: ${text}`);
  }
}

/** Delete a session permanently */
export async function deleteSession(sessionName: string): Promise<void> {
  const res = await fetch(`${WAHA_URL}/api/sessions/${sessionName}`, {
    method: "DELETE",
    headers: wahaHeaders(),
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => "");
    throw new Error(`WAHA deleteSession ${res.status}: ${text}`);
  }
}

/** Get session status */
export async function getSessionStatus(
  sessionName: string,
): Promise<WAHASessionStatus | null> {
  const res = await fetch(`${WAHA_URL}/api/sessions/${sessionName}`, {
    headers: wahaHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

/** List all sessions */
export async function listSessions(): Promise<WAHASessionStatus[]> {
  const res = await fetch(`${WAHA_URL}/api/sessions`, {
    headers: wahaHeaders(),
  });
  if (!res.ok) throw new Error(`WAHA listSessions ${res.status}`);
  return res.json();
}

/** Set/update webhook on a session */
export async function setSessionWebhook(
  sessionName: string,
  webhookUrl?: string,
): Promise<void> {
  const url =
    webhookUrl ||
    `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;

  const res = await fetch(`${WAHA_URL}/api/sessions/${sessionName}`, {
    method: "PATCH",
    headers: wahaHeaders(),
    body: JSON.stringify({
      config: {
        webhooks: [
          {
            url,
            events: ["message", "session.status"],
            retries: { delaySeconds: 2, attempts: 3 },
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WAHA setWebhook ${res.status}: ${text}`);
  }
}

// ── QR Code ──────────────────────────────────────────────────

export interface WAHAQRResult {
  base64: string | null;
  pairingCode: string | null;
}

/** Get QR code for a session */
export async function getQRCode(sessionName: string): Promise<WAHAQRResult> {
  const res = await fetch(
    `${WAHA_URL}/api/${sessionName}/auth/qr?format=image`,
    { headers: { ...wahaHeaders(), Accept: "application/json" } },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WAHA getQR ${res.status}: ${text}`);
  }

  const data = await res.json().catch(() => ({})) as Record<string, unknown>;

  const base64 =
    (typeof data.value === "string" && data.value.startsWith("data:")
      ? data.value
      : null) ||
    (typeof data.data === "string"
      ? `data:image/png;base64,${data.data}`
      : null);

  return { base64, pairingCode: null };
}

// ── Messaging ────────────────────────────────────────────────

/** Send a text message */
export async function sendText(
  sessionName: string,
  phone: string,
  text: string,
): Promise<boolean> {
  const res = await fetch(`${WAHA_URL}/api/sendText`, {
    method: "POST",
    headers: wahaHeaders(),
    body: JSON.stringify({
      session: sessionName,
      chatId: toChatId(phone),
      text,
    }),
  });
  return res.ok;
}

/** Send an image/media message */
export async function sendImage(
  sessionName: string,
  phone: string,
  mediaUrl: string,
  caption: string,
): Promise<boolean> {
  const res = await fetch(`${WAHA_URL}/api/sendImage`, {
    method: "POST",
    headers: wahaHeaders(),
    body: JSON.stringify({
      session: sessionName,
      chatId: toChatId(phone),
      file: { url: mediaUrl },
      caption,
    }),
  });
  return res.ok;
}

// ── Ensure session exists ────────────────────────────────────

export async function ensureSessionExists(
  sessionName: string,
  logPrefix = "[WAHA]",
): Promise<boolean> {
  try {
    const status = await getSessionStatus(sessionName);

    if (!status) {
      console.log(`${logPrefix} session ${sessionName} not found — creating`);
      await createSession(sessionName);
      await startSession(sessionName);
      console.log(`${logPrefix} session ${sessionName} created and started`);
      return true;
    }

    if (status.status === "STOPPED") {
      console.log(`${logPrefix} session ${sessionName} stopped — starting`);
      await startSession(sessionName);
    }

    console.log(
      `${logPrefix} session ${sessionName} exists, status=${status.status}`,
    );
    return true;
  } catch (err) {
    console.error(`${logPrefix} ensureSessionExists failed:`, err);
    return false;
  }
}
