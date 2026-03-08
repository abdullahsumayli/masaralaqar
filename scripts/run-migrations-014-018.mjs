/**
 * Migration Runner: 014 → 018
 * Run with: node scripts/run-migrations-014-018.mjs
 */

const SUPABASE_URL = "https://jtwlyexgptntdubxnnaw.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ0.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0d2x5ZXhncHRudGR1YnhubmF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM4NDcxNCwiZXhwIjoyMDg2OTYwNzE0fQ.7N2XRif1EChlm1gbrB-ayf11Cp-9zrOR3JTREeORoSI";

const MIGRATIONS = [
  {
    name: "014_add_lead_conversation_fields",
    sql: `
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS conversation_history JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS location_interest TEXT,
  ADD COLUMN IF NOT EXISTS budget NUMERIC,
  ADD COLUMN IF NOT EXISTS property_type_interest TEXT,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_leads_last_contacted ON leads(last_contacted_at DESC);
    `,
  },
  {
    name: "015_add_trials_support_media_tables",
    sql: `
CREATE TABLE IF NOT EXISTS trial_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  city TEXT,
  employees TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  client TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'pending', 'closed')),
  category TEXT DEFAULT 'general' CHECK (category IN ('technical', 'billing', 'account', 'general')),
  message_count INT DEFAULT 0,
  last_reply_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size INT NOT NULL,
  type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trial_requests_status ON trial_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);

ALTER TABLE trial_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='trial_requests' AND policyname='Anyone can submit trial request') THEN
    CREATE POLICY "Anyone can submit trial request" ON trial_requests FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='trial_requests' AND policyname='Admins manage trial requests') THEN
    CREATE POLICY "Admins manage trial requests" ON trial_requests FOR ALL
      USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='support_tickets' AND policyname='Admins manage support tickets') THEN
    CREATE POLICY "Admins manage support tickets" ON support_tickets FOR ALL
      USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='media_files' AND policyname='Admins manage media files') THEN
    CREATE POLICY "Admins manage media files" ON media_files FOR ALL
      USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
  END IF;
END $$;
    `,
  },
  {
    name: "017_create_conversation_messages",
    sql: `
CREATE TABLE IF NOT EXISTS conversation_messages (
  id         UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id  UUID                     NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id    UUID                     NOT NULL,
  role       TEXT                     NOT NULL CHECK (role IN ('user', 'assistant')),
  message    TEXT                     NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conv_messages_lead_id ON conversation_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_conv_messages_tenant  ON conversation_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conv_messages_created ON conversation_messages(lead_id, created_at DESC);

ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversation_messages' AND policyname='Service role full access on conversation_messages') THEN
    CREATE POLICY "Service role full access on conversation_messages"
      ON conversation_messages FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
    `,
  },
  {
    name: "018_add_district_license_to_properties",
    sql: `
ALTER TABLE properties ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS license_number VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
    `,
  },
];

async function runSQL(sql, name) {
  // Try Supabase Management API (pg endpoint)
  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1];

  const endpoints = [
    {
      url: `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      body: JSON.stringify({ query: sql }),
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    },
    {
      url: `${SUPABASE_URL}/rest/v1/rpc/run_sql`,
      body: JSON.stringify({ sql }),
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint.url, {
        method: "POST",
        headers: endpoint.headers,
        body: endpoint.body,
      });

      if (res.ok) return { ok: true };

      const text = await res.text();
      // If it's a "column already exists" or "already exists" error, treat as success
      if (text.includes("already exists")) return { ok: true };
    } catch {
      // try next endpoint
    }
  }

  return { ok: false };
}

async function main() {
  console.log("🚀 تشغيل المهاجرات 014 → 018\n");

  // Skip 016 (seed data — optional, run manually if needed)
  for (const migration of MIGRATIONS) {
    process.stdout.write(`  ▶ ${migration.name} ... `);
    const result = await runSQL(migration.sql, migration.name);
    if (result.ok) {
      console.log("✅");
    } else {
      console.log("❌ فشل");
      console.log("\n⚠️  شغّل هذا SQL يدوياً في Supabase Dashboard → SQL Editor:");
      console.log("─".repeat(60));
      console.log(migration.sql);
      console.log("─".repeat(60) + "\n");
    }
  }

  console.log("\n✨ انتهى. تحقق من Supabase Dashboard للتأكد من وجود الجداول.");
  console.log("   ⚠️  Migration 016 (بيانات تجريبية) — شغّلها يدوياً إن أردت.");
}

main().catch(console.error);
