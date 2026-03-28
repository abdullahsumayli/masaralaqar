/**
 * WhatsApp Integration — WAHA (WhatsApp HTTP API)
 *
 * Drop-in replacement for Evolution API integration.
 * Public interface (WhatsAppService) is UNCHANGED — all callers work as-is.
 *
 * Each office has its own WAHA session (office_{officeId}).
 * Session name is resolved from the whatsapp_sessions table via officeId,
 * with an in-memory cache to avoid repeated DB lookups.
 */

import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { instanceNameForOffice } from "@/lib/waha";
import {
  ensureSessionExists,
  getSessionStatus,
  sendText,
  sendImage,
  getQRCode,
  createSession,
  startSession,
  setSessionWebhook,
  stopSession,
  deleteSession,
  listSessions,
} from "@/lib/waha";
import { WhatsAppMessage } from "@/types/message";
import { isCircuitOpen } from "@/lib/circuit-breaker";
import { trackWhatsAppIncident } from "@/services/whatsapp-incident.service";

// ── Instance Resolution Cache ────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedInstance {
  instanceName: string;
  ts: number;
}

const instanceCache = new Map<string, CachedInstance>();

async function resolveInstanceName(officeId: string): Promise<string> {
  const cached = instanceCache.get(officeId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.instanceName;
  }

  try {
    const session = await WhatsAppSessionRepository.getByOfficeId(officeId);
    const instanceName =
      session?.instanceId || instanceNameForOffice(officeId);
    instanceCache.set(officeId, { instanceName, ts: Date.now() });
    return instanceName;
  } catch {
    return instanceNameForOffice(officeId);
  }
}

export function invalidateInstanceCache(officeId: string): void {
  instanceCache.delete(officeId);
}

// ── Session Management (exported for API routes) ─────────────

export { instanceNameForOffice };

export async function createEvolutionInstance(instanceName: string) {
  await createSession(instanceName);
  return { instance: { instanceName, status: "created" } };
}

export async function getEvolutionQR(
  instanceName: string,
  _phoneNumber?: string,
): Promise<{ base64: string | null; pairingCode: string | null; code: unknown }> {
  const QR_RETRY_ATTEMPTS = 6;
  const QR_RETRY_DELAY_MS = 3500;
  const INSTANCE_READY_RETRY_MS = 5000;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (let attempt = 1; attempt <= QR_RETRY_ATTEMPTS; attempt++) {
    try {
      const status = await getSessionStatus(instanceName);

      if (!status) {
        if (attempt < QR_RETRY_ATTEMPTS) {
          await sleep(INSTANCE_READY_RETRY_MS);
          continue;
        }
        throw new Error("جاري تهيئة الاتصال — انتظر دقيقة ثم جرّب مرة أخرى");
      }

      if (status.status === "WORKING") {
        return { base64: null, pairingCode: null, code: "WORKING" };
      }

      if (status.status === "SCAN_QR_CODE") {
        const result = await getQRCode(instanceName);
        if (result.base64 || result.pairingCode) {
          return { ...result, code: null };
        }
      }

      if (status.status === "STOPPED" || status.status === "STARTING") {
        if (status.status === "STOPPED") await startSession(instanceName);
        if (attempt < QR_RETRY_ATTEMPTS) {
          await sleep(INSTANCE_READY_RETRY_MS);
          continue;
        }
      }

      if (attempt < QR_RETRY_ATTEMPTS) await sleep(QR_RETRY_DELAY_MS);
    } catch (err) {
      if (attempt === QR_RETRY_ATTEMPTS) throw err;
      await sleep(QR_RETRY_DELAY_MS);
    }
  }

  return { base64: null, pairingCode: null, code: null };
}

export async function setEvolutionWebhook(
  instanceName: string,
  webhookUrl?: string,
): Promise<void> {
  await setSessionWebhook(instanceName, webhookUrl);
}

export async function getEvolutionStatus(instanceName: string) {
  const status = await getSessionStatus(instanceName);
  if (!status) return null;
  return {
    instance: {
      instanceName,
      state: status.status === "WORKING" ? "open" : "close",
      wahaStatus: status.status,
    },
  };
}

export interface InstanceStatusResult {
  state: string;
  instance: Record<string, unknown>;
  exists: true;
}

export async function checkInstanceStatus(
  instanceName: string,
): Promise<InstanceStatusResult | null> {
  const status = await getSessionStatus(instanceName);
  if (!status) return null;
  return {
    state: status.status === "WORKING" ? "open" : "close",
    instance: { instanceName, wahaStatus: status.status },
    exists: true,
  };
}

export async function ensureInstanceExists(
  instanceName: string,
  logPrefix = "[WAHA]",
): Promise<boolean> {
  return ensureSessionExists(instanceName, logPrefix);
}

export async function getFreshQR(
  instanceName: string,
  phoneNumber?: string,
  logPrefix = "[WAHA]",
): Promise<{ base64: string | null; pairingCode: string | null; code: unknown }> {
  console.log(`${logPrefix} generating QR for ${instanceName}`);
  const result = await getEvolutionQR(instanceName, phoneNumber);
  console.log(`${logPrefix} QR for ${instanceName}: ${result.base64 ? "ok" : "empty"}`);
  return result;
}

export async function deleteEvolutionInstance(instanceName: string) {
  await deleteSession(instanceName);
  return { deleted: true };
}

export async function logoutEvolutionInstance(instanceName: string) {
  await stopSession(instanceName);
  return { stopped: true };
}

export async function fetchInstances() {
  return listSessions();
}

// ── Auto-recovery ─────────────────────────────────────────────

const CONNECTION_ERROR_PATTERNS = [
  "not connected", "session closed", "unauthorized",
  "401", "connection", "logged out", "disconnected",
  "scan_qr", "failed",
];

function isConnectionError(status: number, body: string): boolean {
  if (status === 401) return true;
  const lower = body.toLowerCase();
  return CONNECTION_ERROR_PATTERNS.some((p) => lower.includes(p));
}

async function attemptInstanceRecovery(
  officeId: string,
  instanceName: string,
  logPrefix: string,
): Promise<boolean> {
  if (isCircuitOpen(instanceName)) {
    console.log(`[WhatsApp] circuit open for ${instanceName} — skip`);
    return false;
  }
  const status = await checkInstanceStatus(instanceName);
  if (!status) return false;
  if (status.state === "open") return true;

  trackWhatsAppIncident(officeId, instanceName, "auto_reconnect_triggered", {
    previousState: status.state,
  });

  try {
    await startSession(instanceName);
  } catch (err) {
    console.warn(`${logPrefix} startSession failed:`, err);
  }
  return true;
}

// ── WhatsAppService ───────────────────────────────────────────

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "966" + cleaned.substring(1);
  if (!cleaned.startsWith("966") && cleaned.length === 9)
    cleaned = "966" + cleaned;
  return cleaned;
}

export class WhatsAppService {
  static formatPhoneNumber = formatPhoneNumber;

  static async sendMessage(
    recipientPhone: string,
    message: string,
    officeId: string,
  ): Promise<boolean> {
    const instanceName = await resolveInstanceName(officeId);
    const formattedPhone = formatPhoneNumber(recipientPhone);
    const logPrefix = `[WhatsApp] office_id=${officeId} instance=${instanceName} sendMessage`;

    const doSend = async () => {
      const ok = await sendText(instanceName, formattedPhone, message);
      return { ok, status: ok ? 200 : 500, body: ok ? "" : "send failed" };
    };

    try {
      let result = await doSend();
      if (result.ok) return true;

      if (isConnectionError(result.status, result.body)) {
        const recovered = await attemptInstanceRecovery(officeId, instanceName, logPrefix);
        if (recovered) {
          result = await doSend();
          if (result.ok) {
            trackWhatsAppIncident(officeId, instanceName, "reconnect_success");
            return true;
          }
          trackWhatsAppIncident(officeId, instanceName, "reconnect_failed");
        }
      }

      console.error(`${logPrefix} send failed`);
      return false;
    } catch (error) {
      console.error(`${logPrefix} exception:`, error);
      return false;
    }
  }

  static async sendMediaMessage(
    recipientPhone: string,
    mediaUrl: string,
    caption: string,
    officeId: string,
  ): Promise<boolean> {
    const instanceName = await resolveInstanceName(officeId);
    const formattedPhone = formatPhoneNumber(recipientPhone);
    const logPrefix = `[WhatsApp] office_id=${officeId} instance=${instanceName} sendMedia`;

    try {
      const ok = await sendImage(instanceName, formattedPhone, mediaUrl, caption);
      if (ok) return true;

      const recovered = await attemptInstanceRecovery(officeId, instanceName, logPrefix);
      if (recovered) {
        const retryOk = await sendImage(instanceName, formattedPhone, mediaUrl, caption);
        if (retryOk) {
          trackWhatsAppIncident(officeId, instanceName, "reconnect_success");
          return true;
        }
        trackWhatsAppIncident(officeId, instanceName, "reconnect_failed");
      }
      return false;
    } catch (error) {
      console.error(`${logPrefix} exception:`, error);
      return false;
    }
  }

  /**
   * Parse incoming WAHA or Evolution webhook payload.
   * Both formats supported for backward compatibility.
   */
  static parseIncomingMessage(
    payload: Record<string, unknown>,
  ): WhatsAppMessage | null {
    try {
      // WAHA format
      if (payload?.event === "message" && payload?.payload) {
        const p = payload.payload as Record<string, unknown>;
        if (p.fromMe) return null;
        const from = (p.from as string)?.replace("@c.us", "") || "";
        const text = (p.body as string) || "";
        const id = (p.id as string) || `waha_${Date.now()}`;
        if (!from || !text) return null;
        return { id, phone: from, text, timestamp: new Date().toISOString(), media: undefined };
      }

      // Evolution format (backward compat)
      if (payload?.event === "messages.upsert") {
        const data = payload.data as Record<string, unknown> | undefined;
        const messages = data?.messages as Record<string, unknown>[] | undefined;
        const msg = messages?.[0];
        if (!msg) return null;
        const key = msg.key as Record<string, unknown> | undefined;
        if (key?.fromMe) return null;
        const phone = (key?.remoteJid as string)?.replace("@s.whatsapp.net", "") || "";
        const msgBody = msg.message as Record<string, unknown> | undefined;
        const text =
          (msgBody?.conversation as string) ||
          ((msgBody?.extendedTextMessage as Record<string, unknown>)?.text as string) ||
          "";
        const id = (key?.id as string) || `evo_${Date.now()}`;
        if (!phone || !text) return null;
        return { id, phone, text, timestamp: new Date().toISOString(), media: undefined };
      }

      return null;
    } catch (error) {
      console.error("[WhatsApp] parseIncomingMessage error:", error);
      return null;
    }
  }

  static verifyWebhookSignature(
    _payload: string,
    _signature: string,
    _secret: string,
  ): boolean {
    return true;
  }
}
