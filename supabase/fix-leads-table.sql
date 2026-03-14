-- SQL Script to fix leads table for MasarAlAqar WhatsApp Bot
-- Run this in Supabase SQL Editor

-- Add missing columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversation_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget DECIMAL(15, 2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_type VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bedrooms INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS location_interest VARCHAR(200);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_type_interest VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'whatsapp';

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;
