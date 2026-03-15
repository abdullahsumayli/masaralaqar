/**
 * GET /api/admin/affiliates — list affiliates (admin only), paginated
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
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    const { data: affiliates, error } = await supabaseAdmin
      .from("affiliates")
      .select("id, user_id, referral_code, parent_affiliate_id, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const userIds = [...new Set((affiliates || []).map((a) => a.user_id).filter(Boolean))];
    const { data: users } = userIds.length
      ? await supabaseAdmin.from("users").select("id, name, email").in("id", userIds)
      : { data: [] };

    const userMap = new Map((users || []).map((u) => [u.id, u]));

    const { count } = await supabaseAdmin
      .from("affiliates")
      .select("*", { count: "exact", head: true });

    const items = (affiliates || []).map((a) => ({
      id: a.id,
      userId: a.user_id,
      referralCode: a.referral_code,
      parentAffiliateId: a.parent_affiliate_id,
      createdAt: a.created_at,
      name: userMap.get(a.user_id)?.name,
      email: userMap.get(a.user_id)?.email,
    }));

    return NextResponse.json({
      affiliates: items,
      total: count ?? 0,
      page,
      limit,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
