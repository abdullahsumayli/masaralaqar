/**
 * GET /api/admin/subscribers
 * Returns paginated list of all offices with subscription info (admin only)
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Fetch offices with user info
    let query = supabaseAdmin
      .from("offices")
      .select(`
        id,
        office_name,
        city,
        phone,
        created_at,
        user_id,
        users!offices_user_id_fkey (
          email,
          name,
          subscription
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`office_name.ilike.%${search}%`);
    }

    const { data: offices, count, error } = await query;

    if (error) throw error;

    // Fetch active subscription counts
    const officeIds = (offices || []).map((o) => o.id);
    const { data: subCounts } = await supabaseAdmin
      .from("user_subscriptions")
      .select("user_id, plan_name, status, ends_at")
      .in(
        "user_id",
        (offices || []).map((o) => o.user_id).filter(Boolean),
      )
      .eq("status", "active");

    const subMap = new Map(
      (subCounts || []).map((s) => [s.user_id, s]),
    );

    // Fetch property + lead counts per office
    const { data: propCounts } = await supabaseAdmin
      .from("properties")
      .select("office_id")
      .in("office_id", officeIds);

    const { data: leadCounts } = await supabaseAdmin
      .from("leads")
      .select("office_id")
      .in("office_id", officeIds);

    const propMap = new Map<string, number>();
    (propCounts || []).forEach((p) => {
      propMap.set(p.office_id, (propMap.get(p.office_id) || 0) + 1);
    });

    const leadMap = new Map<string, number>();
    (leadCounts || []).forEach((l) => {
      leadMap.set(l.office_id, (leadMap.get(l.office_id) || 0) + 1);
    });

    const subscribers = (offices || []).map((office) => {
      const user = Array.isArray(office.users) ? office.users[0] : office.users;
      const sub = subMap.get(office.user_id);
      const planName = sub?.plan_name || user?.subscription || "free";

      return {
        id: office.id,
        officeName: office.office_name,
        city: office.city,
        email: user?.email || "",
        name: user?.name || "",
        plan: planName,
        subscriptionStatus: sub?.status || "free",
        endsAt: sub?.ends_at || null,
        properties: propMap.get(office.id) || 0,
        leads: leadMap.get(office.id) || 0,
        createdAt: office.created_at,
      };
    });

    // Client-side filter by status if needed
    const filtered =
      status && status !== "all"
        ? subscribers.filter((s) =>
            status === "active"
              ? s.subscriptionStatus === "active"
              : status === "free"
              ? s.plan === "free"
              : true,
          )
        : subscribers;

    return NextResponse.json({
      subscribers: filtered,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
