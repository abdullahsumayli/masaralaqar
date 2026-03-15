/**
 * Affiliate system types
 */

export interface Affiliate {
  id: string;
  userId: string;
  referralCode: string;
  parentAffiliateId: string | null;
  createdAt: string;
}

export interface Referral {
  id: string;
  affiliateId: string;
  referredUserId: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  affiliateId: string;
  referralId: string;
  subscriptionId: string | null;
  amount: number;
  percentage: number;
  tierLevel: 1 | 2;
  createdAt: string;
}

export interface Coupon {
  id: string;
  affiliateId: string;
  code: string;
  discountPercent: number;
  active: boolean;
  createdAt: string;
}

export interface Payout {
  id: string;
  affiliateId: string;
  amount: number;
  status: "pending" | "approved" | "paid" | "rejected";
  processedAt: string | null;
  createdAt: string;
}

export const REFERRAL_COOKIE_NAME = "saqr_ref";
export const REFERRAL_COOKIE_MAX_AGE_DAYS = 30;
