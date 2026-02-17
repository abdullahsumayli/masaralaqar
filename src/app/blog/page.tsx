'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BlogCard } from '@/components/blog-card'

const categories = [
  'الكل',
  'ذكاء اصطناعي',
  'أتمتة',
  'تقنية عقارية',
  'استراتيجية',
]

const allPosts = [
  {
    slug: 'losing-clients-due-to-late-response',
    title: 'كيف يخسر مكتبك العقاري 60% من عملائه بسبب التأخر في الرد',
    excerpt: 'دراسة تكشف أن 60% من العملاء المحتملين يتحولون للمنافسين خلال ساعة واحدة من عدم الرد. تعرف على الحل.',
    category: 'استراتيجية',
    date: '10 فبراير 2026',
    readingTime: 5,
  },
  {
    slug: 'complete-automation-guide-2026',
    title: 'دليل الأتمتة الكامل للمكاتب العقارية السعودية 2026',
    excerpt: 'كل ما تحتاج معرفته عن أتمتة مكتبك العقاري: من الأدوات إلى الاستراتيجيات والنتائج المتوقعة.',
    category: 'أتمتة',
    date: '5 فبراير 2026',
    readingTime: 8,
  },
  {
    slug: 'ai-in-real-estate-filtering',
    title: 'كيف يعمل الذكاء الاصطناعي في تصفية عملاء العقار',
    excerpt: 'شرح مبسط لكيفية استخدام AI في فرز العملاء الجادين من المتصفحين وتوفير وقتك الثمين.',
    category: 'ذكاء اصطناعي',
    date: '1 فبراير 2026',
    readingTime: 6,
  },
  {
    slug: 'whatsapp-automation-secrets',
    title: 'أسرار أتمتة واتساب للمكاتب العقارية',
    excerpt: 'كيف تجعل واتساب يعمل لصالحك 24 ساعة دون توظيف موظف إضافي.',
    category: 'أتمتة',
    date: '28 يناير 2026',
    readingTime: 7,
  },
  {
    slug: 'proptech-trends-saudi-2026',
    title: 'اتجاهات التقنية العقارية في السعودية 2026',
    excerpt: 'نظرة شاملة على أبرز التقنيات التي ستشكل مستقبل السوق العقاري السعودي.',
    category: 'تقنية عقارية',
    date: '25 يناير 2026',
    readingTime: 10,
  },
  {
    slug: 'chatbot-vs-human-response',
    title: 'الشات بوت أم الرد البشري: أيهما أفضل للعقار؟',
    excerpt: 'مقارنة موضوعية بين الرد الآلي والرد البشري في المكاتب العقارية مع توصيات عملية.',
    category: 'ذكاء اصطناعي',
    date: '20 يناير 2026',
    readingTime: 6,
  },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('الكل')

  const filteredPosts = activeCategory === 'الكل'
    ? allPosts
    : allPosts.filter((post) => post.category === activeCategory)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-cairo font-bold text-text-primary mb-4">
            مدونة مسار العقار
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            مقالات ورؤى في التقنية العقارية، الذكاء الاصطناعي، والأتمتة للمكاتب العقارية
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <BlogCard {...post} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              لا توجد مقالات في هذا التصنيف حالياً
            </p>
          </div>
        )}

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2 mt-12"
        >
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
            1
          </button>
          <button className="px-4 py-2 bg-surface border border-border text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors">
            2
          </button>
          <button className="px-4 py-2 bg-surface border border-border text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-colors">
            3
          </button>
        </motion.div>
      </div>
    </div>
  )
}
