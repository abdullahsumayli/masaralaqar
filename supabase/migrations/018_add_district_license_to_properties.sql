-- Migration 018: Add district and license_number fields to properties table

ALTER TABLE properties ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS license_number VARCHAR(100);

-- Create index for district searches
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
