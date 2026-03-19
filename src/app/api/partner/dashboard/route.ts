/**
 * GET /api/partner/dashboard
 * Partner (affiliate) stats: total signups, paid clients, earnings, balance, referral link.
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
      return NextResponse.json({ error: "حساب الشريك غير موجود" }, { status: 403 });
    }

    const baseUrl =
      typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
        ? process.env.NEXT_PUBLIC_SITE_URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "https://masaralaqar.com";
    const referralLink = `${baseUrl}/auth/signup?ref=${affiliate.referralCode}`;

    const [referrals, commissions, totalEarnings, paidPayoutSum] = await Promise.all([
      AffiliateRepository.getReferralsByAffiliateId(affiliate.id),
      AffiliateRepository.getCommissionsByAffiliateId(affiliate.id),
      AffiliateRepository.getTotalEarningsByAffiliateId(affiliate.id),
      AffiliateRepository.getPaidPayoutSumByAffiliateId(affiliate.id),
    ]);

    const referredUserIds = referrals.map((r) => r.referredUserId);
    let paidClients = 0;
    if (referredUserIds.length > 0) {
      const { count } = await supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .in("user_id", referredUserIds)
        .eq("status", "active");
      paidClients = count ?? 0;
    }

    const balance = totalEarnings - paidPayoutSum;
    const totalSignups = referrals.length;
    const conversionRate =
      totalSignups > 0 ? Math.round((paidClients / totalSignups) * 100) : 0;
    const avgEarningsPerClient =
      paidClients > 0 ? totalEarnings / paidClients : 0;

    return NextResponse.json({
      totalSignups,
      totalPaidClients: paidClients,
      totalEarnings,
      balance,
      conversionRate,
      avgEarningsPerClient,
      referralLink,
      referralCode: affiliate.referralCode,
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
