-- Migration 012: Add Multi-Tenant Support

-- 1. Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  office_name VARCHAR(255),
  whatsapp_number VARCHAR(20) UNIQUE NOT NULL,
  webhook_secret VARCHAR(255),
  webhook_url TEXT,
  ai_persona TEXT, -- JSON: agent_name, response_style, welcome_message
  openai_api_key TEXT ENCRYPTED, -- Placeholder for API keys
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add tenant_id to existing tables
ALTER TABLE properties ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE leads ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- 3. Create indexes for better performance
CREATE INDEX idx_tenants_whatsapp ON tenants(whatsapp_number);
CREATE INDEX idx_tenants_webhook_secret ON tenants(webhook_secret);
CREATE INDEX idx_properties_tenant_id ON properties(tenant_id);
CREATE INDEX idx_leads_tenant_id ON leads(tenant_id);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- 4. Enable RLS on tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Users can view their own tenant"
  ON tenants FOR SELECT
  USING (
    id IN (SELECT tenant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Only super admins can view all tenants"
  ON tenants FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- 5. Update RLS policies for properties to include tenant_id
DROP POLICY IF EXISTS "Users can view their own properties" ON properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON properties;
DROP POLICY IF EXISTS "Public can view featured properties" ON properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON properties;

CREATE POLICY "Users can view tenant properties"
  ON properties FOR SELECT
  USING (
    tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert tenant properties"
  ON properties FOR INSERT
  WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update tenant properties"
  ON properties FOR UPDATE
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()))
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can delete tenant properties"
  ON properties FOR DELETE
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Public can view featured properties"
  ON properties FOR SELECT
  USING (featured = TRUE AND status = 'available');

-- 6. Update RLS policies for leads
DROP POLICY IF EXISTS "Users can view leads" ON leads;

CREATE POLICY "Users can view tenant leads"
  ON leads FOR SELECT
  USING (
    tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can create leads"
  ON leads FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users can update tenant leads"
  ON leads FOR UPDATE
  USING (tenant_id IN (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- 7. Migrate existing data (if needed)
-- Users without tenant_id will need to be assigned
-- This assumes a default tenant or manual migration
