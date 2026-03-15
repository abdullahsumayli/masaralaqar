/**
 * Commission Engine — calculates and stores affiliate commissions on subscription payment.
 * Year 1: 30%, Year 2: 20%, Year 3: 10%. After 36 months: 0.
 * Tier 2 override: 5% to parent affiliate.
 */

import { supabaseAdmin } from "@/lib/supabase";
import { AffiliateRepository } from "@/repositories/affiliate.repo";

const COMMISSION_YEARS = [
  { monthsMin: 0, monthsMax: 12, percentage: 30 },
  { monthsMin: 12, monthsMax: 24, percentage: 20 },
  { monthsMin: 24, monthsMax: 36, percentage: 10 },
] as const;
const TIER2_OVERRIDE_PERCENT = 5;

function monthsSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return (now - then) / (30 * 24 * 60 * 60 * 1000);
}

function getCommissionPercentage(months: number): number {
  if (months >= 36) return 0;
  const year = COMMISSION_YEARS.find(
    (y) => months >= y.monthsMin && months < y.monthsMax
  );
  return year ? year.percentage : 0;
}

/** Prevent duplicate: already have commission for this subscription + affiliate + tier */
async function hasCommission(
  subscriptionId: string,
  affiliateId: string,
  tierLevel: 1 | 2
): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("commissions")
    .select("id")
    .eq("subscription_id", subscriptionId)
    .eq("affiliate_id", affiliateId)
    .eq("tier_level", tierLevel)
    .limit(1);
  return !!(data && data.length > 0);
}

export async function processPaymentCommission(
  referredUserId: string,
  amountSar: number,
  subscriptionId: string
): Promise<void> {
  const referral = await AffiliateRepository.getReferralByReferredUserId(referredUserId);
  if (!referral) return;

  const affiliate = await AffiliateRepository.getById(referral.affiliateId);
  if (!affiliate) return;

  const months = monthsSince(referral.createdAt);
  const pct1 = getCommissionPercentage(months);
  if (pct1 > 0) {
    const amount1 = (amountSar * pct1) / 100;
    const exists1 = await hasCommission(subscriptionId, referral.affiliateId, 1);
    if (!exists1) {
      await AffiliateRepository.insertCommission({
        affiliateId: referral.affiliateId,
        referralId: referral.id,
        subscriptionId,
        amount: amount1,
        percentage: pct1,
        tierLevel: 1,
      });
    }
  }

  const parentId = affiliate.parentAffiliateId;
  if (parentId) {
    const overrideAmount = (amountSar * TIER2_OVERRIDE_PERCENT) / 100;
    const exists2 = await hasCommission(subscriptionId, parentId, 2);
    if (!exists2) {
      await AffiliateRepository.insertCommission({
        affiliateId: parentId,
        referralId: referral.id,
        subscriptionId,
        amount: overrideAmount,
        percentage: TIER2_OVERRIDE_PERCENT,
        tierLevel: 2,
      });
    }
  }
}
