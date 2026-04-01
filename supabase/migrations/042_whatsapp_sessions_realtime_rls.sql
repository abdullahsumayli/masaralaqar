-- Realtime: push whatsapp_sessions changes to dashboard (session disconnect/connect)
-- RLS: tenant-scoped SELECT for authenticated users (APIs keep using service role)

ALTER TABLE public.whatsapp_sessions REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'whatsapp_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_sessions;
  END IF;
END $$;

DROP POLICY IF EXISTS "Service role full access on whatsapp_sessions" ON public.whatsapp_sessions;
DROP POLICY IF EXISTS "full_access" ON public.whatsapp_sessions;

CREATE POLICY "whatsapp_sessions_select_own_office"
  ON public.whatsapp_sessions
  FOR SELECT
  TO authenticated
  USING (
    office_id IN (
      SELECT u.office_id
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.office_id IS NOT NULL
    )
  );

NOTIFY pgrst, 'reload schema';
