/**
 * GET /api/admin/commissions — list commissions (admin only), paginated
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = (page - 1) * limit;
    const affiliateId = searchParams.get("affiliateId") || "";

    let query = supabaseAdmin
      .from("commissions")
      .select("id, affiliate_id, referral_id, subscription_id, amount, percentage, tier_level, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (affiliateId) {
      query = query.eq("affiliate_id", affiliateId);
    }

    const { data: commissions, count, error } = await query;

    if (error) throw error;

    const affiliateIds = [...new Set((commissions || []).map((c) => c.affiliate_id).filter(Boolean))];
    const { data: affiliates } = affiliateIds.length
      ? await supabaseAdmin.from("affiliates").select("id, user_id, referral_code").in("id", affiliateIds)
      : { data: [] };
    const userIds = [...new Set((affiliates || []).map((a) => a.user_id).filter(Boolean))];
    const { data: users } = userIds.length
      ? await supabaseAdmin.from("users").select("id, name, email").in("id", userIds)
      : { data: [] };

    const userMap = new Map((users || []).map((u) => [u.id, u]));
    const affiliateMap = new Map((affiliates || []).map((a) => [a.id, a]));

    const items = (commissions || []).map((c) => {
      const aff = affiliateMap.get(c.affiliate_id);
      const u = aff ? userMap.get(aff.user_id) : null;
      return {
        id: c.id,
        affiliateId: c.affiliate_id,
        referralId: c.referral_id,
        subscriptionId: c.subscription_id,
        amount: Number(c.amount),
        percentage: Number(c.percentage),
        tierLevel: c.tier_level,
        createdAt: c.created_at,
        affiliateName: (u?.name as string) || (u?.email as string),
        referralCode: aff?.referral_code,
      };
    });

    return NextResponse.json({
      commissions: items,
      total: count ?? 0,
      page,
      limit,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
