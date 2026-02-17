'use client'

import { use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Calendar, Share2, Tag } from 'lucide-react'
import { BlogCard } from '@/components/blog-card'

// Mock blog data (in production, this would come from MDX files or a CMS)
const blogPosts: Record<string, {
  title: string
  category: string
  date: string
  readingTime: number
  content: string
}> = {
  'losing-clients-due-to-late-response': {
    title: 'كيف يخسر مكتبك العقاري 60% من عملائه بسبب التأخر في الرد',
    category: 'استراتيجية',
    date: '10 فبراير 2026',
    readingTime: 5,
    content: `
## المشكلة الحقيقية

في عالم العقارات اليوم، السرعة هي كل شيء. الدراسات تُظهر أن **60% من العملاء المحتملين** يتحولون للمنافسين إذا لم يحصلوا على رد خلال ساعة واحدة فقط.

## لماذا يحدث هذا؟

العميل الذي يبحث عن عقار غالباً ما يتواصل مع عدة مكاتب في نفس الوقت. المكتب الذي يرد أولاً يحصل على الأفضلية.

### الأسباب الرئيسية للتأخر:

1. **انشغال الموظفين** بالمعاينات والمهام الأخرى
2. **ساعات العمل المحدودة** - العملاء يتواصلون في الليل وعطلة نهاية الأسبوع
3. **عدم وجود نظام** لتوزيع الاستفسارات

## الحل: الأتمتة الذكية

باستخدام نظام رد آلي ذكي مثل **نظام صقر**، يمكنك:

- الرد على العملاء فوراً، 24 ساعة في اليوم
- جمع معلومات العميل الأساسية تلقائياً
- تصفية العملاء الجادين من المتصفحين
- جدولة المعاينات بدون تدخل بشري

## النتائج المتوقعة

المكاتب التي تستخدم الأتمتة الذكية تشهد:

- **زيادة 3x** في معدل التحويل
- **تقليل 60%** في الجهد اليدوي
- **صفر فرص ضائعة** بسبب التأخر

## الخطوة التالية

لا تدع عملاءك يذهبون للمنافسين. ابدأ اليوم بتجربة نظام صقر مجاناً واكتشف الفرق.
    `,
  },
  'complete-automation-guide-2026': {
    title: 'دليل الأتمتة الكامل للمكاتب العقارية السعودية 2026',
    category: 'أتمتة',
    date: '5 فبراير 2026',
    readingTime: 8,
    content: `
## مقدمة

الأتمتة لم تعد رفاهية، بل ضرورة للبقاء في المنافسة. في هذا الدليل الشامل، سنستعرض كل ما تحتاج معرفته.

## ما هي الأتمتة العقارية؟

الأتمتة العقارية هي استخدام التقنية لتنفيذ المهام الروتينية تلقائياً، مما يوفر وقتك للتركيز على إغلاق الصفقات.

## المجالات الرئيسية للأتمتة

### 1. الرد على الاستفسارات
- ردود فورية على واتساب
- تصفية العملاء تلقائياً
- جمع البيانات الأساسية

### 2. متابعة العملاء
- رسائل متابعة مجدولة
- تذكيرات بالمواعيد
- تحديثات على العروض الجديدة

### 3. إدارة العقارات
- تحديث البيانات تلقائياً
- مزامنة مع منصات الإعلان
- تقارير دورية

## أدوات الأتمتة الموصى بها

| الأداة | الاستخدام | التكلفة |
|--------|----------|---------|
| نظام صقر | الرد الآلي | متغيرة |
| منصة إغلاق | المتابعة | متغيرة |
| Zapier | الربط | مجاني/مدفوع |

## خطوات البدء

1. **حدد المهام المتكررة** في مكتبك
2. **اختر الأداة المناسبة** لكل مهمة
3. **ابدأ بمهمة واحدة** واتقنها
4. **وسّع تدريجياً** لتشمل مهام أخرى

## الخلاصة

الأتمتة ستوفر لك ساعات كل يوم وتضاعف إنتاجيتك. ابدأ اليوم!
    `,
  },
  'ai-in-real-estate-filtering': {
    title: 'كيف يعمل الذكاء الاصطناعي في تصفية عملاء العقار',
    category: 'ذكاء اصطناعي',
    date: '1 فبراير 2026',
    readingTime: 6,
    content: `
## فهم الذكاء الاصطناعي في العقارات

الذكاء الاصطناعي يمكنه تحليل محادثات العملاء وتحديد مدى جديتهم بدقة عالية.

## كيف يعمل؟

### 1. تحليل اللغة الطبيعية (NLP)
يفهم النظام ما يقوله العميل ويستخرج المعلومات المهمة:
- الميزانية المتوقعة
- نوع العقار المطلوب
- الموقع المفضل
- مدى الاستعجال

### 2. تقييم الجدية
بناءً على إجابات العميل، يُعطي النظام درجة جدية:
- **عالية**: العميل جاهز للشراء
- **متوسطة**: يحتاج متابعة
- **منخفضة**: متصفح فقط

### 3. التوجيه الذكي
- العملاء الجادون → تحويل فوري للوسيط
- العملاء المحتملون → متابعة آلية
- المتصفحون → محتوى تعليمي

## فوائد التصفية الذكية

- **توفير 80%** من وقت الموظفين
- **زيادة معدل الإغلاق** بالتركيز على الجادين
- **تجربة أفضل للعميل** برد سريع ومناسب

## تطبيق عملي

نظام صقر يستخدم هذه التقنيات لتصفية العملاء تلقائياً. جربه اليوم!
    `,
  },
}

const relatedPosts = [
  {
    slug: 'whatsapp-automation-secrets',
    title: 'أسرار أتمتة واتساب للمكاتب العقارية',
    excerpt: 'كيف تجعل واتساب يعمل لصالحك 24 ساعة.',
    category: 'أتمتة',
    date: '28 يناير 2026',
    readingTime: 7,
  },
  {
    slug: 'proptech-trends-saudi-2026',
    title: 'اتجاهات التقنية العقارية في السعودية 2026',
    excerpt: 'نظرة على مستقبل السوق العقاري السعودي.',
    category: 'تقنية عقارية',
    date: '25 يناير 2026',
    readingTime: 10,
  },
]

// Table of Contents items (extracted from content)
const tableOfContents = [
  { id: 'intro', label: 'المقدمة' },
  { id: 'problem', label: 'المشكلة' },
  { id: 'solution', label: 'الحل' },
  { id: 'results', label: 'النتائج' },
]

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-cairo font-bold text-text-primary mb-4">
            المقال غير موجود
          </h1>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            العودة للمدونة
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article className="container-custom">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمدونة
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Main Content */}
          <div>
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Category Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-4">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-cairo font-bold text-text-primary mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} دقائق قراءة</span>
                </div>
                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة</span>
                </button>
              </div>
            </motion.header>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg max-w-none"
            >
              {/* Render markdown content */}
              <div
                className="text-text-secondary leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-cairo font-bold text-text-primary mt-8 mb-4">$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-cairo font-bold text-text-primary mt-6 mb-3">$1</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
                    .replace(/^- (.+)$/gm, '<li class="mr-4 mb-2 list-disc list-inside">$1</li>')
                    .replace(/^(\d+)\. (.+)$/gm, '<li class="mr-4 mb-2 list-decimal list-inside">$2</li>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                }}
              />
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <p className="text-text-secondary mb-4">شارك هذا المقال:</p>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              {/* Table of Contents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface border border-border rounded-2xl p-6 mb-6"
              >
                <h3 className="font-cairo font-bold text-text-primary mb-4">
                  محتويات المقال
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-text-secondary hover:text-primary transition-colors text-sm py-1"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6"
              >
                <h3 className="font-cairo font-bold text-text-primary mb-2">
                  جرّب نظام صقر
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  ابدأ بالرد الآلي الذكي اليوم
                </p>
                <Link href="/products/saqr" className="btn-primary text-sm w-full justify-center">
                  ابدأ مجاناً
                </Link>
              </motion.div>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-16 border-t border-border"
        >
          <h2 className="text-2xl font-cairo font-bold text-text-primary mb-8">
            مقالات ذات صلة
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </motion.section>
      </article>
    </div>
  )
}
