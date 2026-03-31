-- 040: usage_logs — إضافة message_received
--     whatsapp_onboarding_events — تتبع مسار ربط واتساب للتحليلات

ALTER TABLE usage_logs DROP CONSTRAINT IF EXISTS usage_logs_type_check;
ALTER TABLE usage_logs ADD CONSTRAINT usage_logs_type_check
  CHECK (type IN (
    'ai_message', 'whatsapp_message', 'property_created',
    'ai_response', 'lead_created', 'message_sent', 'message_received'
  ));

CREATE TABLE IF NOT EXISTS whatsapp_onboarding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  event TEXT NOT NULL CHECK (event IN (
    'whatsapp_connect_clicked',
    'whatsapp_qr_shown',
    'whatsapp_connected',
    'whatsapp_failed'
  )),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wa_onb_events_office_created
  ON whatsapp_onboarding_events (office_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_onb_events_event
  ON whatsapp_onboarding_events (event);
CREATE INDEX IF NOT EXISTS idx_wa_onb_events_created
  ON whatsapp_onboarding_events (created_at DESC);

ALTER TABLE whatsapp_onboarding_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_onboarding_events_service_role"
  ON whatsapp_onboarding_events
  FOR ALL
  USING (true)
  WITH CHECK (true);
