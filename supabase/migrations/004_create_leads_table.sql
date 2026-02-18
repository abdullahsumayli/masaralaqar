-- جدول العملاء المحتملين (Leads)
-- يحتوي على بيانات الأشخاص المسجلين للتجربة المجانية

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  status TEXT CHECK (status IN ('new', 'contacted', 'trial_started', 'converted', 'lost')) DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء Index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- سياسات RLS للجدول
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- السماح بالإضافة من أي شخص (للتسجيل من الموقع)
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- الـ Admin فقط يشوف الـ Leads
CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- الـ Admin يقدر يعدل على الـ Leads
CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_timestamp
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- ملاحظة: لتشغيل هذا الكود:
-- 1. افتح Supabase Dashboard
-- 2. اذهب إلى SQL Editor
-- 3. الصق الكود واضغط Run
