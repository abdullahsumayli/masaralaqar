/**
 * WhatsApp — WAHA (multi-tenant). One session per office: office_{officeId}.
 */

import { instanceNameForOffice } from "@/lib/whatsapp-session";
import {
  defaultWebhookUrl,
  wahaConfigured,
  wahaCreateSession,
  wahaDeleteSession,
  wahaFetchQrJson,
  wahaFetchSession,
  wahaLivePayload,
  wahaLogoutSession,
  wahaRestartSession,
  wahaSendImage,
  wahaSendText,
  wahaStartSession,
  wahaSessionIsAuthenticated,
  wahaSyncWebhooks,
} from "@/lib/waha-client";
import { WhatsAppMessage } from "@/types/message";
import { timingSafeEqual } from "node:crypto";
import { isCircuitOpen } from "@/lib/circuit-breaker";
import { trackWhatsAppIncident } from "@/services/whatsapp-incident.service";

export { instanceNameForOffice } from "@/lib/whatsapp-session";

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "966" + cleaned.substring(1);
  if (!cleaned.startsWith("966") && cleaned.length === 9)
    cleaned = "966" + cleaned;
  return cleaned;
}

function phoneToChatId(digits: string): string {
  return `${digits}@c.us`;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedInstance {
  instanceName: string;
  ts: number;
}

const instanceCache = new Map<string, CachedInstance>();

/** WAHA session name is always office_{officeId}; never read stale instance_id from DB. */
function resolveInstanceName(officeId: string): string {
  const cached = instanceCache.get(officeId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.instanceName;
  }
  const instanceName = instanceNameForOffice(officeId);
  instanceCache.set(officeId, { instanceName, ts: Date.now() });
  return instanceName;
}

export function invalidateInstanceCache(officeId: string): void {
  instanceCache.delete(officeId);
}

const QR_RETRY_ATTEMPTS = 6;
const QR_RETRY_DELAY_MS = 3500;
const INSTANCE_READY_RETRY_MS = 5000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeQRBase64(data: string | null): {
  base64: string | null;
  pairingCode: string | null;
} {
  if (!data) return { base64: null, pairingCode: null };
  return { base64: data, pairingCode: null };
}

export interface InstanceStatusResult {
  state: string;
  instance: Record<string, unknown>;
  exists: true;
}

export async function checkInstanceStatus(
  sessionName: string,
): Promise<InstanceStatusResult | null> {
  if (!wahaConfigured()) return null;
  try {
    const s = await wahaFetchSession(sessionName);
    if (!s) return null;
    const st = String(s.status ?? "");
    const open = wahaSessionIsAuthenticated(s);
    return {
      state: open ? "open" : String(st).toLowerCase(),
      instance: s,
      exists: true,
    };
  } catch {
    return null;
  }
}

/** Live connection payload shape for dashboard/status routes. */
export async function getLiveConnectionPayload(sessionName: string) {
  if (!wahaConfigured()) return null;
  try {
    const s = await wahaFetchSession(sessionName);
    return wahaLivePayload(s);
  } catch {
    return null;
  }
}

export async function syncSessionWebhook(
  sessionName: string,
  webhookUrl?: string,
) {
  const url = webhookUrl || defaultWebhookUrl();
  await wahaSyncWebhooks(sessionName, url);
  return { url };
}

export async function getSessionWebhookDebug(sessionName: string) {
  const s = await wahaFetchSession(sessionName);
  if (!s) return null;
  const config = s.config as Record<string, unknown> | undefined;
  return config?.webhooks ?? null;
}

/** User-facing Arabic hint from WAHA/network errors (logged in full server-side). */
function wahaEnsureFailureHint(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const m = msg.toLowerCase();
  if (msg.includes("401") || m.includes("Unauthorized")) {
    return "مفتاح WAHA غير صحيح أو مرفوض — راجع WAHA_API_KEY في بيئة التشغيل";
  }
  if (msg.includes("403") || m.includes("Forbidden")) {
    return "الوصول إلى WAHA مرفوض — راجع المفتاح وإعدادات الحماية على خادم WAHA";
  }
  if (
    m.includes("econnrefused") ||
    m.includes("enotfound") ||
    m.includes("fetch failed") ||
    m.includes("network") ||
    m.includes("timed out") ||
    m.includes("timeout") ||
    m.includes("etimedout")
  ) {
    return "تعذر الوصول لخادم WAHA من تطبيقك. إذا كان الموقع على استضافة سحابية فلا تضع localhost في WAHA_API_URL — استخدم عنواناً عاماً يصل إليه خادم Next.js (نفس الشبكة/VPN أو نطاق عام).";
  }
  if (
    /create session 5\d\d/.test(msg) ||
    /start 5\d\d/.test(msg) ||
    m.includes("502") ||
    m.includes("503") ||
    m.includes("504")
  ) {
    return "خادم WAHA غير متاح أو يعيد خطأ مؤقتاً — تحقق من تشغيل الحاوية وسجلات WAHA";
  }
  return "فشل في إنشاء الجلسة — راجع سجلات الخادم وتأكد أن WAHA يعمل وأن WAHA_API_URL صحيح";
}

export type EnsureInstanceResult =
  | { ok: true }
  | { ok: false; hint: string };

export async function ensureInstanceExists(
  sessionName: string,
  logPrefix = "[WAHA]",
): Promise<EnsureInstanceResult> {
  if (!wahaConfigured()) {
    return {
      ok: false,
      hint: "إعدادات WAHA غير مكتملة (WAHA_API_URL و WAHA_API_KEY)",
    };
  }

  let s = await wahaFetchSession(sessionName).catch(() => null);
  const webhookUrl = defaultWebhookUrl();

  if (!s) {
    console.log(`${logPrefix} session ${sessionName} missing — creating`);
    try {
      await wahaCreateSession(sessionName, webhookUrl);
      await wahaStartSession(sessionName);
      await sleep(2000);
      return { ok: true };
    } catch (err) {
      console.error(`${logPrefix} create failed:`, err);
      return { ok: false, hint: wahaEnsureFailureHint(err) };
    }
  }

  try {
    await wahaSyncWebhooks(sessionName, webhookUrl);
  } catch (err) {
    console.warn(`${logPrefix} webhook sync:`, err);
  }

  const st = String(s.status ?? "");
  if (st === "STOPPED" || st === "FAILED") {
    try {
      await wahaStartSession(sessionName);
      await sleep(1500);
    } catch (e) {
      console.warn(`${logPrefix} start:`, e);
    }
  }

  console.log(`${logPrefix} session ${sessionName} ready status=${st}`);
  return { ok: true };
}

export async function getSessionQR(sessionName: string, _phoneNumber?: string) {
  for (let attempt = 1; attempt <= QR_RETRY_ATTEMPTS; attempt++) {
    try {
      await wahaStartSession(sessionName);
    } catch {
      // ignore
    }

    let base64: string | null = null;
    try {
      const r = await wahaFetchQrJson(sessionName);
      base64 = r.base64;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const notReady =
        msg.toLowerCase().includes("not ready") ||
        msg.toLowerCase().includes("503") ||
        msg.toLowerCase().includes("scan");
      if (notReady && attempt < QR_RETRY_ATTEMPTS) {
        await sleep(INSTANCE_READY_RETRY_MS);
        continue;
      }
      if (attempt < QR_RETRY_ATTEMPTS) {
        await sleep(QR_RETRY_DELAY_MS);
        continue;
      }
      throw e;
    }

    const { base64: b, pairingCode } = normalizeQRBase64(base64);
    if (b || pairingCode) {
      return { base64: b, pairingCode, code: null };
    }

    if (attempt < QR_RETRY_ATTEMPTS) await sleep(QR_RETRY_DELAY_MS);
  }

  return { base64: null, pairingCode: null, code: null };
}

export async function getFreshQR(
  sessionName: string,
  phoneNumber?: string,
  logPrefix = "[WAHA]",
) {
  console.log(`${logPrefix} generating fresh QR for ${sessionName}`);
  const result = await getSessionQR(sessionName, phoneNumber);
  const hasQr = !!(result.base64 || result.pairingCode);
  console.log(
    `${logPrefix} QR for ${sessionName}: ${hasQr ? "ok" : "empty"}`,
  );
  return result;
}

export async function deleteWhatsappInstance(sessionName: string) {
  await wahaDeleteSession(sessionName);
}

export async function logoutWhatsappSession(sessionName: string) {
  await wahaLogoutSession(sessionName);
}

async function triggerQrRegeneration(sessionName: string): Promise<void> {
  try {
    await wahaRestartSession(sessionName);
    console.log(
      `[WhatsApp] instance_name=${sessionName} WAHA restart triggered`,
    );
  } catch (err) {
    console.warn(`[WhatsApp] restart error:`, err);
  }
}

async function attemptInstanceRecovery(
  officeId: string,
  sessionName: string,
  logPrefix: string,
): Promise<boolean> {
  if (isCircuitOpen(sessionName)) {
    console.log(
      `${logPrefix} circuit open — skip auto-retry, manual intervention required`,
    );
    return false;
  }
  const status = await checkInstanceStatus(sessionName);
  if (!status) {
    console.log(`${logPrefix} session not found — no recovery`);
    return false;
  }
  if (status.state === "open") {
    console.log(`${logPrefix} already WORKING — retry send`);
    return true;
  }
  console.log(`${logPrefix} auto-reconnect — state=${status.state}`);
  trackWhatsAppIncident(officeId, sessionName, "auto_reconnect_triggered", {
    previousState: status.state,
  });
  await triggerQrRegeneration(sessionName);
  return true;
}

const CONNECTION_ERROR_PATTERNS = [
  "not connected",
  "unauthorized",
  "401",
  "connection",
  "logged out",
  "disconnected",
  "session",
  "closed",
];

function isConnectionError(status: number, body: string): boolean {
  if (status === 401) return true;
  const lower = body.toLowerCase();
  return CONNECTION_ERROR_PATTERNS.some((p) => lower.includes(p));
}

export class WhatsAppService {
  static formatPhoneNumber = formatPhoneNumber;

  static async sendMessage(
    recipientPhone: string,
    message: string,
    officeId: string,
  ): Promise<boolean> {
    const sessionName = resolveInstanceName(officeId);
    const formattedPhone = formatPhoneNumber(recipientPhone);
    const chatId = phoneToChatId(formattedPhone);
    const logPrefix = `[WhatsApp] office_id=${officeId} session=${sessionName} sendMessage`;

    const doSend = async (): Promise<{ ok: boolean; status: number; body: string }> => {
      return wahaSendText(sessionName, chatId, message);
    };

    try {
      let result = await doSend();
      if (result.ok) return true;

      console.log(
        `${logPrefix} failed — status=${result.status} body=${result.body.slice(0, 200)}`,
      );

      if (isConnectionError(result.status, result.body)) {
        const recovered = await attemptInstanceRecovery(
          officeId,
          sessionName,
          logPrefix,
        );
        if (recovered) {
          result = await doSend();
          if (result.ok) {
            console.log(`${logPrefix} retry success`);
            trackWhatsAppIncident(officeId, sessionName, "reconnect_success");
            return true;
          }
          trackWhatsAppIncident(officeId, sessionName, "reconnect_failed", {
            status: result.status,
            body: result.body.slice(0, 200),
          });
        }
      }

      console.error(
        `${logPrefix} failed:`,
        result.status,
        result.body.slice(0, 300),
      );
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
    const sessionName = resolveInstanceName(officeId);
    const formattedPhone = formatPhoneNumber(recipientPhone);
    const chatId = phoneToChatId(formattedPhone);
    const logPrefix = `[WhatsApp] office_id=${officeId} session=${sessionName} sendMedia`;

    const doSend = async (): Promise<{ ok: boolean; status: number; body: string }> => {
      return wahaSendImage(sessionName, chatId, mediaUrl, caption);
    };

    try {
      let result = await doSend();
      if (result.ok) return true;

      if (isConnectionError(result.status, result.body)) {
        const recovered = await attemptInstanceRecovery(
          officeId,
          sessionName,
          logPrefix,
        );
        if (recovered) {
          result = await doSend();
          if (result.ok) {
            trackWhatsAppIncident(officeId, sessionName, "reconnect_success");
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error(`${logPrefix} exception:`, error);
      return false;
    }
  }

  static parseIncomingMessage(
    payload: Record<string, unknown>,
  ): WhatsAppMessage | null {
    try {
      if (payload?.event === "message" && payload?.payload) {
        const p = payload.payload as Record<string, unknown>;
        if (p.fromMe === true) return null;
        const fromRaw = typeof p.from === "string" ? p.from : "";
        const phone = fromRaw
          .replace(/@s\.whatsapp\.net$/i, "")
          .replace(/@c\.us$/i, "")
          .replace(/@lid$/i, "");
        const text = typeof p.body === "string" ? p.body : "";
        const id =
          (typeof p.id === "string" && p.id) || `waha_${Date.now()}`;
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

  /** Compare provided token to secret (timing-safe). Not used for WAHA JSON path (header checked in route). */
  static verifyWebhookSignature(
    _payload: string,
    providedToken: string,
    secret: string,
  ): boolean {
    if (!providedToken?.trim() || !secret) return false;
    try {
      const a = Buffer.from(providedToken, "utf8");
      const b = Buffer.from(secret, "utf8");
      if (a.length !== b.length) return false;
      return timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }
}

export { wahaPing as pingWhatsappBackend } from "@/lib/waha-client";
