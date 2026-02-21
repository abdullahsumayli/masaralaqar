'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Building2,
  Search,
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
} from 'lucide-react'
import { getAllBlogPosts } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

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
  { id: 'استراتيجية', name: 'استراتيجية' },
  { id: 'أتمتة', name: 'أتمتة' },
  { id: 'ذكاء اصطناعي', name: 'ذكاء اصطناعي' },
  { id: 'تقنية عقارية', name: 'تقنية عقارية' },
  { id: 'تسويق', name: 'تسويق' },
  { id: 'مبيعات', name: 'مبيعات' },
]

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  reading_time?: number
  readingTime?: number
  slug: string
  image?: string
  published: boolean
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticles() {
      setLoading(true)
      try {
        // Try Supabase first
        const supabasePosts = await getAllBlogPosts(true)
        if (supabasePosts && supabasePosts.length > 0) {
          setArticles(supabasePosts)
        } else {
          // Fallback to localStorage
          const savedPosts = localStorage.getItem('blogPosts')
          if (savedPosts) {
            const posts = JSON.parse(savedPosts)
            const publishedPosts = posts.filter((p: any) => p.published)
            setArticles(publishedPosts)
          }
        }
      } catch (error) {
        console.error('Error loading articles:', error)
        // Try localStorage as fallback
        const savedPosts = localStorage.getItem('blogPosts')
        if (savedPosts) {
          const posts = JSON.parse(savedPosts)
          const publishedPosts = posts.filter((p: any) => p.published)
          setArticles(publishedPosts)
        }
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [])

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.includes(searchQuery) || article.excerpt.includes(searchQuery)
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background text-text-primary" dir="rtl">
      <Navbar />

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
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary text-lg">لا توجد مقالات تطابق بحثك</p>
              <Link href="/admin/blog" className="text-primary hover:underline mt-2 inline-block">
                أضف مقالاً جديداً
              </Link>
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
                  {/* Article Image */}
                  <Link href={`/blog/${article.slug}`}>
                    {article.image ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-primary/30" />
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <Link href={`/blog/${article.slug}`}>
                      <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>
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
                        <span>{article.reading_time || article.readingTime || 5} دقائق</span>
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
        </div>
      </section>

      <Footer />
    </div>
  )
}
