-- ============================================================
-- Migration 019: Full Multi-Tenant SaaS Architecture
-- مسار العقار - بنية SaaS متعددة المستأجرين
-- ============================================================

-- ================================================
-- 1. offices — المكاتب العقارية (الكيان الأساسي)
-- ================================================
CREATE TABLE IF NOT EXISTS offices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  plan_id UUID,
  legacy_tenant_id UUID, -- backward compat with tenants table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offices_email ON offices(email);
CREATE INDEX IF NOT EXISTS idx_offices_phone ON offices(phone);
CREATE INDEX IF NOT EXISTS idx_offices_city ON offices(city);
CREATE INDEX IF NOT EXISTS idx_offices_plan ON offices(plan_id);

ALTER TABLE offices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offices_service_role" ON offices FOR ALL
  USING (true) WITH CHECK (true);

-- ================================================
-- 2. ai_agents — وكلاء الذكاء الاصطناعي
-- ================================================
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  agent_name VARCHAR(255) DEFAULT 'مساعد عقاري',
  greeting_message TEXT DEFAULT 'مرحباً بك! كيف يمكنني مساعدتك في البحث عن العقار المناسب؟',
  office_description TEXT DEFAULT '',
  tone VARCHAR(50) DEFAULT 'professional' CHECK (tone IN ('professional', 'friendly', 'formal', 'casual')),
  language VARCHAR(20) DEFAULT 'ar' CHECK (language IN ('ar', 'en', 'both')),
  working_hours JSONB DEFAULT '{"start": "08:00", "end": "22:00", "days": ["sun","mon","tue","wed","thu"]}',
  custom_instructions TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_agents_office_unique ON ai_agents(office_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_office_id ON ai_agents(office_id);

ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_agents_service_role" ON ai_agents FOR ALL
  USING (true) WITH CHECK (true);

-- ================================================
-- 3. whatsapp_sessions — جلسات الواتساب
-- ================================================
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  session_status VARCHAR(20) DEFAULT 'disconnected'
    CHECK (session_status IN ('connected', 'disconnected', 'pending', 'expired')),
  instance_id VARCHAR(100),
  api_token VARCHAR(255),
  webhook_url TEXT,
  last_connected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_sessions_phone ON whatsapp_sessions(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_office ON whatsapp_sessions(office_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_status ON whatsapp_sessions(session_status);

ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_sessions_service_role" ON whatsapp_sessions FOR ALL
  USING (true) WITH CHECK (true);

-- ================================================
-- 4. plans — باقات الاشتراك
-- ================================================
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  name_ar VARCHAR(100),
  max_properties INTEGER DEFAULT 10,
  max_ai_messages INTEGER DEFAULT 100,
  max_whatsapp_messages INTEGER DEFAULT 500,
  price DECIMAL(10,2) DEFAULT 0,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_read_all" ON plans FOR SELECT USING (true);
CREATE POLICY "plans_admin_write" ON plans FOR ALL USING (true) WITH CHECK (true);

-- ================================================
-- 5. subscriptions — اشتراكات المكاتب
-- ================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'cancelled', 'trial', 'suspended')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  ai_messages_used INTEGER DEFAULT 0,
  whatsapp_messages_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_office ON subscriptions(office_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_service_role" ON subscriptions FOR ALL
  USING (true) WITH CHECK (true);

-- ================================================
-- 6. Add office_id to existing tables
-- ================================================
ALTER TABLE properties ADD COLUMN IF NOT EXISTS office_id UUID REFERENCES offices(id) ON DELETE CASCADE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS office_id UUID REFERENCES offices(id) ON DELETE CASCADE;

-- Link users to offices
ALTER TABLE users ADD COLUMN IF NOT EXISTS office_id UUID REFERENCES offices(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_properties_office_id ON properties(office_id);
CREATE INDEX IF NOT EXISTS idx_leads_office_id ON leads(office_id);
CREATE INDEX IF NOT EXISTS idx_users_office_id ON users(office_id);

-- ================================================
-- 7. Add FK from offices.plan_id -> plans.id (deferred)
-- ================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'offices_plan_id_fkey'
  ) THEN
    ALTER TABLE offices ADD CONSTRAINT offices_plan_id_fkey
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ================================================
-- 8. Seed default plans
-- ================================================
INSERT INTO plans (name, name_ar, max_properties, max_ai_messages, max_whatsapp_messages, price, sort_order, features) VALUES
  ('free',       'مجانية',   5,    50,    100,   0,      0, '["5 عقارات", "50 رسالة ذكاء اصطناعي", "100 رسالة واتساب"]'::jsonb),
  ('basic',      'أساسية',  50,   500,   2000,  299,    1, '["50 عقار", "500 رسالة ذكاء اصطناعي", "2000 رسالة واتساب", "تقارير أساسية"]'::jsonb),
  ('pro',        'احترافية', 200,  2000,  10000, 799,    2, '["200 عقار", "2000 رسالة ذكاء اصطناعي", "10000 رسالة واتساب", "تقارير متقدمة", "أولوية الدعم"]'::jsonb),
  ('enterprise', 'مؤسسية',  -1,   -1,    -1,    1999,   3, '["عقارات غير محدودة", "رسائل غير محدودة", "دعم مخصص", "API خاص"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ================================================
-- 9. Auto-create AI Agent on new office
-- ================================================
CREATE OR REPLACE FUNCTION create_default_ai_agent()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ai_agents (office_id, agent_name, greeting_message, office_description)
  VALUES (
    NEW.id,
    'مساعد ' || NEW.office_name,
    'مرحباً بك في ' || NEW.office_name || '! كيف يمكنني مساعدتك؟',
    ''
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_ai_agent ON offices;
CREATE TRIGGER trigger_create_ai_agent
  AFTER INSERT ON offices
  FOR EACH ROW
  EXECUTE FUNCTION create_default_ai_agent();

-- ================================================
-- 10. Auto-assign free plan on new office
-- ================================================
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  SELECT id INTO free_plan_id FROM plans WHERE name = 'free' LIMIT 1;
  IF free_plan_id IS NOT NULL THEN
    UPDATE offices SET plan_id = free_plan_id WHERE id = NEW.id;
    INSERT INTO subscriptions (office_id, plan_id, status, start_date, end_date)
    VALUES (NEW.id, free_plan_id, 'trial', NOW(), NOW() + INTERVAL '14 days');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_subscription ON offices;
CREATE TRIGGER trigger_create_subscription
  AFTER INSERT ON offices
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- ================================================
-- 11. Usage tracking — تتبع الاستخدام
-- ================================================
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('ai_message', 'whatsapp_message', 'property_created')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_office ON usage_logs(office_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_type ON usage_logs(type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON usage_logs(created_at);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_service_role" ON usage_logs FOR ALL
  USING (true) WITH CHECK (true);

-- ================================================
-- 12. Verification
-- ================================================
SELECT 'offices' as table_name, count(*) as count FROM offices
UNION ALL
SELECT 'ai_agents', count(*) FROM ai_agents
UNION ALL
SELECT 'whatsapp_sessions', count(*) FROM whatsapp_sessions
UNION ALL
SELECT 'plans', count(*) FROM plans
UNION ALL
SELECT 'subscriptions', count(*) FROM subscriptions
UNION ALL
SELECT 'usage_logs', count(*) FROM usage_logs;
