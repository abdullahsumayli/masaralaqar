-- Create whatsapp_sessions table (was missing from initial migrations)

CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL DEFAULT '',
  instance_id TEXT DEFAULT 'saqr',
  session_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (session_status IN ('pending', 'connected', 'disconnected')),
  api_token TEXT,
  webhook_url TEXT,
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_sessions_office_id_key UNIQUE (office_id)
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_instance_id ON whatsapp_sessions(instance_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_phone ON whatsapp_sessions(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_status ON whatsapp_sessions(session_status);

-- Allow PostgREST (authenticated + service_role) full access
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on whatsapp_sessions"
  ON public.whatsapp_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
