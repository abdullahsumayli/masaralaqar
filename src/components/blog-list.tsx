'use client'

import { useState } from 'react'
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
}

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState('الكل')

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
