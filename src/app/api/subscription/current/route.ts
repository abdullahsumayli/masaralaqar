/**
 * GET /api/subscription/current
 * Returns the authenticated user's active subscription details
 */

import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { data: subscription } = await supabaseAdmin
      .from("user_subscriptions")
      .select("plan_name, status, ends_at, renewal_date, started_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!subscription) {
      return NextResponse.json({
        subscription: {
          planName: "free",
          status: "active",
          endsAt: null,
        },
      });
    }

    return NextResponse.json({
      subscription: {
        planName: subscription.plan_name,
        status: subscription.status,
        endsAt: subscription.ends_at || subscription.renewal_date,
        startedAt: subscription.started_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
