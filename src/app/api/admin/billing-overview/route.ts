/**
 * GET /api/admin/billing-overview
 *
 * Admin: MRR, top usage offices, revenue estimation
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin")
      return NextResponse.json(
        { error: "صلاحيات غير كافية" },
        { status: 403 },
      );

    // MRR = sum(active subscriptions monthly price)
    const { data: activeSubs } = await supabaseAdmin
      .from("subscriptions")
      .select("id, office_id, plan_id, ai_messages_used, message_limit")
      .in("status", ["active", "trial"]);

    const planIds = [
      ...new Set(
        (activeSubs ?? []).map((s: { plan_id: string }) => s.plan_id),
      ),
    ];
    const { data: plans } = await supabaseAdmin
      .from("plans")
      .select("id, name, price")
      .in("id", planIds);

    const planMap = new Map(
      (plans ?? []).map((p) => [
        p.id,
        { name: p.name, price: Number(p.price) || 0 },
      ]),
    );

    const officeIds = [
      ...new Set(
        (activeSubs ?? []).map((s: { office_id: string }) => s.office_id),
      ),
    ];
    const { data: offices } = await supabaseAdmin
      .from("offices")
      .select("id, office_name")
      .in("id", officeIds);

    const officeMap = new Map(
      (offices ?? []).map((o) => [o.id, o.office_name ?? "—"]),
    );

    let mrr = 0;
    const officeUsage: Array<{
      officeId: string;
      officeName: string;
      planName: string;
      price: number;
      messagesUsed: number;
      messageLimit: number;
      percentUsed: number;
    }> = [];

    for (const sub of activeSubs ?? []) {
      const plan = planMap.get(sub.plan_id);
      const price = plan?.price ?? 0;
      mrr += price;
      const used = (sub.ai_messages_used as number) ?? 0;
      const limit = (sub.message_limit as number) ?? 300;
      officeUsage.push({
        officeId: sub.office_id,
        officeName: officeMap.get(sub.office_id) ?? "—",
        planName: plan?.name ?? "free",
        price,
        messagesUsed: used,
        messageLimit: limit,
        percentUsed: limit > 0 ? Math.min(100, (used / limit) * 100) : 0,
      });
    }

    // Sort by usage (desc)
    officeUsage.sort((a, b) => b.messagesUsed - a.messagesUsed);

    return NextResponse.json({
      success: true,
      mrr,
      mrrFormatted: `${mrr.toLocaleString("ar-SA")} ر.س`,
      topUsage: officeUsage.slice(0, 20),
      totalActiveOffices: officeIds.length,
    });
  } catch (err) {
    console.error("[Admin Billing Overview] error:", err);
    return NextResponse.json(
      { error: "خطأ في الخادم" },
      { status: 500 },
    );
  }
}
