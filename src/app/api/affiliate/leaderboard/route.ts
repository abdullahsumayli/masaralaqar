/**
 * GET /api/affiliate/leaderboard
 * Top 20 affiliates by revenue and by customers referred.
 */

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: commissionRows } = await supabaseAdmin
      .from("commissions")
      .select("affiliate_id, amount");

    const revenueByAffiliate = new Map<string, number>();
    for (const row of commissionRows || []) {
      const id = row.affiliate_id as string;
      revenueByAffiliate.set(id, (revenueByAffiliate.get(id) ?? 0) + Number(row.amount));
    }
    const byRevenue = Array.from(revenueByAffiliate.entries())
      .map(([affiliateId, total]) => ({ affiliateId, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 20);

    const { data: referralRows } = await supabaseAdmin.from("referrals").select("affiliate_id");
    const countByAffiliate = new Map<string, number>();
    for (const r of referralRows || []) {
      const id = r.affiliate_id as string;
      countByAffiliate.set(id, (countByAffiliate.get(id) ?? 0) + 1);
    }
    const byCustomers = Array.from(countByAffiliate.entries())
      .map(([affiliateId, count]) => ({ affiliateId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const allAffiliateIds = [
      ...new Set([...byRevenue.map((r) => r.affiliateId), ...byCustomers.map((r) => r.affiliateId)]),
    ].filter(Boolean);

    let affiliates: { id: string; user_id: string; referral_code: string }[] = [];
    let users: { id: string; name: string | null; email: string }[] = [];

    if (allAffiliateIds.length > 0) {
      const { data: affData } = await supabaseAdmin
        .from("affiliates")
        .select("id, user_id, referral_code")
        .in("id", allAffiliateIds);
      affiliates = affData || [];

      const userIds = affiliates.map((a) => a.user_id).filter(Boolean);
      if (userIds.length > 0) {
        const { data: userData } = await supabaseAdmin
          .from("users")
          .select("id, name, email")
          .in("id", userIds);
        users = userData || [];
      }
    }

    const userMap = new Map(users.map((u) => [u.id, u]));
    const affiliateMap = new Map(affiliates.map((a) => [a.id, a]));

    const revenueList = byRevenue.map((r, i) => {
      const aff = affiliateMap.get(r.affiliateId);
      const u = aff ? userMap.get(aff.user_id) : null;
      return {
        rank: i + 1,
        affiliateId: r.affiliateId,
        name: (u?.name as string) || (u?.email as string) || "—",
        referralCode: aff?.referral_code,
        revenue: Math.round(r.total * 100) / 100,
      };
    });

    const customersList = byCustomers.map((r, i) => {
      const aff = affiliateMap.get(r.affiliateId);
      const u = aff ? userMap.get(aff.user_id) : null;
      return {
        rank: i + 1,
        affiliateId: r.affiliateId,
        name: (u?.name as string) || (u?.email as string) || "—",
        referralCode: aff?.referral_code,
        customers: r.count,
      };
    });

    return NextResponse.json({
      byRevenue: revenueList,
      byCustomers: customersList,
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
