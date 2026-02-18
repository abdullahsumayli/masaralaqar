'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Calendar, Share2, Tag, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/supabase'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readingTime: number
  reading_time?: number
  image?: string
  published?: boolean
}

const defaultPosts: Record<string, BlogPost> = {
  'ai-in-real-estate-filtering': {
    slug: 'ai-in-real-estate-filtering',
    title: 'كيف يعمل الذكاء الاصطناعي في تصفية عملاء العقار',
    excerpt: 'شرح مبسط لكيفية استخدام AI في فرز العملاء الجادين من المتصفحين وتوفير وقتك الثمين.',
    category: 'ذكاء اصطناعي',
    date: '1 فبراير 2026',
    readingTime: 6,
    content: `# فهم الذكاء الاصطناعي في العقارات

الذكاء الاصطناعي يمكنه تحليل محادثات العملاء وتحديد مدى جديتهم بدقة عالية.

## ما هي تصفية العملاء بـ AI؟

هي عملية استخدام خوارزميات الذكاء الاصطناعي لتحليل:
- لغة العميل وطريقة تواصله
- الأسئلة التي يطرحها
- سرعة ردوده
- المعلومات التي يقدمها

والهدف: **تحديد من هو الجاد للشراء ومن هو مجرد متصفح.**

## كيف يعمل؟

### 1. تحليل اللغة الطبيعية (NLP)

يفهم النظام ما يقوله العميل ويستخرج المعلومات المهمة:

- **الميزانية المتوقعة**: "أبحث عن شقة بحدود 800 ألف"
- **نوع العقار المطلوب**: "فيلا، شقة، أرض"
- **الموقع المفضل**: "شمال الرياض، حي النرجس"
- **مدى الاستعجال**: "أريد الانتقال خلال شهر"

### 2. تقييم الجدية

بناءً على إجابات العميل، يُعطي النظام درجة جدية من 0 إلى 100.

### 3. التوجيه الذكي

بعد التقييم، يتم توجيه كل عميل للمسار المناسب:

- **العملاء الجادون** ← تحويل فوري للوسيط مع ملخص المحادثة
- **العملاء المحتملون** ← سلسلة متابعة آلية لإنضاجهم
- **المتصفحون** ← محتوى تعليمي وتوعوي

## الفوائد لمكتبك العقاري

1. **توفير الوقت**: لا تضيع وقتك مع العملاء غير الجادين
2. **زيادة المبيعات**: تركيز جهودك على العملاء الواعدين
3. **تحسين تجربة العميل**: ردود سريعة ومخصصة
4. **بيانات قيمة**: فهم أعمق لاحتياجات السوق`
  },
  'complete-automation-guide-2026': {
    slug: 'complete-automation-guide-2026',
    title: 'دليل الأتمتة الكامل للمكاتب العقارية السعودية 2026',
    excerpt: 'كل ما تحتاج معرفته عن أتمتة مكتبك العقاري: من الأدوات إلى الاستراتيجيات والنتائج المتوقعة.',
    category: 'أتمتة',
    date: '5 فبراير 2026',
    readingTime: 8,
    content: `# مقدمة

الأتمتة لم تعد رفاهية، بل ضرورة للبقاء في المنافسة. في هذا الدليل الشامل، سنستعرض كل ما تحتاج معرفته.

## ما هي الأتمتة العقارية؟

الأتمتة العقارية هي استخدام التقنية لتنفيذ المهام الروتينية تلقائياً، مما يوفر وقتك للتركيز على إغلاق الصفقات.

### لماذا الأتمتة مهمة الآن؟

- المنافسة تزداد شراسة
- توقعات العملاء ترتفع
- التكلفة البشرية في ارتفاع
- التقنية أصبحت أسهل وأرخص

## المجالات الرئيسية للأتمتة

### 1. الرد على الاستفسارات

- ردود فورية على واتساب
- تصفية العملاء تلقائياً
- جمع المعلومات الأساسية

### 2. جدولة المعاينات

- حجز المواعيد أونلاين
- تذكيرات تلقائية
- إعادة الجدولة بسهولة

### 3. متابعة العملاء

- سلاسل رسائل مجدولة
- تنبيهات للوسيط عند الحاجة
- تقارير دورية

## خطوات البدء

1. **حدد العمليات المتكررة** في مكتبك
2. **اختر الأدوات المناسبة** لحجم عملك
3. **ابدأ بعملية واحدة** ثم توسع تدريجياً
4. **قس النتائج** وحسّن باستمرار`
  },
  'losing-clients-due-to-late-response': {
    slug: 'losing-clients-due-to-late-response',
    title: 'كيف يخسر مكتبك العقاري 60% من عملائه بسبب التأخر في الرد',
    excerpt: 'دراسة تكشف أن 60% من العملاء المحتملين يتحولون للمنافسين خلال ساعة واحدة من عدم الرد.',
    category: 'استراتيجية',
    date: '10 فبراير 2026',
    readingTime: 5,
    content: `# المشكلة الحقيقية

في عالم العقارات اليوم، السرعة هي كل شيء. الدراسات تُظهر أن **60% من العملاء المحتملين** يتحولون للمنافسين إذا لم يحصلوا على رد خلال ساعة واحدة فقط.

## لماذا يحدث هذا؟

العميل الذي يبحث عن عقار غالباً ما يتواصل مع عدة مكاتب في نفس الوقت. المكتب الذي يرد أولاً يحصل على الأفضلية.

### الأسباب الرئيسية للتأخر

1. **انشغال الموظفين** بالمعاينات والمهام الأخرى
2. **ساعات العمل المحدودة** - العملاء يتواصلون في الليل وعطلة نهاية الأسبوع
3. **عدم وجود نظام** لتوزيع الاستفسارات

> العميل الذي يريد الشراء اليوم لن ينتظرك للغد

## الحل: الأتمتة الذكية

باستخدام نظام رد آلي ذكي مثل **نظام صقر**، يمكنك:

- الرد على العملاء فوراً، 24 ساعة في اليوم
- تصفية العملاء الجادين تلقائياً
- تحويل العملاء المؤهلين للوسيط المناسب
- متابعة العملاء المحتملين بشكل آلي

## النتائج المتوقعة

- **زيادة 40%** في معدل التحويل
- **توفير 80%** من وقت الرد على الاستفسارات
- **رضا أعلى** للعملاء
- **مبيعات أكثر** بنفس الجهد`
  },
  'whatsapp-automation-tips': {
    slug: 'whatsapp-automation-tips',
    title: '7 نصائح ذهبية لأتمتة واتساب في مكتبك العقاري',
    excerpt: 'اكتشف أفضل الممارسات لاستخدام الواتساب الآلي في التواصل مع العملاء وزيادة المبيعات.',
    category: 'أتمتة',
    date: '12 فبراير 2026',
    readingTime: 7,
    content: `# مقدمة

واتساب أصبح القناة الأولى للتواصل مع العملاء في السوق العقاري السعودي. إليك 7 نصائح لأتمتته بشكل فعال.

## 1. الرد الفوري الذكي

لا تستخدم ردوداً آلية مملة. اجعل الرد الأول شخصياً ومفيداً.

## 2. اسأل الأسئلة الصحيحة

- ما نوع العقار الذي تبحث عنه؟
- ما المنطقة المفضلة؟
- ما الميزانية المتوقعة؟
- ما الإطار الزمني للشراء؟

## 3. استخدم الأزرار التفاعلية

اجعل التفاعل سهلاً بأزرار واضحة للاختيار.

## 4. أرسل محتوى قيم

- صور عالية الجودة
- فيديوهات للعقارات
- معلومات عن الأحياء

## 5. تابع بذكاء

- لا ترسل رسائل كثيرة
- اختر التوقيت المناسب
- قدم قيمة في كل رسالة

## 6. حوّل للوسيط في الوقت المناسب

عندما يصبح العميل جاهزاً، حوّله فوراً للوسيط.

## 7. قس وحسّن

تابع الإحصائيات وحسّن باستمرار.`
  },
  'real-estate-tech-trends-2026': {
    slug: 'real-estate-tech-trends-2026',
    title: 'أهم 10 تقنيات عقارية ستغير السوق السعودي في 2026',
    excerpt: 'نظرة شاملة على التقنيات الحديثة التي ستشكل مستقبل السوق العقاري السعودي.',
    category: 'تقنية عقارية',
    date: '14 فبراير 2026',
    readingTime: 10,
    content: `# مستقبل التقنية العقارية

السوق العقاري السعودي يشهد تحولاً رقمياً غير مسبوق. إليك أهم التقنيات التي ستغير قواعد اللعبة.

## 1. الذكاء الاصطناعي للمحادثات

روبوتات دردشة ذكية ترد على العملاء وتؤهلهم تلقائياً.

## 2. الواقع الافتراضي (VR)

جولات افتراضية للعقارات من أي مكان في العالم.

## 3. الواقع المعزز (AR)

تخيل العقار بأثاثك قبل الشراء.

## 4. التحليلات التنبؤية

توقع أسعار العقارات وأفضل وقت للبيع أو الشراء.

## 5. البلوك تشين

عقود ذكية وتحويل ملكية بأمان وسرعة.

## 6. إنترنت الأشياء (IoT)

منازل ذكية ترفع قيمة العقار.

## 7. الدرونز

تصوير جوي احترافي للعقارات.

## 8. التوقيع الإلكتروني

إتمام الصفقات بدون ورق.

## 9. CRM الذكي

إدارة علاقات العملاء بالذكاء الاصطناعي.

## 10. التسويق الآلي

حملات تسويقية مستهدفة ومؤتمتة.`
  },
  'lead-qualification-strategies': {
    slug: 'lead-qualification-strategies',
    title: 'استراتيجيات تأهيل العملاء المحتملين في 5 دقائق',
    excerpt: 'تعلم كيف تحدد العملاء الجادين بسرعة وتوفر وقتك للصفقات الحقيقية.',
    category: 'مبيعات',
    date: '16 فبراير 2026',
    readingTime: 6,
    content: `# فن تأهيل العملاء

ليس كل من يسأل عن عقار هو عميل محتمل. تعلم كيف تميز الجاد من المتصفح.

## معايير التأهيل الأساسية (BANT)

### Budget - الميزانية
هل لديه القدرة المالية؟

### Authority - الصلاحية
هل هو صاحب القرار؟

### Need - الحاجة
هل لديه حاجة حقيقية؟

### Timeline - التوقيت
متى يريد الشراء؟

## الأسئلة الذهبية

1. ما الذي دفعك للتفكير في العقار الآن؟
2. هل زرت عقارات مشابهة؟
3. ما أهم 3 معايير لك؟
4. متى تريد الانتقال؟
5. هل تحتاج تمويل؟

## علامات العميل الجاد

- يطرح أسئلة تفصيلية
- متجاوب وسريع الرد
- لديه ميزانية واضحة
- يطلب معاينة

## علامات المتصفح

- أسئلة عامة فقط
- لا يحدد ميزانية
- غير متجاوب
- يؤجل المواعيد`
  }
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        // Try Supabase first
        const supabasePost = await getBlogPostBySlug(slug)
        
        if (supabasePost) {
          const mappedPost = {
            ...supabasePost,
            readingTime: supabasePost.reading_time || 5,
          }
          setPost(mappedPost)
          
          // Get related posts from Supabase
          const allPosts = await getAllBlogPosts(true)
          const related = allPosts
            .filter((p: any) => p.category === supabasePost.category && p.slug !== slug)
            .slice(0, 3)
            .map((p: any) => ({ ...p, readingTime: p.reading_time || 5 }))
          setRelatedPosts(related)
        } else {
          // Fallback to localStorage then defaults
          let foundPost: BlogPost | null = null
          let allPosts: BlogPost[] = Object.values(defaultPosts)
          
          const savedPosts = localStorage.getItem('blogPosts')
          if (savedPosts) {
            try {
              const adminPosts: BlogPost[] = JSON.parse(savedPosts)
              const publishedAdminPosts = adminPosts.filter(p => p.published)
              const adminSlugs = publishedAdminPosts.map(p => p.slug)
              const defaultsNotInAdmin = Object.values(defaultPosts).filter(p => !adminSlugs.includes(p.slug))
              allPosts = [...publishedAdminPosts, ...defaultsNotInAdmin]
              foundPost = adminPosts.find(p => p.slug === slug && p.published) || null
            } catch (e) {
              console.error('Error loading posts:', e)
            }
          }
          
          if (!foundPost && defaultPosts[slug]) {
            foundPost = defaultPosts[slug]
          }
          
          setPost(foundPost)
          
          if (foundPost) {
            const related = allPosts
              .filter(p => p.category === foundPost!.category && p.slug !== slug)
              .slice(0, 3)
            setRelatedPosts(related)
          }
        }
      } catch (e) {
        console.error('Error loading post:', e)
        // Fallback to defaults
        if (defaultPosts[slug]) {
          setPost(defaultPosts[slug])
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('تم نسخ الرابط!')
    }
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

        <div className="max-w-4xl mx-auto">
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
              <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة</span>
              </button>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-cairo font-bold text-text-primary mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-cairo font-bold text-text-primary mt-8 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-cairo font-bold text-text-primary mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-text-secondary leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-text-secondary">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="text-text-primary font-bold">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-r-4 border-primary pr-4 my-4 italic text-text-secondary">{children}</blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-surface px-2 py-1 rounded text-primary text-sm">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-surface p-4 rounded-xl overflow-x-auto mb-4">{children}</pre>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16 pt-8 border-t border-border"
            >
              <h2 className="text-2xl font-cairo font-bold text-text-primary mb-6">
                مقالات ذات صلة
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relPost) => (
                  <Link
                    key={relPost.slug}
                    href={`/blog/${relPost.slug}`}
                    className="bg-surface border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
                  >
                    <h3 className="font-cairo font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                      {relPost.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                      {relPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-gradient-to-br from-primary/10 to-background border border-primary/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-cairo font-bold text-text-primary mb-4">
              جاهز لتحويل مكتبك العقاري؟
            </h3>
            <p className="text-text-secondary mb-6 max-w-xl mx-auto">
              ابدأ اليوم بتجربة نظام صقر مجاناً واكتشف كيف يمكن للذكاء الاصطناعي مضاعفة مبيعاتك
            </p>
            <Link
              href="/demo"
              className="btn-primary inline-flex items-center gap-2"
            >
              جرّب مجاناً
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
          </motion.div>
        </div>
      </article>
    </div>
  )
}
