-- Add severity and new event types to whatsapp_incidents

ALTER TABLE whatsapp_incidents
  ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info';

-- Drop old event_type check to add new event types
ALTER TABLE whatsapp_incidents DROP CONSTRAINT IF EXISTS whatsapp_incidents_event_type_check;

ALTER TABLE whatsapp_incidents
  ADD CONSTRAINT whatsapp_incidents_event_type_check
  CHECK (event_type IN (
    'instance_disconnected',
    'auto_reconnect_triggered',
    'reconnect_success',
    'reconnect_failed',
    'manual_reconnect_triggered',
    'manual_disconnect'
  ));

CREATE INDEX IF NOT EXISTS idx_whatsapp_incidents_severity ON whatsapp_incidents(severity);
