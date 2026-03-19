/**
 * WhatsApp Integration — Evolution API v2 (multi-tenant)
 *
 * Each office has its own Evolution instance (office_{officeId}).
 * Instance name is resolved from the whatsapp_sessions table via officeId,
 * with an in-memory cache to avoid repeated DB lookups.
 */

import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { instanceNameForOffice } from "@/lib/evolution";
import { WhatsAppMessage } from "@/types/message";
import { isCircuitOpen } from "@/lib/circuit-breaker";
import { trackWhatsAppIncident } from "@/services/whatsapp-incident.service";

const EVO_URL =
  process.env.EVOLUTION_API_URL ||
  process.env.EVOLUTION_URL ||
  "https://evo.masaralaqar.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY || "";

function evoHeaders() {
  return { "Content-Type": "application/json", apikey: EVO_KEY };
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "966" + cleaned.substring(1);
  if (!cleaned.startsWith("966") && cleaned.length === 9)
    cleaned = "966" + cleaned;
  return cleaned;
}

// ── Instance Resolution Cache ────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedInstance {
  instanceName: string;
  ts: number;
}

const instanceCache = new Map<string, CachedInstance>();

/**
 * Resolve the Evolution instance name for a given officeId.
 * Checks in-memory cache first, then falls back to DB lookup.
 * If no session exists, derives the default name from the officeId.
 */
async function resolveInstanceName(officeId: string): Promise<string> {
  const cached = instanceCache.get(officeId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.instanceName;
  }

  try {
    const session = await WhatsAppSessionRepository.getByOfficeId(officeId);
    const instanceName =
      session?.instanceId || instanceNameForOffice(officeId);
    instanceCache.set(officeId, {
      instanceName,
      ts: Date.now(),
    });
    return instanceName;
  } catch {
    return instanceNameForOffice(officeId);
  }
}

/** Invalidate cached instance name when sessions change */
export function invalidateInstanceCache(officeId: string): void {
  instanceCache.delete(officeId);
}

// ── Evolution Instance Management ────────────────────────────

const QR_RETRY_ATTEMPTS = 6;
const QR_RETRY_DELAY_MS = 3500;
const INSTANCE_READY_RETRY_MS = 5000; // extra wait when "not ready yet"

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeQRResponse(data: Record<string, unknown>): {
  base64: string | null;
  pairingCode: string | null;
} {
  const base64 =
    (typeof data.base64 === "string" && data.base64 ? data.base64 : null) ||
    (typeof data.qrcode === "object" &&
    data.qrcode &&
    typeof (data.qrcode as Record<string, unknown>).base64 === "string"
      ? (data.qrcode as Record<string, unknown>).base64 as string
      : null) ||
    (typeof data.code === "string" && data.code.startsWith("data:")
      ? data.code
      : null);
  const pairingCode =
    typeof data.pairingCode === "string" && data.pairingCode
      ? data.pairingCode
      : null;
  return { base64, pairingCode };
}

/** Create / ensure an Evolution instance exists for an office */
export async function createEvolutionInstance(instanceName: string) {
  const res = await fetch(`${EVO_URL}/instance/create`, {
    method: "POST",
    headers: evoHeaders(),
    body: JSON.stringify({
      instanceName,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      webhook: {
        url: `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`,
        byEvents: true,
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
      },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    if (
      (res.status === 400 || res.status === 409) &&
      text.toLowerCase().includes("exist")
    ) {
      return { instance: { instanceName, status: "existing" } };
    }
    throw new Error(`Evolution createInstance ${res.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/** Get QR code for connecting a specific instance (with retry) */
export async function getEvolutionQR(
  instanceName: string,
  phoneNumber?: string,
) {
  const query = phoneNumber
    ? `?number=${encodeURIComponent(phoneNumber)}`
    : "";
  const url = `${EVO_URL}/instance/connect/${instanceName}${query}`;

  for (let attempt = 1; attempt <= QR_RETRY_ATTEMPTS; attempt++) {
    const res = await fetch(url, { headers: evoHeaders() });
    const bodyText = await res.text().catch(() => "");
    const isNotReady =
      !res.ok &&
      (bodyText.toLowerCase().includes("not ready") ||
        bodyText.toLowerCase().includes("instance not ready"));

    if (!res.ok && !isNotReady) {
      throw new Error(`Evolution QR ${res.status}: ${bodyText}`);
    }

    if (isNotReady && attempt < QR_RETRY_ATTEMPTS) {
      console.log(
        `[Evolution] instance not ready yet, retry ${attempt}/${QR_RETRY_ATTEMPTS} in ${INSTANCE_READY_RETRY_MS}ms`,
      );
      await sleep(INSTANCE_READY_RETRY_MS);
      continue;
    }

    if (!res.ok) {
      throw new Error(
        "جاري تهيئة الاتصال — انتظر دقيقة ثم جرّب مرة أخرى",
      );
    }

    let data: Record<string, unknown> = {};
    try {
      data = (JSON.parse(bodyText || "{}") || {}) as Record<string, unknown>;
    } catch {
      data = {};
    }
    const { base64, pairingCode } = normalizeQRResponse(data);

    if (base64 || pairingCode) {
      return { base64, pairingCode, code: data.code ?? null };
    }

    if (attempt < QR_RETRY_ATTEMPTS) {
      await sleep(QR_RETRY_DELAY_MS);
    }
  }

  return { base64: null, pairingCode: null, code: null };
}

/** Set/update webhook URL on a specific instance */
export async function setEvolutionWebhook(
  instanceName: string,
  webhookUrl?: string,
) {
  const url =
    webhookUrl ||
    `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;

  const res = await fetch(`${EVO_URL}/webhook/set/${instanceName}`, {
    method: "POST",
    headers: evoHeaders(),
    body: JSON.stringify({
      url,
      webhook_by_events: true,
      webhook_base64: false,
      events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      `[Evolution] setWebhook failed (${res.status}):`,
      text,
    );
    throw new Error(`Evolution setWebhook ${res.status}: ${text}`);
  }

  const data = await res.json().catch(() => ({}));
  console.log(`[Evolution] Webhook set to: ${url}`, data);
  return data;
}

/** Get current webhook configuration for an instance */
export async function getEvolutionWebhook(instanceName: string) {
  const res = await fetch(`${EVO_URL}/webhook/find/${instanceName}`, {
    headers: evoHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

/** Get live connection state of an instance */
export async function getEvolutionStatus(instanceName: string) {
  const res = await fetch(
    `${EVO_URL}/instance/connectionState/${instanceName}`,
    {
      headers: evoHeaders(),
    },
  );
  if (!res.ok) return null;

  return res.json();
}

/** Instance status result: state + raw instance data */
export interface InstanceStatusResult {
  state: string;
  instance: Record<string, unknown>;
  exists: true;
}

/**
 * Check instance status via Evolution API.
 * Returns { state, instance, exists } if instance exists, null if 404 (does not exist).
 */
export async function checkInstanceStatus(
  instanceName: string,
): Promise<InstanceStatusResult | null> {
  try {
    const data = (await getEvolutionStatus(instanceName)) as Record<
      string,
      unknown
    > | null;
    if (!data) return null;

    const instance = data.instance as Record<string, unknown> | undefined;
    const state = (instance?.state as string) ?? "close";
    return { state: String(state).toLowerCase(), instance: instance ?? {}, exists: true };
  } catch {
    return null;
  }
}

/**
 * Ensure instance exists: create + set webhook if not.
 * Returns true if instance is ready (created or already existed).
 */
export async function ensureInstanceExists(
  instanceName: string,
  logPrefix = "[Evolution]",
): Promise<boolean> {
  const status = await checkInstanceStatus(instanceName);
  if (status) {
    console.log(`${logPrefix} instance ${instanceName} exists, state=${status.state}`);
    return true;
  }

  console.log(`${logPrefix} instance ${instanceName} does not exist — creating`);
  try {
    await createEvolutionInstance(instanceName);
    await setEvolutionWebhook(instanceName);
    await sleep(2000); // allow instance to initialize before QR fetch
    console.log(`${logPrefix} instance ${instanceName} created, webhook set`);
    return true;
  } catch (err) {
    console.error(`${logPrefix} ensureInstanceExists failed:`, err);
    return false;
  }
}

/**
 * Get fresh QR for instance. Call when state is close/logged out.
 * Logs QR generation.
 */
export async function getFreshQR(
  instanceName: string,
  phoneNumber?: string,
  logPrefix = "[Evolution]",
): Promise<{ base64: string | null; pairingCode: string | null; code: unknown }> {
  console.log(`${logPrefix} generating fresh QR for ${instanceName}`);
  const result = await getEvolutionQR(instanceName, phoneNumber);
  const hasQr = !!(result.base64 || result.pairingCode);
  console.log(
    `${logPrefix} QR generated for ${instanceName}: ${hasQr ? "ok" : "empty"}`,
  );
  return result;
}

/** Delete an instance */
export async function deleteEvolutionInstance(instanceName: string) {
  const res = await fetch(`${EVO_URL}/instance/delete/${instanceName}`, {
    method: "DELETE",
    headers: evoHeaders(),
  });
  if (!res.ok) throw new Error(`Evolution deleteInstance ${res.status}`);
  return res.json();
}

/** Logout (force disconnect) an instance — keeps instance, allows re-scan QR */
export async function logoutEvolutionInstance(instanceName: string) {
  const res = await fetch(`${EVO_URL}/instance/logout/${instanceName}`, {
    method: "DELETE",
    headers: evoHeaders(),
  });
  if (!res.ok) throw new Error(`Evolution logout ${res.status}`);
  return res.json();
}

// ── Auto-recovery helpers ─────────────────────────────────────

const CONNECTION_ERROR_PATTERNS = [
  "not connected",
  "instance closed",
  "unauthorized",
  "401",
  "connection",
  "logged out",
  "disconnected",
];

function isConnectionError(status: number, body: string): boolean {
  if (status === 401) return true;
  const lower = body.toLowerCase();
  return CONNECTION_ERROR_PATTERNS.some((p) => lower.includes(p));
}

/** Trigger QR regeneration via GET /instance/connect (does not block on user scan) */
async function triggerQRRegeneration(instanceName: string): Promise<void> {
  try {
    const res = await fetch(
      `${EVO_URL}/instance/connect/${instanceName}`,
      { headers: evoHeaders() },
    );
    if (res.ok) {
      console.log(
        `[WhatsApp] office_id=* instance_name=${instanceName} auto-reconnect triggered — QR regenerated`,
      );
    } else {
      console.warn(
        `[WhatsApp] office_id=* instance_name=${instanceName} QR regeneration failed (${res.status})`,
      );
    }
  } catch (err) {
    console.warn(
      `[WhatsApp] office_id=* instance_name=${instanceName} QR regeneration error:`,
      err,
    );
  }
}

/**
 * Attempt recovery when send fails with connection error:
 * Check status, trigger QR if not open, then caller can retry.
 * Tracks auto_reconnect_triggered when QR is regenerated.
 */
async function attemptInstanceRecovery(
  officeId: string,
  instanceName: string,
  logPrefix: string,
): Promise<boolean> {
  if (isCircuitOpen(instanceName)) {
    console.log(
      `[WhatsApp] office_id=${officeId} instance_name=${instanceName} circuit open — skip auto-retry, manual intervention required`,
    );
    return false;
  }
  const status = await checkInstanceStatus(instanceName);
  if (!status) {
    console.log(
      `[WhatsApp] office_id=${officeId} instance_name=${instanceName} instance not found — no recovery possible`,
    );
    return false;
  }
  if (status.state === "open") {
    console.log(
      `[WhatsApp] office_id=${officeId} instance_name=${instanceName} instance already open — retrying send`,
    );
    return true;
  }
  console.log(
    `[WhatsApp] office_id=${officeId} instance_name=${instanceName} auto-reconnect triggered — state=${status.state}`,
  );
  trackWhatsAppIncident(officeId, instanceName, "auto_reconnect_triggered", {
    previousState: status.state,
  });
  await triggerQRRegeneration(instanceName);
  return true;
}

/**
 * WhatsAppService — static class used across the codebase.
 *
 * All methods resolve the Evolution instance from officeId automatically.
 * The third parameter (officeId) is REQUIRED for multi-tenant routing.
 */
export class WhatsAppService {
  static formatPhoneNumber = formatPhoneNumber;

  /** Send a WhatsApp text message via the office's Evolution instance */
  static async sendMessage(
    recipientPhone: string,
    message: string,
    officeId: string,
  ): Promise<boolean> {
    const instanceName = await resolveInstanceName(officeId);
    const formattedPhone = formatPhoneNumber(recipientPhone);
    const logPrefix = `[WhatsApp] office_id=${officeId} instance_name=${instanceName} sendMessage`;

    const doSend = async (): Promise<{ ok: boolean; status: number; body: string }> => {
      const response = await fetch(
        `${EVO_URL}/message/sendText/${instanceName}`,
        {
          method: "POST",
          headers: evoHeaders(),
          body: JSON.stringify({ number: formattedPhone, text: message }),
        },
      );
      const body = await response.text().catch(() => "");
      return { ok: response.ok, status: response.status, body };
    };

    try {
      let result = await doSend();

      if (result.ok) return true;

      console.log(
        `${logPrefix} send failed — status=${result.status} body=${result.body.slice(0, 200)}`,
      );

      if (isConnectionError(result.status, result.body)) {
        const recovered = await attemptInstanceRecovery(
          officeId,
          instanceName,
          logPrefix,
        );
        if (recovered) {
          result = await doSend();
          if (result.ok) {
            console.log(`${logPrefix} retry success`);
            trackWhatsAppIncident(officeId, instanceName, "reconnect_success");
            return true;
          }
          console.log(`${logPrefix} retry failure — status=${result.status}`);
          trackWhatsAppIncident(officeId, instanceName, "reconnect_failed", {
            status: result.status,
            body: result.body.slice(0, 200),
          });
        }
      }

      console.error(
        `${logPrefix} send failed (no recovery or retry exhausted):`,
        result.status,
        result.body.slice(0, 300),
      );
      return false;
    } catch (error) {
      console.error(`${logPrefix} exception:`, error);
      return false;
    }
  }

  /** Send an image/media message via the office's Evolution instance */
  static async sendMediaMessage(
    recipientPhone: string,
    mediaUrl: string,
    caption: string,
    officeId: string,
  ): Promise<boolean> {
    const instanceName = await resolveInstanceName(officeId);
    const formattedPhone = formatPhoneNumber(recipientPhone);
    const logPrefix = `[WhatsApp] office_id=${officeId} instance_name=${instanceName} sendMedia`;

    const doSend = async (): Promise<{ ok: boolean; status: number; body: string }> => {
      const response = await fetch(
        `${EVO_URL}/message/sendMedia/${instanceName}`,
        {
          method: "POST",
          headers: evoHeaders(),
          body: JSON.stringify({
            number: formattedPhone,
            mediatype: "image",
            media: mediaUrl,
            caption: caption || "",
          }),
        },
      );
      const body = await response.text().catch(() => "");
      return { ok: response.ok, status: response.status, body };
    };

    try {
      let result = await doSend();

      if (result.ok) return true;

      console.log(
        `${logPrefix} send failed — status=${result.status} body=${result.body.slice(0, 200)}`,
      );

      if (isConnectionError(result.status, result.body)) {
        const recovered = await attemptInstanceRecovery(
          officeId,
          instanceName,
          logPrefix,
        );
        if (recovered) {
          result = await doSend();
          if (result.ok) {
            console.log(`${logPrefix} retry success`);
            trackWhatsAppIncident(officeId, instanceName, "reconnect_success");
            return true;
          }
          console.log(`${logPrefix} retry failure — status=${result.status}`);
          trackWhatsAppIncident(officeId, instanceName, "reconnect_failed", {
            status: result.status,
            body: result.body.slice(0, 200),
          });
        }
      }

      console.error(
        `${logPrefix} send failed (no recovery or retry exhausted):`,
        result.status,
        result.body.slice(0, 300),
      );
      return false;
    } catch (error) {
      console.error(`${logPrefix} exception:`, error);
      return false;
    }
  }

  /** Parse incoming Evolution API webhook payload into WhatsAppMessage */
  static parseIncomingMessage(
    payload: Record<string, unknown>,
  ): WhatsAppMessage | null {
    try {
      const data = payload?.data as Record<string, unknown> | undefined;
      if (
        payload?.event === "messages.upsert" &&
        data?.messages
      ) {
        const messages = data.messages as Record<string, unknown>[];
        const msg = messages[0];
        if (!msg) return null;
        const key = msg.key as Record<string, unknown> | undefined;
        if (key?.fromMe) return null;

        const phone =
          (key?.remoteJid as string)?.replace("@s.whatsapp.net", "") || "";
        const msgBody = msg.message as Record<string, unknown> | undefined;
        const text =
          (msgBody?.conversation as string) ||
          ((msgBody?.extendedTextMessage as Record<string, unknown>)
            ?.text as string) ||
          "";
        const id = (key?.id as string) || `msg_${Date.now()}`;

        if (!phone || !text) return null;

        return {
          id,
          phone,
          text,
          timestamp: new Date().toISOString(),
          media: undefined,
        };
      }
      return null;
    } catch (error) {
      console.error("[WhatsApp] parseIncomingMessage error:", error);
      return null;
    }
  }

  /** Evolution uses API key auth — no per-request signature needed */
  static verifyWebhookSignature(
    _payload: string,
    _signature: string,
    _secret: string,
  ): boolean {
    return true;
  }
}
