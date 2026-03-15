-- Add company column to users if missing (fix: "Could not find the 'company' column of 'users' in the schema cache")
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'company'
  ) THEN
    ALTER TABLE public.users ADD COLUMN company TEXT;
  END IF;
END $$;
