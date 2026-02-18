'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BlogCard } from '@/components/blog-card'
import { FileText } from 'lucide-react'

const categories = [
  'الكل',
  'ذكاء اصطناعي',
  'أتمتة',
  'تقنية عقارية',
  'استراتيجية',
  'تسويق',
  'مبيعات',
]

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: number
  image?: string
  published?: boolean
}

const defaultPosts: BlogPost[] = [
  {
    slug: 'ai-in-real-estate-filtering',
    title: 'كيف يعمل الذكاء الاصطناعي في تصفية عملاء العقار',
    excerpt: 'شرح مبسط لكيفية استخدام AI في فرز العملاء الجادين من المتصفحين وتوفير وقتك الثمين.',
    category: 'ذكاء اصطناعي',
    date: '1 فبراير 2026',
    readingTime: 6,
    published: true,
  },
  {
    slug: 'complete-automation-guide-2026',
    title: 'دليل الأتمتة الكامل للمكاتب العقارية السعودية 2026',
    excerpt: 'كل ما تحتاج معرفته عن أتمتة مكتبك العقاري: من الأدوات إلى الاستراتيجيات والنتائج المتوقعة.',
    category: 'أتمتة',
    date: '5 فبراير 2026',
    readingTime: 8,
    published: true,
  },
  {
    slug: 'losing-clients-due-to-late-response',
    title: 'كيف يخسر مكتبك العقاري 60% من عملائه بسبب التأخر في الرد',
    excerpt: 'دراسة تكشف أن 60% من العملاء المحتملين يتحولون للمنافسين خلال ساعة واحدة من عدم الرد.',
    category: 'استراتيجية',
    date: '10 فبراير 2026',
    readingTime: 5,
    published: true,
  },
  {
    slug: 'whatsapp-automation-tips',
    title: '7 نصائح ذهبية لأتمتة واتساب في مكتبك العقاري',
    excerpt: 'اكتشف أفضل الممارسات لاستخدام الواتساب الآلي في التواصل مع العملاء وزيادة المبيعات.',
    category: 'أتمتة',
    date: '12 فبراير 2026',
    readingTime: 7,
    published: true,
  },
  {
    slug: 'real-estate-tech-trends-2026',
    title: 'أهم 10 تقنيات عقارية ستغير السوق السعودي في 2026',
    excerpt: 'نظرة شاملة على التقنيات الحديثة التي ستشكل مستقبل السوق العقاري السعودي.',
    category: 'تقنية عقارية',
    date: '14 فبراير 2026',
    readingTime: 10,
    published: true,
  },
  {
    slug: 'lead-qualification-strategies',
    title: 'استراتيجيات تأهيل العملاء المحتملين في 5 دقائق',
    excerpt: 'تعلم كيف تحدد العملاء الجادين بسرعة وتوفر وقتك للصفقات الحقيقية.',
    category: 'مبيعات',
    date: '16 فبراير 2026',
    readingTime: 6,
    published: true,
  },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts)

  // Load posts from localStorage (from admin) and merge with defaults
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts')
    if (savedPosts) {
      try {
        const adminPosts = JSON.parse(savedPosts)
        // Filter published posts from admin
        const publishedAdminPosts = adminPosts.filter((p: any) => p.published)
        
        if (publishedAdminPosts.length > 0) {
          // Merge: admin posts take priority, then add defaults that don't exist in admin
          const adminSlugs = publishedAdminPosts.map((p: any) => p.slug)
          const defaultsNotInAdmin = defaultPosts.filter(p => !adminSlugs.includes(p.slug))
          setPosts([...publishedAdminPosts, ...defaultsNotInAdmin])
        }
      } catch (e) {
        console.error('Error loading posts:', e)
      }
    }
  }, [])

  const filteredPosts = activeCategory === 'الكل'
    ? posts
    : posts.filter((post) => post.category === activeCategory)

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
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <BlogCard 
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={post.date}
                  readingTime={post.readingTime}
                  coverImage={post.image}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">لا توجد مقالات في هذا التصنيف</h3>
            <p className="text-text-secondary">
              جرب اختيار تصنيف آخر
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
