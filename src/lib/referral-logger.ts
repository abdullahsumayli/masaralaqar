/**
 * Referral event logging — affiliate_id, office_id for audit trail.
 * Uses structured console.log for production logs.
 */

export type ReferralEventType = "referral_created" | "referral_converted" | "commission_added";

export function logReferralEvent(
  event: ReferralEventType,
  data: { affiliate_id: string; office_id?: string | null; [key: string]: unknown }
): void {
  const payload = { event, ...data, ts: new Date().toISOString() };
  console.log(`[Referral] ${JSON.stringify(payload)}`);
}
