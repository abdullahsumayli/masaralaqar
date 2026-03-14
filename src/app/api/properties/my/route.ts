/**
 * GET /api/properties/my — عقارات المستخدم الحالي (Dashboard)
 * يستخدم الجلسة لتحديد tenant_id بدلاً من query param
 */

import { supabaseAdmin } from "@/lib/supabase";
import { getServerUser } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // جلب tenant_id الحقيقي للمستخدم
    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    const tenantId = userRow?.tenant_id;
    if (!tenantId) {
      return NextResponse.json({ success: true, properties: [], count: 0 });
    }

    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200);

    let query = supabaseAdmin
      .from("properties")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[/api/properties/my] query error:", error);
      return NextResponse.json(
        { error: "فشل في جلب العقارات", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      properties: data || [],
      count: data?.length || 0,
    });
  } catch (err: any) {
    console.error("[/api/properties/my] error:", err);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
