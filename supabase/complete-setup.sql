-- Complete Database Setup for MasarAlAqar
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jtwlyexgptntdubxnnaw/sql

-- ================================================
-- 1. Create tenants table (Multi-tenant support)
-- ================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  office_name VARCHAR(255),
  whatsapp_number VARCHAR(20) UNIQUE NOT NULL,
  webhook_secret VARCHAR(255),
  ai_model VARCHAR(50) DEFAULT 'gpt-4o-mini',
  ai_prompt TEXT,
  subscription_status VARCHAR(20) DEFAULT 'trial',
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 2. Create properties table (Real Estate Catalog)
-- ================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  city VARCHAR(100),
  location VARCHAR(255),
  area DECIMAL(10, 2),
  type VARCHAR(50) CHECK (type IN ('apartment', 'villa', 'land', 'commercial')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented', 'archived')),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_tenant_id ON properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties (allow all for service role)
DROP POLICY IF EXISTS "Allow all access to properties" ON properties;
CREATE POLICY "Allow all access to properties"
  ON properties FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for tenants
DROP POLICY IF EXISTS "Allow all access to tenants" ON tenants;
CREATE POLICY "Allow all access to tenants"
  ON tenants FOR ALL
  USING (true)
  WITH CHECK (true);

-- ================================================
-- 3. Create leads table
-- ================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  preferred_city VARCHAR(100),
  preferred_type VARCHAR(50),
  budget_max BIGINT,
  bedrooms_min INTEGER,
  source VARCHAR(50) DEFAULT 'whatsapp',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to leads" ON leads;
CREATE POLICY "Allow all access to leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

-- ================================================
-- 4. Create storage bucket for property images
-- ================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Anyone can upload property images" ON storage.objects;
CREATE POLICY "Anyone can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Anyone can delete property images" ON storage.objects;
CREATE POLICY "Anyone can delete property images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images');

-- ================================================
-- 5. Insert default tenant
-- ================================================
INSERT INTO tenants (id, name, office_name, whatsapp_number, webhook_secret)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Masar Real Estate',
  'مسار العقار',
  '966545374069',
  'masar2024secret'
)
ON CONFLICT (whatsapp_number) DO NOTHING;

-- ================================================
-- 6. Verify setup
-- ================================================
SELECT 'Tenants' as table_name, count(*) as count FROM tenants
UNION ALL
SELECT 'Properties' as table_name, count(*) as count FROM properties
UNION ALL
SELECT 'Leads' as table_name, count(*) as count FROM leads;
