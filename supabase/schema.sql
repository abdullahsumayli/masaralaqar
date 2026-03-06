-- إنشاء جدول المقالات
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

-- إنشاء جدول موارد المكتبة
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

-- تفعيل Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_resources ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة العامة للمقالات
CREATE POLICY "Public can read posts" ON blog_posts
  FOR SELECT USING (true);

-- سياسة القراءة العامة للموارد
CREATE POLICY "Public can read resources" ON library_resources
  FOR SELECT USING (true);

-- سياسة الكتابة العامة (للتطوير - قم بتغييرها لاحقاً للإنتاج)
CREATE POLICY "Allow all posts operations" ON blog_posts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all resources operations" ON library_resources
  FOR ALL USING (true) WITH CHECK (true);

-- إضافة مقالات افتراضية
INSERT INTO blog_posts (slug, title, excerpt, content, category, date, reading_time, published) VALUES
(
  'ai-in-real-estate-filtering',
  'كيف يعمل الذكاء الاصطناعي في تصفية عملاء العقار',
  'شرح مبسط لكيفية استخدام AI في فرز العملاء الجادين من المتصفحين وتوفير وقتك الثمين.',
  '# فهم الذكاء الاصطناعي في العقارات

الذكاء الاصطناعي يمكنه تحليل محادثات العملاء وتحديد مدى جديتهم بدقة عالية.

## ما هي تصفية العملاء بـ AI؟

هي عملية استخدام خوارزميات الذكاء الاصطناعي لتحليل:
- لغة العميل وطريقة تواصله
- الأسئلة التي يطرحها
- سرعة ردوده
- المعلومات التي يقدمها',
  'ذكاء اصطناعي',
  '1 فبراير 2026',
  6,
  true
),
(
  'complete-automation-guide-2026',
  'دليل الأتمتة الكامل للمكاتب العقارية السعودية 2026',
  'كل ما تحتاج معرفته عن أتمتة مكتبك العقاري: من الأدوات إلى الاستراتيجيات والنتائج المتوقعة.',
  '# مقدمة

الأتمتة لم تعد رفاهية، بل ضرورة للبقاء في المنافسة.

## ما هي الأتمتة العقارية؟

الأتمتة العقارية هي استخدام التقنية لتنفيذ المهام الروتينية تلقائياً.',
  'أتمتة',
  '5 فبراير 2026',
  8,
  true
),
(
  'losing-clients-due-to-late-response',
  'كيف يخسر مكتبك العقاري 60% من عملائه بسبب التأخر في الرد',
  'دراسة تكشف أن 60% من العملاء المحتملين يتحولون للمنافسين خلال ساعة واحدة من عدم الرد.',
  '# المشكلة الحقيقية

في عالم العقارات اليوم، السرعة هي كل شيء.

## لماذا يحدث هذا؟

العميل الذي يبحث عن عقار غالباً ما يتواصل مع عدة مكاتب في نفس الوقت.',
  'استراتيجية',
  '10 فبراير 2026',
  5,
  true
);

-- إضافة موارد افتراضية
INSERT INTO library_resources (title, description, type, category, download_url, published) VALUES
(
  'دليل الأتمتة الشامل للمكاتب العقارية',
  'كتاب إلكتروني يشرح كيفية أتمتة عمليات مكتبك العقاري من الألف إلى الياء',
  'book',
  'أتمتة',
  '#',
  true
),
(
  'قوالب ردود واتساب الجاهزة',
  '50+ قالب رد جاهز للتعامل مع استفسارات العملاء الأكثر شيوعاً',
  'template',
  'تواصل',
  '#',
  true
),
(
  'دورة الذكاء الاصطناعي للوسطاء العقاريين',
  'دورة مجانية تعلمك أساسيات استخدام AI في العمل العقاري',
  'course',
  'تعليم',
  '#',
  true
);
