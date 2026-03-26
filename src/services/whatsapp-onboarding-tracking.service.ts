/**
 * WhatsApp Onboarding Tracking Service
 *
 * Tracks the onboarding funnel for WhatsApp connection:
 *   connect_clicked → qr_shown → whatsapp_connected → (or failed)
 *
 * Fire-and-forget: callers should NOT await this.
 */

export type OnboardingEvent =
  | "whatsapp_connect_clicked"
  | "whatsapp_qr_shown"
  | "whatsapp_connected"
  | "whatsapp_failed";

interface OnboardingMetadata {
  reason?: string;
  [key: string]: unknown;
}

/**
 * Track a WhatsApp onboarding event for an office.
 * Currently logs to console. Can be extended to write to
 * a `whatsapp_onboarding_events` table or analytics.
 */
export function trackWhatsAppOnboarding(
  officeId: string,
  event: OnboardingEvent,
  metadata?: OnboardingMetadata,
): void {
  const timestamp = new Date().toISOString();

  console.log(
    `[WhatsApp Onboarding] ${event} | office=${officeId} | ${timestamp}`,
    metadata ? JSON.stringify(metadata) : "",
  );

  // TODO: persist to Supabase whatsapp_onboarding_events table
  // TODO: feed into analytics dashboard
}
