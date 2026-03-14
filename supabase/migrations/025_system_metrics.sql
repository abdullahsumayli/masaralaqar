-- Migration 025: System metrics table for observability
--
-- Stores time-series performance metrics for monitoring dashboards.
-- Metrics are written by the MetricsService and read by /api/system/metrics.
--
-- Architecture:
--   Worker/Webhook → MetricsService.track() → system_metrics table
--   Dashboard      → /api/system/metrics    → aggregated queries

CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT DEFAULT 'count',
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast queries by metric name + time range (most common access pattern)
CREATE INDEX IF NOT EXISTS idx_system_metrics_name_time
  ON system_metrics (metric_name, recorded_at DESC);

-- Fast queries for dashboard aggregation by time bucket
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at
  ON system_metrics (recorded_at DESC);

-- RLS: only service_role can write, admin users can read
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on system_metrics"
  ON system_metrics FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
