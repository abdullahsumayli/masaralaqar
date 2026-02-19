'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Building2,
  Phone,
  Search,
  ArrowLeft,
  Calendar,
  Clock,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const categories = [
  { id: 'all', name: 'الكل' },
  { id: 'market', name: 'سوق عقاري' },
  { id: 'ai', name: 'ذكاء اصطناعي' },
  { id: 'tips', name: 'نصائح للوسطاء' },
  { id: 'regulations', name: 'أنظمة وقوانين' },
  { id: 'training', name: 'تدريب' },
]

const articles = [
  {
    id: 1,
    title: 'كيف يغير الذكاء الاصطناعي قطاع العقارات في السعودية؟',
    excerpt: 'نظرة شاملة على تأثير التقنيات الحديثة في سوق العقار السعودي وكيف يمكن للوسطاء الاستفادة منها.',
    category: 'ai',
    categoryName: 'ذكاء اصطناعي',
    date: '15 فبراير 2026',
    readTime: '8 دقائق',
    slug: 'ai-in-real-estate',
    featured: true,
  },
  {
    id: 2,
    title: 'أفضل استراتيجيات التسويق العقاري لعام 2026',
    excerpt: 'تعرف على أحدث طرق التسويق العقاري الفعالة التي يستخدمها المحترفون في السوق السعودي.',
    category: 'tips',
    categoryName: 'نصائح للوسطاء',
    date: '12 فبراير 2026',
    readTime: '6 دقائق',
    slug: 'real-estate-marketing-2026',
    featured: false,
  },
  {
    id: 3,
    title: 'دليل الوسيط العقاري المبتدئ: من أين تبدأ؟',
    excerpt: 'كل ما تحتاج معرفته لبدء مسيرتك في الوساطة العقارية بالمملكة العربية السعودية.',
    category: 'training',
    categoryName: 'تدريب',
    date: '10 فبراير 2026',
    readTime: '12 دقائق',
    slug: 'beginner-broker-guide',
    featured: false,
  },
  {
    id: 4,
    title: 'تحديثات نظام الوساطة العقارية الجديد',
    excerpt: 'ملخص شامل لأهم التعديلات في نظام الوساطة العقارية وتأثيرها على السوق.',
    category: 'regulations',
    categoryName: 'أنظمة وقوانين',
    date: '8 فبراير 2026',
    readTime: '5 دقائق',
    slug: 'new-brokerage-regulations',
    featured: false,
  },
  {
    id: 5,
    title: 'توقعات سوق العقار السعودي لعام 2026',
    excerpt: 'تحليل معمق لاتجاهات السوق العقاري والفرص الاستثمارية المتوقعة.',
    category: 'market',
    categoryName: 'سوق عقاري',
    date: '5 فبراير 2026',
    readTime: '10 دقائق',
    slug: 'saudi-real-estate-2026',
    featured: false,
  },
  {
    id: 6,
    title: 'كيف تبني علاقات قوية مع العملاء؟',
    excerpt: 'أسرار النجاح في بناء قاعدة عملاء وفية وتحقيق المبيعات المتكررة.',
    category: 'tips',
    categoryName: 'نصائح للوسطاء',
    date: '3 فبراير 2026',
    readTime: '7 دقائق',
    slug: 'building-client-relationships',
    featured: false,
  },
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.includes(searchQuery) || article.excerpt.includes(searchQuery)
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

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

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
              مدونة <span className="text-primary">مسار العقار</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-text-secondary text-lg mb-8">
              مقالات متخصصة في العقار والتقنية والتسويق العقاري
            </motion.p>

            {/* Search */}
            <motion.div variants={fadeInUp} className="relative max-w-xl mx-auto">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-border rounded-xl py-4 pr-12 pl-4 text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">لا توجد مقالات تطابق بحثك</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article) => (
                <motion.article
                  key={article.id}
                  variants={fadeInUp}
                  className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    {article.featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                        مميز
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {article.categoryName}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-text-muted text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                    >
                      اقرأ المزيد
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <button className="w-10 h-10 rounded-lg bg-primary text-white font-medium">1</button>
            <button className="w-10 h-10 rounded-lg bg-surface text-text-secondary hover:bg-primary/10 transition-colors">2</button>
            <button className="w-10 h-10 rounded-lg bg-surface text-text-secondary hover:bg-primary/10 transition-colors">3</button>
            <span className="text-text-muted px-2">...</span>
            <button className="w-10 h-10 rounded-lg bg-surface text-text-secondary hover:bg-primary/10 transition-colors">10</button>
          </div>
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
