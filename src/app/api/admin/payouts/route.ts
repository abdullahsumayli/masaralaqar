/**
 * GET /api/admin/payouts — list payouts (admin only)
 * PATCH /api/admin/payouts — update payout status (approve/paid/reject)
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
    const status = searchParams.get("status") || "";

    let query = supabaseAdmin
      .from("payouts")
      .select("id, affiliate_id, amount, status, processed_at, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: payouts, count, error } = await query;

    if (error) throw error;

    const affiliateIds = [...new Set((payouts || []).map((p) => p.affiliate_id).filter(Boolean))];
    const { data: affiliates } = affiliateIds.length
      ? await supabaseAdmin.from("affiliates").select("id, user_id, referral_code").in("id", affiliateIds)
      : { data: [] };
    const userIds = [...new Set((affiliates || []).map((a) => a.user_id).filter(Boolean))];
    const { data: users } = userIds.length
      ? await supabaseAdmin.from("users").select("id, name, email").in("id", userIds)
      : { data: [] };

    const userMap = new Map((users || []).map((u) => [u.id, u]));
    const affiliateMap = new Map((affiliates || []).map((a) => [a.id, a]));

    const items = (payouts || []).map((p) => {
      const aff = affiliateMap.get(p.affiliate_id);
      const u = aff ? userMap.get(aff.user_id) : null;
      return {
        id: p.id,
        affiliateId: p.affiliate_id,
        amount: Number(p.amount),
        status: p.status,
        processedAt: p.processed_at,
        createdAt: p.created_at,
        affiliateName: (u?.name as string) || (u?.email as string),
        referralCode: aff?.referral_code,
      };
    });

    return NextResponse.json({
      payouts: items,
      total: count ?? 0,
      page,
      limit,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: create payout (admin only) */
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const affiliateId = body.affiliateId as string;
    const amount = Number(body.amount);

    if (!affiliateId || !(amount > 0)) {
      return NextResponse.json({ error: "معرف الشريك والمبلغ مطلوبان" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("payouts")
      .insert({ affiliate_id: affiliateId, amount, status: "pending" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, payout: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const payoutId = body.payoutId as string;
    const status = body.status as string;

    if (!payoutId || !["approved", "paid", "rejected"].includes(status)) {
      return NextResponse.json({ error: "معرف الصرف والحالة مطلوبان (approved | paid | rejected)" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("payouts")
      .update({
        status: status === "approved" ? "approved" : status === "paid" ? "paid" : "rejected",
        processed_at: new Date().toISOString(),
      })
      .eq("id", payoutId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, payout: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
