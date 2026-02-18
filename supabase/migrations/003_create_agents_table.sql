-- جدول الوكلاء (Agents)
-- يحتوي على جميع بيانات الـ Onboarding

CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- معلومات المكتب
  office_name TEXT NOT NULL,
  office_logo_url TEXT,
  city TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  
  -- العقارات (JSONB لتخزين مصفوفة من العقارات)
  properties JSONB DEFAULT '[]'::jsonb,
  
  -- شخصية الوكيل
  agent_name TEXT,
  response_style TEXT CHECK (response_style IN ('formal', 'friendly')) DEFAULT 'friendly',
  welcome_message TEXT,
  
  -- Webhook
  webhook_url TEXT,
  webhook_secret TEXT,
  
  -- حالة الـ Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء Index للبحث السريع
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_city ON agents(city);
CREATE INDEX idx_agents_onboarding ON agents(onboarding_completed);

-- إنشاء Storage Bucket لشعارات المكاتب
INSERT INTO storage.buckets (id, name, public)
VALUES ('office-logos', 'office-logos', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات RLS للجدول
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- المستخدم يرى بياناته فقط
CREATE POLICY "Users can view own agent"
  ON agents FOR SELECT
  USING (auth.uid() = user_id);

-- المستخدم يقدر يضيف وكيل واحد فقط
CREATE POLICY "Users can insert own agent"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- المستخدم يقدر يعدل على بياناته
CREATE POLICY "Users can update own agent"
  ON agents FOR UPDATE
  USING (auth.uid() = user_id);

-- الـ Admin يشوف الكل
CREATE POLICY "Admins can view all agents"
  ON agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- الـ Admin يقدر يعدل على الكل
CREATE POLICY "Admins can update all agents"
  ON agents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Storage Policies لرفع الشعارات
CREATE POLICY "Users can upload own logo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'office-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own logo"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'office-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'office-logos');

-- Trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ملاحظة: لتشغيل هذا الكود:
-- 1. افتح Supabase Dashboard
-- 2. اذهب إلى SQL Editor
-- 3. الصق الكود واضغط Run
