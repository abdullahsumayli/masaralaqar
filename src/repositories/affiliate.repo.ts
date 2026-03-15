/**
 * Affiliate Repository — data access for affiliates, referrals, commissions, coupons, payouts
 */

import { supabaseAdmin } from "@/lib/supabase";
import type { Affiliate, Commission, Coupon, Payout, Referral } from "@/types/affiliate";

export class AffiliateRepository {
  static formatAffiliate(row: Record<string, unknown>): Affiliate {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      referralCode: row.referral_code as string,
      parentAffiliateId: (row.parent_affiliate_id as string) || null,
      createdAt: row.created_at as string,
    };
  }

  static formatReferral(row: Record<string, unknown>): Referral {
    return {
      id: row.id as string,
      affiliateId: row.affiliate_id as string,
      referredUserId: row.referred_user_id as string,
      createdAt: row.created_at as string,
    };
  }

  static formatCommission(row: Record<string, unknown>): Commission {
    return {
      id: row.id as string,
      affiliateId: row.affiliate_id as string,
      referralId: row.referral_id as string,
      subscriptionId: (row.subscription_id as string) || null,
      amount: Number(row.amount),
      percentage: Number(row.percentage),
      tierLevel: (row.tier_level as 1 | 2) || 1,
      createdAt: row.created_at as string,
    };
  }

  static formatCoupon(row: Record<string, unknown>): Coupon {
    return {
      id: row.id as string,
      affiliateId: row.affiliate_id as string,
      code: row.code as string,
      discountPercent: Number(row.discount_percent),
      active: row.active !== false,
      createdAt: row.created_at as string,
    };
  }

  static formatPayout(row: Record<string, unknown>): Payout {
    return {
      id: row.id as string,
      affiliateId: row.affiliate_id as string,
      amount: Number(row.amount),
      status: (row.status as Payout["status"]) || "pending",
      processedAt: (row.processed_at as string) || null,
      createdAt: row.created_at as string,
    };
  }

  static async getById(id: string): Promise<Affiliate | null> {
    const { data, error } = await supabaseAdmin
      .from("affiliates")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return this.formatAffiliate(data);
  }

  static async getByUserId(userId: string): Promise<Affiliate | null> {
    const { data, error } = await supabaseAdmin
      .from("affiliates")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return this.formatAffiliate(data);
  }

  static async getByReferralCode(code: string): Promise<Affiliate | null> {
    const { data, error } = await supabaseAdmin
      .from("affiliates")
      .select("*")
      .eq("referral_code", code.trim().toUpperCase())
      .single();
    if (error || !data) return null;
    return this.formatAffiliate(data);
  }

  static async createAffiliate(
    userId: string,
    referralCode: string,
    parentAffiliateId?: string | null
  ): Promise<Affiliate | null> {
    const { data, error } = await supabaseAdmin
      .from("affiliates")
      .insert({
        user_id: userId,
        referral_code: referralCode.trim().toUpperCase(),
        parent_affiliate_id: parentAffiliateId || null,
      })
      .select()
      .single();
    if (error || !data) return null;
    return this.formatAffiliate(data);
  }

  static async createReferral(affiliateId: string, referredUserId: string): Promise<Referral | null> {
    const { data, error } = await supabaseAdmin
      .from("referrals")
      .insert({ affiliate_id: affiliateId, referred_user_id: referredUserId })
      .select()
      .single();
    if (error || !data) return null;
    return this.formatReferral(data);
  }

  static async getReferralByReferredUserId(referredUserId: string): Promise<Referral | null> {
    const { data, error } = await supabaseAdmin
      .from("referrals")
      .select("*")
      .eq("referred_user_id", referredUserId)
      .single();
    if (error || !data) return null;
    return this.formatReferral(data);
  }

  static async getReferralsByAffiliateId(affiliateId: string): Promise<Referral[]> {
    const { data, error } = await supabaseAdmin
      .from("referrals")
      .select("*")
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r) => this.formatReferral(r));
  }

  static async insertCommission(record: {
    affiliateId: string;
    referralId: string;
    subscriptionId: string | null;
    amount: number;
    percentage: number;
    tierLevel: 1 | 2;
  }): Promise<Commission | null> {
    const { data, error } = await supabaseAdmin
      .from("commissions")
      .insert({
        affiliate_id: record.affiliateId,
        referral_id: record.referralId,
        subscription_id: record.subscriptionId,
        amount: record.amount,
        percentage: record.percentage,
        tier_level: record.tierLevel,
      })
      .select()
      .single();
    if (error || !data) return null;
    return this.formatCommission(data);
  }

  static async getCommissionsByAffiliateId(affiliateId: string): Promise<Commission[]> {
    const { data, error } = await supabaseAdmin
      .from("commissions")
      .select("*")
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r) => this.formatCommission(r));
  }

  static async getCouponByCode(code: string): Promise<(Coupon & { affiliateId: string }) | null> {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("active", true)
      .single();
    if (error || !data) return null;
    return this.formatCoupon(data) as Coupon & { affiliateId: string };
  }

  static async getCouponsByAffiliateId(affiliateId: string): Promise<Coupon[]> {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r) => this.formatCoupon(r));
  }

  static async createCoupon(
    affiliateId: string,
    code: string,
    discountPercent: number
  ): Promise<Coupon | null> {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .insert({
        affiliate_id: affiliateId,
        code: code.trim().toUpperCase(),
        discount_percent: Math.min(100, Math.max(1, discountPercent)),
        active: true,
      })
      .select()
      .single();
    if (error || !data) return null;
    return this.formatCoupon(data);
  }

  static async getPayoutsByAffiliateId(affiliateId: string): Promise<Payout[]> {
    const { data, error } = await supabaseAdmin
      .from("payouts")
      .select("*")
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r) => this.formatPayout(r));
  }

  static async getTotalEarningsByAffiliateId(affiliateId: string): Promise<number> {
    const { data, error } = await supabaseAdmin
      .from("commissions")
      .select("amount")
      .eq("affiliate_id", affiliateId);
    if (error || !data) return 0;
    return data.reduce((sum, r) => sum + Number(r.amount), 0);
  }

  static async getPendingPayoutSumByAffiliateId(affiliateId: string): Promise<number> {
    const { data, error } = await supabaseAdmin
      .from("payouts")
      .select("amount")
      .eq("affiliate_id", affiliateId)
      .in("status", ["pending", "approved"]);
    if (error || !data) return 0;
    return data.reduce((sum, r) => sum + Number(r.amount), 0);
  }

  static async getPaidPayoutSumByAffiliateId(affiliateId: string): Promise<number> {
    const { data, error } = await supabaseAdmin
      .from("payouts")
      .select("amount")
      .eq("affiliate_id", affiliateId)
      .eq("status", "paid");
    if (error || !data) return 0;
    return data.reduce((sum, r) => sum + Number(r.amount), 0);
  }
}
