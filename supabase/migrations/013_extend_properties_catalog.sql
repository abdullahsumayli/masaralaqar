-- Migration 013: Extend properties table for real estate catalog

-- Add missing columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- Create index for city searches
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

-- Update RLS policies to allow tenant-based access for API
DROP POLICY IF EXISTS "Allow service role full access" ON properties;
CREATE POLICY "Allow service role full access"
  ON properties FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create property-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images' AND
    auth.role() = 'authenticated'
  );

-- Storage policy: Public can view property images
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Storage policy: Users can delete their own images
CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
