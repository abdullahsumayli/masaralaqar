-- Migration 011: Create properties table for real estate catalog

CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  location VARCHAR(255),
  area DECIMAL(10, 2),
  type VARCHAR(50) CHECK (type IN ('apartment', 'villa', 'land', 'commercial')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'archived')),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own properties
CREATE POLICY "Users can view their own properties"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own properties
CREATE POLICY "Users can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own properties
CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own properties
CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policy: Public can view featured properties
CREATE POLICY "Public can view featured properties"
  ON properties FOR SELECT
  USING (featured = TRUE OR status = 'available');

-- RLS Policy: Admins can view all properties
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
