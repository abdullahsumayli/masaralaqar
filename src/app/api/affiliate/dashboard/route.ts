/**
 * GET /api/affiliate/dashboard
 * Affiliate stats: referral link, coupons, total referrals, active customers, earnings, pending payout.
 */

import { AffiliateRepository } from "@/repositories/affiliate.repo";
import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const affiliate = await AffiliateRepository.getByUserId(user.id);
    if (!affiliate) {
      return NextResponse.json({
        joined: false,
        referralLink: null,
        referralCode: null,
        coupons: [],
        totalReferrals: 0,
        activeCustomers: 0,
        monthlyEarnings: 0,
        totalEarnings: 0,
        pendingPayout: 0,
        commissions: [],
      });
    }

    const baseUrl =
      typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
        ? process.env.NEXT_PUBLIC_SITE_URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "https://saqr.ai";
    const referralLink = `${baseUrl}?ref=${affiliate.referralCode}`;

    const [referrals, commissions, coupons, totalEarnings, pendingPayout] = await Promise.all([
      AffiliateRepository.getReferralsByAffiliateId(affiliate.id),
      AffiliateRepository.getCommissionsByAffiliateId(affiliate.id),
      AffiliateRepository.getCouponsByAffiliateId(affiliate.id),
      AffiliateRepository.getTotalEarningsByAffiliateId(affiliate.id),
      AffiliateRepository.getPendingPayoutSumByAffiliateId(affiliate.id),
    ]);

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthlyEarnings = commissions
      .filter((c) => c.createdAt >= thisMonthStart)
      .reduce((sum, c) => sum + c.amount, 0);

    const referredUserIds = referrals.map((r) => r.referredUserId);
    let activeCustomers = 0;
    if (referredUserIds.length > 0) {
      const { count } = await supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .in("user_id", referredUserIds)
        .eq("status", "active");
      activeCustomers = count ?? 0;
    }

    return NextResponse.json({
      joined: true,
      referralLink,
      referralCode: affiliate.referralCode,
      coupons: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discountPercent: c.discountPercent,
        active: c.active,
      })),
      totalReferrals: referrals.length,
      activeCustomers,
      monthlyEarnings,
      totalEarnings,
      pendingPayout,
      commissions: commissions.slice(0, 50).map((c) => ({
        id: c.id,
        amount: c.amount,
        percentage: c.percentage,
        tierLevel: c.tierLevel,
        createdAt: c.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
