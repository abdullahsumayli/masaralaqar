-- ============================================
-- Migration 021: AI Listings — الإعلانات الذكية
-- ============================================

-- جدول الإعلانات التسويقية المُنشأة بالذكاء الاصطناعي
CREATE TABLE IF NOT EXISTS ai_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  office_id TEXT NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  marketing_description TEXT NOT NULL,
  bullet_features TEXT[] DEFAULT '{}',
  target_audience TEXT[] DEFAULT '{}',
  seo_keywords TEXT[] DEFAULT '{}',
  ad_copy_short TEXT DEFAULT '',
  image_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id)
);

-- فهارس
CREATE INDEX IF NOT EXISTS idx_ai_listings_office ON ai_listings(office_id);
CREATE INDEX IF NOT EXISTS idx_ai_listings_property ON ai_listings(property_id);

-- تحديث تلقائي لحقل updated_at
CREATE OR REPLACE FUNCTION update_ai_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ai_listings_updated ON ai_listings;
CREATE TRIGGER trg_ai_listings_updated
  BEFORE UPDATE ON ai_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_listings_updated_at();

-- RLS
ALTER TABLE ai_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_listings_all" ON ai_listings FOR ALL USING (true);
