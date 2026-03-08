/**
 * Migration Runner: 017_create_conversation_messages
 * Run with: node scripts/run-migration-017.mjs
 */

const SUPABASE_URL = "https://jtwlyexgptntdubxnnaw.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM4NDcxNCwiZXhwIjoyMDg2OTYwNzE0fQ.7N2XRif1EChlm1gbrB-ayf11Cp-9zrOR3JTREeORoSI";

const SQL = `
-- Step 1: Create table
CREATE TABLE IF NOT EXISTS conversation_messages (
  id         UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id  UUID                     NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id    UUID                     NOT NULL,
  role       TEXT                     NOT NULL CHECK (role IN ('user', 'assistant')),
  message    TEXT                     NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Indexes
CREATE INDEX IF NOT EXISTS idx_conv_messages_lead_id ON conversation_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_conv_messages_tenant  ON conversation_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conv_messages_created ON conversation_messages(lead_id, created_at DESC);

-- Step 3: RLS
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Step 4: Policy (service role full access)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'conversation_messages'
      AND policyname = 'Service role full access on conversation_messages'
  ) THEN
    CREATE POLICY "Service role full access on conversation_messages"
      ON conversation_messages FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;
`;

async function runMigration() {
  console.log("▶ Running migration 017_create_conversation_messages...\n");

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/run_sql`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql: SQL }),
  });

  if (res.ok) {
    console.log("✅ Migration applied successfully!");
    return;
  }

  // Fallback: try pg endpoint
  const res2 = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: SQL }),
  });

  if (res2.ok) {
    console.log("✅ Migration applied successfully!");
    return;
  }

  console.error("❌ Could not run migration automatically.");
  console.error(
    "\n📋 يرجى تنفيذ هذا SQL يدوياً في Supabase Dashboard → SQL Editor:\n"
  );
  console.log(SQL);
}

runMigration().catch(console.error);
