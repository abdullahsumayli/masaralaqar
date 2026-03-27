-- WhatsApp connection incident tracking
-- Events: instance_disconnected, auto_reconnect_triggered, reconnect_success, reconnect_failed

CREATE TABLE IF NOT EXISTS whatsapp_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  instance_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'instance_disconnected',
    'auto_reconnect_triggered',
    'reconnect_success',
    'reconnect_failed'
  )),
  needs_manual_intervention BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_incidents_office_id ON whatsapp_incidents(office_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_incidents_instance_name ON whatsapp_incidents(instance_name);
CREATE INDEX IF NOT EXISTS idx_whatsapp_incidents_event_type ON whatsapp_incidents(event_type);
CREATE INDEX IF NOT EXISTS idx_whatsapp_incidents_created_at ON whatsapp_incidents(created_at DESC);

ALTER TABLE whatsapp_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on whatsapp_incidents"
  ON whatsapp_incidents FOR ALL USING (true) WITH CHECK (true);
