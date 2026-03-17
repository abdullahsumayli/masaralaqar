-- Add office_id to conversation_messages for Evolution path
-- tenant_id made nullable for offices without a tenant row

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'conversation_messages' AND column_name = 'office_id'
  ) THEN
    ALTER TABLE public.conversation_messages ADD COLUMN office_id UUID REFERENCES offices(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_conversation_messages_office_id ON conversation_messages(office_id);
  END IF;

  ALTER TABLE public.conversation_messages ALTER COLUMN tenant_id DROP NOT NULL;
END $$;

NOTIFY pgrst, 'reload schema';
