'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { use } from 'react'
import DOMPurify from 'dompurify'
import {
  Building2,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  MessageCircle,
  Loader2,
} from 'lucide-react'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  reading_time: number
  image?: string
  published: boolean
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [article, setArticle] = useState<BlogPost | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadArticle() {
      setLoading(true)
      try {
        // Try to get from Supabase
        const post = await getBlogPostBySlug(slug)
        
        if (post) {
          setArticle(post)
          
          // Load related articles
          const allPosts = await getAllBlogPosts(true)
          const related = allPosts
            .filter((p: BlogPost) => p.slug !== slug)
            .slice(0, 3)
          setRelatedArticles(related)
        } else {
          // Fallback to localStorage
          const savedPosts = localStorage.getItem('blogPosts')
          if (savedPosts) {
            const posts = JSON.parse(savedPosts)
            const found = posts.find((p: any) => p.slug === slug)
            if (found) {
              setArticle({
                ...found,
                reading_time: found.readingTime || found.reading_time || 5
              })
              const related = posts
                .filter((p: any) => p.slug !== slug && p.published)
                .slice(0, 3)
              setRelatedArticles(related)
            } else {
              setError('المقال غير موجود')
            }
          } else {
            setError('المقال غير موجود')
          }
        }
      } catch (err) {
        console.error('Error loading article:', err)
        // Try localStorage as fallback
        const savedPosts = localStorage.getItem('blogPosts')
        if (savedPosts) {
          const posts = JSON.parse(savedPosts)
          const found = posts.find((p: any) => p.slug === slug)
          if (found) {
            setArticle({
              ...found,
              reading_time: found.readingTime || found.reading_time || 5
            })
          } else {
            setError('المقال غير موجود')
          }
        } else {
          setError('المقال غير موجود')
        }
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">المقال غير موجود</h1>
          <p className="text-text-secondary mb-8">عذراً، لم نتمكن من العثور على المقال المطلوب.</p>
          <Link href="/blog" className="btn-primary">
            العودة للمدونة
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const shareUrl = `https://masaralaqar.com/blog/${slug}`
  const shareText = encodeURIComponent(article.title)

  return (
    <div className="min-h-screen bg-background text-text-primary" dir="rtl">
      <Navbar />

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
                <span>فريق مسار العقار</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.reading_time} دقائق قراءة</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          {article.image ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden -mt-4">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl -mt-4 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-primary/40" />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[1fr_200px] gap-12">
            {/* Main Content */}
            <article 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
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
      {relatedArticles.length > 0 && (
        <section className="py-12 px-4 bg-surface">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8">مقالات ذات صلة</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <Link
                  key={index}
                  href={`/blog/${related.slug}`}
                  className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {related.image ? (
                    <div className="aspect-video">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-sm text-primary mb-2 block">{related.category}</span>
                    <h4 className="font-bold group-hover:text-primary transition-colors line-clamp-2">{related.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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

      <Footer />
    </div>
  )
}
