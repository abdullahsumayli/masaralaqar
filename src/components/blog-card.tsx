'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: number
  coverImage?: string
  className?: string
}

export function BlogCard({
  slug,
  title,
  excerpt,
  category,
  date,
  readingTime,
  coverImage,
  className,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'group bg-surface border border-border rounded-2xl overflow-hidden card-hover',
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative h-48 md:h-56 bg-background overflow-hidden">
        {coverImage && coverImage.length > 50 ? (
          coverImage.startsWith('data:') ? (
            <img
              src={coverImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-cairo font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{excerpt}</p>

        {/* Meta */}
        <div className="flex items-center justify-between text-text-muted text-sm">
          <div className="flex items-center gap-4">
            <span>{date}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} دقائق</span>
            </div>
          </div>
        </div>

        {/* Read more link */}
        <Link
          href={`/blog/${slug}`}
          className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-sm"
        >
          اقرأ المقال
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  )
}
