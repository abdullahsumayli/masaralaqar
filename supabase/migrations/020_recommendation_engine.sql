-- ================================================================
-- Migration 020: Recommendation Engine — محرك التوصيات الذكي
-- ================================================================
-- Tables: property_knowledge, client_context, client_actions
-- ================================================================

-- ──────────────────────────────────────────────────────────────────
-- 1. Property Knowledge — المعرفة العقارية
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  family_score SMALLINT DEFAULT 0 CHECK (family_score BETWEEN 0 AND 100),
  investment_score SMALLINT DEFAULT 0 CHECK (investment_score BETWEEN 0 AND 100),
  luxury_score SMALLINT DEFAULT 0 CHECK (luxury_score BETWEEN 0 AND 100),
  location_summary TEXT DEFAULT '',
  advantages TEXT[] DEFAULT '{}',
  target_audience TEXT[] DEFAULT '{}',
  nearby_facilities TEXT[] DEFAULT '{}',
  ai_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(property_id)
);

CREATE INDEX IF NOT EXISTS idx_pk_property ON property_knowledge(property_id);
CREATE INDEX IF NOT EXISTS idx_pk_family ON property_knowledge(family_score DESC);
CREATE INDEX IF NOT EXISTS idx_pk_investment ON property_knowledge(investment_score DESC);

-- ──────────────────────────────────────────────────────────────────
-- 2. Client Context — ذاكرة العميل
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  preferred_city TEXT,
  preferred_property_type TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  bedrooms SMALLINT,
  preferred_area_min NUMERIC,
  preferred_area_max NUMERIC,
  lifestyle_tags TEXT[] DEFAULT '{}',
  conversation_summary TEXT DEFAULT '',
  interaction_count INT DEFAULT 0,
  last_interaction TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(office_id, phone_number)
);

CREATE INDEX IF NOT EXISTS idx_cc_office ON client_context(office_id);
CREATE INDEX IF NOT EXISTS idx_cc_phone ON client_context(phone_number);
CREATE INDEX IF NOT EXISTS idx_cc_office_phone ON client_context(office_id, phone_number);

-- ──────────────────────────────────────────────────────────────────
-- 3. Client Actions — سلوك العملاء
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id UUID NOT NULL,
  client_phone TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'interest', 'visit', 'reject', 'inquiry', 'recommendation_shown')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ca_office ON client_actions(office_id);
CREATE INDEX IF NOT EXISTS idx_ca_phone ON client_actions(client_phone);
CREATE INDEX IF NOT EXISTS idx_ca_property ON client_actions(property_id);
CREATE INDEX IF NOT EXISTS idx_ca_type ON client_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_ca_created ON client_actions(created_at DESC);

-- ──────────────────────────────────────────────────────────────────
-- 4. RLS Policies
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE property_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_knowledge_all" ON property_knowledge FOR ALL USING (true);
CREATE POLICY "client_context_all" ON client_context FOR ALL USING (true);
CREATE POLICY "client_actions_all" ON client_actions FOR ALL USING (true);

-- ──────────────────────────────────────────────────────────────────
-- 5. Auto-update timestamps
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pk_updated ON property_knowledge;
CREATE TRIGGER trg_pk_updated
  BEFORE UPDATE ON property_knowledge
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_cc_updated ON client_context;
CREATE TRIGGER trg_cc_updated
  BEFORE UPDATE ON client_context
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
