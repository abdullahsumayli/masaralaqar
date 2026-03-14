-- Migration 024: Create failed_messages table for queue dead-letter storage
--
-- When the BullMQ worker exhausts all retry attempts (3 retries with
-- exponential backoff), the failed job is persisted here so that
-- operators can review, debug, and optionally re-process messages.

CREATE TABLE IF NOT EXISTS failed_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  message_text TEXT NOT NULL,
  office_id TEXT NOT NULL,
  route TEXT NOT NULL DEFAULT 'evolution',
  tenant_id TEXT,
  error_message TEXT,
  error_stack TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  job_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Index for querying unresolved failures by office
CREATE INDEX IF NOT EXISTS idx_failed_messages_office_unresolved
  ON failed_messages (office_id, created_at DESC)
  WHERE resolved_at IS NULL;

-- Index for deduplication checks
CREATE INDEX IF NOT EXISTS idx_failed_messages_message_id
  ON failed_messages (message_id);

-- RLS
ALTER TABLE failed_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on failed_messages"
  ON failed_messages FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
