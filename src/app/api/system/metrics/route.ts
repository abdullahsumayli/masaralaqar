/**
 * System Metrics API — aggregated statistics for dashboard
 *
 * Returns:
 *   - Aggregated counters (messages, failures, payments)
 *   - Time-series data for charts (message throughput, AI latency, queue size)
 *
 * URL: GET /api/system/metrics?hours=24
 * Protected: admin only
 */

import { MetricsService, METRIC } from "@/services/metrics.service";
import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Admin-only access
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const hours = parseInt(
      request.nextUrl.searchParams.get("hours") || "24",
      10,
    );
    const safeHours = Math.min(Math.max(hours, 1), 168); // 1h to 7 days

    const [aggregated, messageThroughput, aiLatency, queueWaitTime] =
      await Promise.all([
        MetricsService.getAggregated(safeHours),
        MetricsService.getTimeSeries(METRIC.MESSAGES_PROCESSED, safeHours),
        MetricsService.getTimeSeries(METRIC.AI_RESPONSE_TIME, safeHours),
        MetricsService.getTimeSeries(METRIC.QUEUE_WAIT_TIME, safeHours),
      ]);

    return NextResponse.json({
      data: {
        aggregated,
        timeSeries: {
          messageThroughput,
          aiLatency,
          queueWaitTime,
        },
        period: `${safeHours}h`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Metrics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
