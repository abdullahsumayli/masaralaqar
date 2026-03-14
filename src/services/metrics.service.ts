/**
 * Metrics Service — system performance tracking
 *
 * Architecture:
 *   ┌──────────────┐     track()      ┌────────────────┐
 *   │  Webhook     │────────────────▶ │ system_metrics  │
 *   │  Worker      │                  │ (Supabase)      │
 *   │  Payments    │                  └────────┬───────┘
 *   │  AI Engine   │                           │ query()
 *   └──────────────┘                  ┌────────▼───────┐
 *                                     │ /api/system/    │
 *                                     │   metrics       │
 *                                     └────────────────┘
 *
 * Tracked metrics:
 *   - total_messages_received   — WhatsApp messages arriving at webhook
 *   - total_messages_processed  — Messages successfully processed by worker
 *   - failed_messages           — Messages that exhausted all retries
 *   - ai_response_time          — AI engine response latency (ms)
 *   - queue_wait_time           — Time from enqueue to processing start (ms)
 *   - payment_success_count     — Successful payment completions
 */

import { logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase";

const MODULE = "MetricsService";

/** Standard metric names used across the system */
export const METRIC = {
  MESSAGES_RECEIVED: "total_messages_received",
  MESSAGES_PROCESSED: "total_messages_processed",
  FAILED_MESSAGES: "failed_messages",
  AI_RESPONSE_TIME: "ai_response_time",
  QUEUE_WAIT_TIME: "queue_wait_time",
  PAYMENT_SUCCESS: "payment_success_count",
  PAYMENT_FAILED: "payment_failed_count",
  WEBHOOK_ERROR: "webhook_error",
} as const;

export class MetricsService {
  /**
   * Record a single metric data point.
   * Fire-and-forget — errors are logged but never thrown.
   */
  static async track(
    metricName: string,
    value: number = 1,
    tags?: Record<string, string>,
    unit: string = "count",
  ): Promise<void> {
    try {
      await supabaseAdmin.from("system_metrics").insert({
        metric_name: metricName,
        metric_value: value,
        unit,
        tags: tags || {},
      });
    } catch (err) {
      logger.error(MODULE, "Failed to record metric", err, {
        metricName,
        value,
      });
    }
  }

  /**
   * Track a timing metric (duration in ms).
   */
  static async trackTiming(
    metricName: string,
    durationMs: number,
    tags?: Record<string, string>,
  ): Promise<void> {
    return this.track(metricName, durationMs, tags, "ms");
  }

  /**
   * Get aggregated metrics for the dashboard.
   * Returns counts/averages for each metric over a time window.
   */
  static async getAggregated(hours: number = 24): Promise<{
    messagesReceived: number;
    messagesProcessed: number;
    failedMessages: number;
    avgAiResponseTime: number;
    avgQueueWaitTime: number;
    paymentSuccessCount: number;
  }> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from("system_metrics")
      .select("metric_name, metric_value")
      .gte("recorded_at", since);

    if (error) {
      logger.error(MODULE, "Failed to query metrics", error);
      return {
        messagesReceived: 0,
        messagesProcessed: 0,
        failedMessages: 0,
        avgAiResponseTime: 0,
        avgQueueWaitTime: 0,
        paymentSuccessCount: 0,
      };
    }

    const rows = data || [];
    const sumOf = (name: string) =>
      rows
        .filter((r) => r.metric_name === name)
        .reduce((sum, r) => sum + Number(r.metric_value), 0);
    const avgOf = (name: string) => {
      const matching = rows.filter((r) => r.metric_name === name);
      if (matching.length === 0) return 0;
      return Math.round(
        matching.reduce((sum, r) => sum + Number(r.metric_value), 0) /
          matching.length,
      );
    };

    return {
      messagesReceived: sumOf(METRIC.MESSAGES_RECEIVED),
      messagesProcessed: sumOf(METRIC.MESSAGES_PROCESSED),
      failedMessages: sumOf(METRIC.FAILED_MESSAGES),
      avgAiResponseTime: avgOf(METRIC.AI_RESPONSE_TIME),
      avgQueueWaitTime: avgOf(METRIC.QUEUE_WAIT_TIME),
      paymentSuccessCount: sumOf(METRIC.PAYMENT_SUCCESS),
    };
  }

  /**
   * Get time-series data for a specific metric (for charts).
   * Returns hourly buckets over the given number of hours.
   */
  static async getTimeSeries(
    metricName: string,
    hours: number = 24,
  ): Promise<Array<{ hour: string; value: number; count: number }>> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from("system_metrics")
      .select("metric_value, recorded_at")
      .eq("metric_name", metricName)
      .gte("recorded_at", since)
      .order("recorded_at", { ascending: true });

    if (error) {
      logger.error(MODULE, "Failed to query time series", error, {
        metricName,
      });
      return [];
    }

    // Bucket into hourly intervals
    const buckets = new Map<string, { total: number; count: number }>();
    for (const row of data || []) {
      const hourKey = row.recorded_at.slice(0, 13) + ":00"; // "2026-03-12T14:00"
      const existing = buckets.get(hourKey) || { total: 0, count: 0 };
      existing.total += Number(row.metric_value);
      existing.count += 1;
      buckets.set(hourKey, existing);
    }

    return Array.from(buckets.entries()).map(([hour, { total, count }]) => ({
      hour,
      value: Math.round(total / count),
      count,
    }));
  }
}
