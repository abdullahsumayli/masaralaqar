-- Migration 017: Create conversation_messages table for long-term memory
-- Each WhatsApp message (user + assistant) stored as a separate row
-- Enables passing conversation context to GPT without JSONB limits

CREATE TABLE IF NOT EXISTS conversation_messages (
  id         UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id  UUID                     NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id    UUID                     NOT NULL,
  role       TEXT                     NOT NULL CHECK (role IN ('user', 'assistant')),
  message    TEXT                     NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookup by lead
CREATE INDEX IF NOT EXISTS idx_conv_messages_lead_id  ON conversation_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_conv_messages_tenant   ON conversation_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conv_messages_created  ON conversation_messages(lead_id, created_at DESC);

-- Enable RLS
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Service role has full access (used by the bot server)
CREATE POLICY "Service role full access on conversation_messages"
  ON conversation_messages FOR ALL
  USING (true)
  WITH CHECK (true);
