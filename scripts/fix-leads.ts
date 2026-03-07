// Fix leads table: add conversation_history column
const SUPABASE_URL = "https://jtwlyexgptntdubxnnaw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM4NDcxNCwiZXhwIjoyMDg2OTYwNzE0fQ.7N2XRif1EChlm1gbrB-ayf11Cp-9zrOR3JTREeORoSI";

async function fixLeadsTable() {
  console.log("🔧 Checking and fixing leads table schema...\n");

  // Check current leads table structure
  const checkRes = await fetch(
    `${SUPABASE_URL}/rest/v1/leads?select=*&limit=1`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );

  if (!checkRes.ok) {
    const error = await checkRes.text();
    console.log("❌ Leads check failed:", error);

    // Table might not exist, create it
    console.log("\n📋 Creating leads table...");
    console.log("Please run this SQL in Supabase SQL Editor:\n");
    console.log(`
-- Create leads table if not exists
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  message TEXT,
  source VARCHAR(20) DEFAULT 'whatsapp',
  status VARCHAR(20) DEFAULT 'new',
  city VARCHAR(100),
  budget DECIMAL(15, 2),
  property_type VARCHAR(50),
  bedrooms INTEGER,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy for service role
CREATE POLICY "Service role can do everything on leads"
ON leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
`);
    return;
  }

  const sample = await checkRes.json();
  console.log(
    "📊 Current leads table sample:",
    JSON.stringify(sample, null, 2),
  );

  // Check if conversation_history exists
  if (sample.length > 0 && "conversation_history" in sample[0]) {
    console.log("✅ conversation_history column exists");
  } else {
    console.log("⚠️ conversation_history column missing");
    console.log("\n📋 Run this SQL in Supabase SQL Editor:\n");
    console.log(`
ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversation_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget DECIMAL(15, 2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_type VARCHAR(50);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bedrooms INTEGER;
NOTIFY pgrst, 'reload schema';
`);
  }
}

fixLeadsTable();
