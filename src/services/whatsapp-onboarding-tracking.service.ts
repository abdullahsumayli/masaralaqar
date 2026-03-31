/**
 * WhatsApp Onboarding Tracking Service
 *
 * Tracks the onboarding funnel for WhatsApp connection:
 *   connect_clicked → qr_shown → whatsapp_connected → (or failed)
 *
 * Fire-and-forget: `trackWhatsAppOnboarding` لا يُنتظر من المتصلين.
 */

import { supabaseAdmin } from "@/lib/supabase";

export type OnboardingEvent =
  | "whatsapp_connect_clicked"
  | "whatsapp_qr_shown"
  | "whatsapp_connected"
  | "whatsapp_failed";

/** Alias for API routes */
export type WhatsAppOnboardingEvent = OnboardingEvent;

export interface WhatsAppOnboardingStats {
  conversionRate: number;
  averageTimeToConnectSeconds: number;
  connectClicked: number;
  qrShown: number;
  connected: number;
  failed: number;
}

const STATS_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;

interface OnboardingMetadata {
  reason?: string;
  [key: string]: unknown;
}

async function persistOnboardingEvent(
  officeId: string,
  event: OnboardingEvent,
  metadata?: OnboardingMetadata,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("whatsapp_onboarding_events")
    .insert({
      office_id: officeId,
      event,
      metadata: (metadata ?? {}) as Record<string, unknown>,
    });
  if (error) {
    console.debug("[WhatsApp Onboarding] persist failed:", error.message);
  }
}

/**
 * Track a WhatsApp onboarding event for an office.
 */
export function trackWhatsAppOnboarding(
  officeId: string,
  event: OnboardingEvent,
  metadata?: OnboardingMetadata,
): void {
  void persistOnboardingEvent(officeId, event, metadata).catch(() => {});
}

/**
 * Aggregated onboarding stats من جدول whatsapp_onboarding_events (آخر 90 يوماً).
 * officeId = null → إجمالي المنصة (للمسؤول بدون فلتر مكتب).
 */
export async function getWhatsAppOnboardingStats(
  officeId: string | null,
): Promise<WhatsAppOnboardingStats> {
  const since = new Date(Date.now() - STATS_WINDOW_MS).toISOString();

  let q = supabaseAdmin
    .from("whatsapp_onboarding_events")
    .select("event, office_id, created_at")
    .gte("created_at", since);

  if (officeId) {
    q = q.eq("office_id", officeId);
  }

  const { data, error } = await q;

  if (error || !data?.length) {
    return {
      conversionRate: 0,
      averageTimeToConnectSeconds: 0,
      connectClicked: 0,
      qrShown: 0,
      connected: 0,
      failed: 0,
    };
  }

  let connectClicked = 0;
  let qrShown = 0;
  let connected = 0;
  let failed = 0;

  const firstClickByOffice = new Map<string, number>();
  const firstConnectedByOffice = new Map<string, number>();

  for (const row of data) {
    const ev = row.event as OnboardingEvent;
    const oid = row.office_id as string;
    const t = new Date(row.created_at as string).getTime();

    switch (ev) {
      case "whatsapp_connect_clicked": {
        connectClicked += 1;
        const prevClick = firstClickByOffice.get(oid);
        if (prevClick === undefined || t < prevClick) firstClickByOffice.set(oid, t);
        break;
      }
      case "whatsapp_qr_shown":
        qrShown += 1;
        break;
      case "whatsapp_connected":
        connected += 1;
        {
          const prev = firstConnectedByOffice.get(oid);
          if (prev === undefined || t < prev) firstConnectedByOffice.set(oid, t);
        }
        break;
      case "whatsapp_failed":
        failed += 1;
        break;
      default:
        break;
    }
  }

  const conversionRate =
    connectClicked > 0 ? Math.round((connected / connectClicked) * 1000) / 10 : 0;

  const deltasSec: number[] = [];
  for (const [oid, clickTs] of firstClickByOffice) {
    const connTs = firstConnectedByOffice.get(oid);
    if (connTs !== undefined && connTs >= clickTs) {
      deltasSec.push((connTs - clickTs) / 1000);
    }
  }
  const averageTimeToConnectSeconds =
    deltasSec.length > 0
      ? Math.round(
          (deltasSec.reduce((a, b) => a + b, 0) / deltasSec.length) * 10,
        ) / 10
      : 0;

  return {
    conversionRate,
    averageTimeToConnectSeconds,
    connectClicked,
    qrShown,
    connected,
    failed,
  };
}
