-- ============================================
-- Migration 022: Viewing Requests — طلبات المعاينة
-- ============================================

CREATE TYPE viewing_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS viewing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id TEXT NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_phone TEXT NOT NULL,
  client_name TEXT DEFAULT '',
  preferred_date TIMESTAMPTZ,
  status viewing_status DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- فهارس
CREATE INDEX IF NOT EXISTS idx_viewing_office ON viewing_requests(office_id);
CREATE INDEX IF NOT EXISTS idx_viewing_property ON viewing_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_viewing_phone ON viewing_requests(client_phone);
CREATE INDEX IF NOT EXISTS idx_viewing_status ON viewing_requests(status);

-- تحديث تلقائي
CREATE OR REPLACE FUNCTION update_viewing_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_viewing_updated ON viewing_requests;
CREATE TRIGGER trg_viewing_updated
  BEFORE UPDATE ON viewing_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_viewing_requests_updated_at();

-- RLS
ALTER TABLE viewing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "viewing_requests_all" ON viewing_requests FOR ALL USING (true);
