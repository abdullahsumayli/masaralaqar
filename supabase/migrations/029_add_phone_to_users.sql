-- Add phone column to users if missing
-- Fix: "Could not find the 'phone' column of 'users' in the schema cache"
-- Same pattern as 028_add_company_to_users.sql

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.users ADD COLUMN phone TEXT;
  END IF;
END $$;
