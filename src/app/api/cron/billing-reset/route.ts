/**
 * GET /api/cron/billing-reset
 *
 * Daily cron: reset messages_used for subscriptions past billing_cycle_end
 * Secured by CRON_SECRET env var
 */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    const { data: expired, error } = await supabaseAdmin
      .from("subscriptions")
      .select("id, office_id, billing_cycle_end")
      .in("status", ["active", "trial"])
      .lt("billing_cycle_end", now);

    if (error) {
      console.error("[BillingReset] fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch expired subscriptions" },
        { status: 500 },
      );
    }

    if (!expired?.length) {
      return NextResponse.json({
        success: true,
        reset: 0,
        message: "No subscriptions to reset",
      });
    }

    const cycleEnd = new Date();
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);
    const nextCycleEnd = cycleEnd.toISOString();

    let resetCount = 0;
    for (const sub of expired) {
      const { error: updateError } = await supabaseAdmin
        .from("subscriptions")
        .update({
          ai_messages_used: 0,
          whatsapp_messages_used: 0,
          overage_messages: 0,
          overage_amount_sar: 0,
          billing_cycle_start: now,
          billing_cycle_end: nextCycleEnd,
          updated_at: now,
        })
        .eq("id", sub.id);

      if (!updateError) resetCount++;
    }

    return NextResponse.json({
      success: true,
      reset: resetCount,
      total: expired.length,
    });
  } catch (err) {
    console.error("[BillingReset] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
