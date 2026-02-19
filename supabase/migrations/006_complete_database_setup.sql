-- =====================================================
-- ملف ترحيل قاعدة البيانات الكامل
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. جدول المستخدمين (إذا لم يكن موجوداً)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. جدول العملاء المحتملين (Leads)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT CHECK (status IN ('new', 'contacted', 'trial_started', 'converted', 'lost')) DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. جدول المقالات
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  date TEXT,
  reading_time INTEGER DEFAULT 5,
  image TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. جدول موارد المكتبة
-- =====================================================
CREATE TABLE IF NOT EXISTS library_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('book', 'course', 'template', 'tool')),
  category TEXT,
  download_url TEXT,
  external_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. جدول المشتركين في النشرة
-- =====================================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- إنشاء الـ Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- =====================================================
-- تفعيل Row Level Security
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- سياسات جدول leads
-- =====================================================

-- أي شخص يمكنه الإضافة
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT WITH CHECK (true);

-- الجميع يمكن القراءة
CREATE POLICY "Public can read leads"
  ON leads FOR SELECT USING (true);

-- =====================================================
-- سياسات جدول subscribers
-- =====================================================
CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read subscribers"
  ON subscribers FOR SELECT USING (true);

-- =====================================================
-- سياسات جدول blog_posts
-- =====================================================
CREATE POLICY "Public can read posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Allow all posts operations" ON blog_posts
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- سياسات جدول library_resources
-- =====================================================
CREATE POLICY "Public can read resources" ON library_resources
  FOR SELECT USING (published = true);

CREATE POLICY "Allow all resources operations" ON library_resources
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- Trigger لتحديث updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_timestamp
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_posts_timestamp
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_resources_timestamp
  BEFORE UPDATE ON library_resources
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- بيانات افتراضية
-- =====================================================
INSERT INTO blog_posts (slug, title, excerpt, content, category, date, reading_time, published) VALUES
(
  'ai-in-real-estate-filtering',
  'كيف يغير الذكاء الاصطناعي قطاع العقارات؟',
  'نظرة شاملة على تأثير التقنيات الحديثة في سوق العقار السعودي.',
  '# مقدمة\n\nالذكاء الاصطناعي يحدث ثورة في القطاع العقاري...',
  'ذكاء اصطناعي',
  '15 فبراير 2026',
  6,
  true
),
(
  'real-estate-marketing-strategies',
  'أفضل استراتيجيات التسويق العقاري',
  'تعرف على أحدث طرق التسويق العقاري الفعالة في السوق السعودي.',
  '# مقدمة\n\nالتسويق العقاري يتطلب استراتيجية محكمة...',
  'تسويق',
  '12 فبراير 2026',
  5,
  true
),
(
  'beginner-broker-guide',
  'دليل الوسيط العقاري المبتدئ',
  'كل ما تحتاج معرفته لبدء مسيرتك في الوساطة العقارية.',
  '# مقدمة\n\nالوساطة العقارية من أكثر المهند ربحية...',
  'نصائح',
  '10 فبراير 2026',
  7,
  true
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO library_resources (title, description, type, category, download_url, published) VALUES
(
  'دليل الأتمتة الشامل للمكاتب العقارية',
  'كتاب إلكتروني يشرح كيفية أك العقاري',
  'book',
تمتة عمليات مكتب  'أتمتة',
  '/downloads/automation-guide.pdf',
  true
),
(
  'قوالب ردود واتساب الجاهزة',
  '50+ قالب رد جاهز للتعامل مع استفسارات العملاء',
  'template',
  'تواصل',
  '/downloads/whatsapp-replies.pdf',
  true
),
(
  'دورة الذكاء الاصطناعي للوسطاء العقاريين',
  'دورة مجانية تعلمك أساسيات استخدام AI في العمل العقاري',
  'course',
  'تعليم',
  '/courses/ai-course',
  true
)
ON CONFLICT DO NOTHING;
