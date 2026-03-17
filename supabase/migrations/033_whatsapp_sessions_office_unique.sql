-- Ensure office_id has a unique constraint for upsert operations
-- One session per office (shared instance "saqr")

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'whatsapp_sessions_office_id_key'
  ) THEN
    -- Delete duplicate office sessions first (keep newest)
    DELETE FROM whatsapp_sessions a
    USING whatsapp_sessions b
    WHERE a.office_id = b.office_id
      AND a.updated_at < b.updated_at;

    ALTER TABLE public.whatsapp_sessions
      ADD CONSTRAINT whatsapp_sessions_office_id_key UNIQUE (office_id);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
