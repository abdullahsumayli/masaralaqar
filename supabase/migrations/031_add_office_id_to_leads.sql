-- Add office_id to leads for Evolution path (new offices don't have tenant_id)
-- Also make tenant_id nullable for offices that only use office_id

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'office_id'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN office_id UUID REFERENCES offices(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_leads_office_id ON leads(office_id);
  END IF;

  -- Make tenant_id nullable if it isn't already
  ALTER TABLE public.leads ALTER COLUMN tenant_id DROP NOT NULL;
END $$;

NOTIFY pgrst, 'reload schema';
