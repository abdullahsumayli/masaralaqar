-- Migration 014: Add missing fields to leads table
-- Adds conversation history, preferences, and WhatsApp-specific fields

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS conversation_history JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS location_interest TEXT,
  ADD COLUMN IF NOT EXISTS budget NUMERIC,
  ADD COLUMN IF NOT EXISTS property_type_interest TEXT,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

-- Index for faster conversation lookups
CREATE INDEX IF NOT EXISTS idx_leads_last_contacted ON leads(last_contacted_at DESC);
