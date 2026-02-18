'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Calendar, Share2, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readingTime: number
  image?: string
}

interface BlogPostViewProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export function BlogPostView({ post, relatedPosts }: BlogPostViewProps) {
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

          {/* Cover Image */}
          {post.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

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
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-border">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-surface px-4 py-2 text-text-primary font-bold text-right">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2 text-text-secondary">{children}</td>
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
                    {relPost.image && (
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={relPost.image}
                          alt={relPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
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
