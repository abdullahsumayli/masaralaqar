/**
 * GET /api/queue/metrics — Queue statistics for ops dashboard
 * Returns: waiting, active, completed, failed
 * Alert rules: waiting > 50 → warning, failed > 10 → critical
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { getMessageQueue } from "@/queues/message.queue";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    let waiting = 0;
    let active = 0;
    let completed = 0;
    let failed = 0;

    try {
      const queue = getMessageQueue();
      [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
      ]);
    } catch {
      // Redis/queue unavailable — return zeros
    }

    const alerts: string[] = [];
    if (waiting > 50) alerts.push("warning: waiting > 50");
    if (failed > 10) alerts.push("critical: failed > 10");

    return NextResponse.json({
      success: true,
      data: {
        waiting,
        active,
        completed,
        failed,
        alerts: alerts.length > 0 ? alerts : null,
      },
    });
  } catch (err) {
    console.error("[Queue Metrics] error:", err);
    return NextResponse.json(
      { error: "فشل في جلب إحصائيات الطابور" },
      { status: 500 },
    );
  }
}
