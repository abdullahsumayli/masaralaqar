'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { use } from 'react'
import {
  Building2,
  Phone,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  MessageCircle,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Mock article data
const getArticle = (slug: string) => {
  const articles: Record<string, any> = {
    'ai-in-real-estate': {
      title: 'كيف يغير الذكاء الاصطناعي قطاع العقارات في السعودية؟',
      excerpt: 'نظرة شاملة على تأثير التقنيات الحديثة في سوق العقار السعودي.',
      category: 'ذكاء اصطناعي',
      date: '15 فبراير 2026',
      readTime: '8 دقائق',
      author: 'فريق مسار العقار',
      content: `
        <h2>مقدمة</h2>
        <p>يشهد قطاع العقارات في المملكة العربية السعودية تحولاً جذرياً بفضل التقنيات الحديثة، وعلى رأسها الذكاء الاصطناعي. هذا التحول يعيد تشكيل طريقة عمل الوسطاء العقاريين والشركات العقارية.</p>
        
        <h2>تطبيقات الذكاء الاصطناعي في العقار</h2>
        <p>تتعدد تطبيقات الذكاء الاصطناعي في القطاع العقاري، ومن أبرزها:</p>
        <ul>
          <li>تحليل أسعار العقارات والتنبؤ بها</li>
          <li>أتمتة خدمة العملاء عبر الشات بوت</li>
          <li>تصفية العملاء المحتملين تلقائياً</li>
          <li>إنشاء محتوى تسويقي ذكي</li>
        </ul>
        
        <h2>فوائد الأتمتة للوسطاء</h2>
        <p>يمكن للوسطاء العقاريين تحقيق العديد من الفوائد من خلال تبني الذكاء الاصطناعي:</p>
        <ol>
          <li>توفير الوقت في الرد على الاستفسارات المتكررة</li>
          <li>التركيز على العملاء الجادين</li>
          <li>تحسين تجربة العميل</li>
          <li>زيادة معدل إغلاق الصفقات</li>
        </ol>
        
        <h2>نظام صقر: مثال عملي</h2>
        <p>يعتبر نظام صقر من مسار العقار مثالاً حياً على كيفية استخدام الذكاء الاصطناعي في خدمة الوسطاء العقاريين. يقدم النظام:</p>
        <ul>
          <li>رد آلي ذكي على رسائل واتساب</li>
          <li>تصفية العملاء حسب الجدية</li>
          <li>جدولة المعاينات تلقائياً</li>
          <li>تقارير أداء مفصلة</li>
        </ul>
        
        <h2>الخلاصة</h2>
        <p>الذكاء الاصطناعي لم يعد ترفاً بل أصبح ضرورة للوسطاء الراغبين في البقاء في المنافسة. من يتبنى هذه التقنيات مبكراً سيكون في موقع أفضل للنجاح في السوق العقاري المتطور.</p>
      `,
    },
    'real-estate-marketing-2026': {
      title: 'أفضل استراتيجيات التسويق العقاري لعام 2026',
      excerpt: 'تعرف على أحدث طرق التسويق العقاري الفعالة.',
      category: 'نصائح للوسطاء',
      date: '12 فبراير 2026',
      readTime: '6 دقائق',
      author: 'فريق مسار العقار',
      content: `<h2>استراتيجيات التسويق العقاري</h2><p>محتوى المقالة...</p>`,
    },
  }
  
  return articles[slug] || articles['ai-in-real-estate']
}

const relatedArticles = [
  {
    title: 'مستقبل الوساطة العقارية الرقمية',
    category: 'ذكاء اصطناعي',
    slug: 'digital-brokerage-future',
  },
  {
    title: 'كيف تختار نظام CRM المناسب؟',
    category: 'تقنية',
    slug: 'choosing-crm-system',
  },
  {
    title: 'أتمتة التسويق العقاري: دليل شامل',
    category: 'تسويق',
    slug: 'marketing-automation-guide',
  },
]

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = getArticle(slug)

  const shareUrl = `https://masaralaqar.com/blog/${slug}`
  const shareText = encodeURIComponent(article.title)

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-primary font-bold text-xl block leading-tight">مسار العقار</span>
              <span className="text-text-secondary text-xs">Masar Al-Aqar</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-text-secondary hover:text-primary transition-colors">الرئيسية</Link>
            <Link href="/blog" className="text-primary font-medium">المدونة</Link>
            <Link href="/library" className="text-text-secondary hover:text-primary transition-colors">المكتبة</Link>
            <Link href="/academy" className="text-text-secondary hover:text-primary transition-colors">الأكاديمية</Link>
            <Link href="/services" className="text-text-secondary hover:text-primary transition-colors">الخدمات</Link>
            <Link href="/contact" className="text-text-secondary hover:text-primary transition-colors">تواصل معنا</Link>
          </nav>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors"
          >
            <Phone className="w-4 h-4" />
            تواصل معنا
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">المدونة</Link>
            <span>/</span>
            <span className="text-text-secondary">{article.category}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-8 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-text-muted">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} قراءة</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl -mt-4"></div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[1fr_200px] gap-12">
            {/* Main Content */}
            <article 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Share */}
              <div className="bg-surface rounded-xl p-6 sticky top-28">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  شارك المقالة
                </h4>
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X (تويتر)
                  </a>
                  <a
                    href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                    واتساب
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    لينكدإن
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-8">مقالات ذات صلة</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((related, index) => (
              <Link
                key={index}
                href={`/blog/${related.slug}`}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
              >
                <span className="text-sm text-primary mb-2 block">{related.category}</span>
                <h4 className="font-bold group-hover:text-primary transition-colors">{related.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمدونة
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">مسار العقار</span>
          </div>
          <p className="text-white/60 text-sm">
            © 2026 مسار العقار. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  )
}
