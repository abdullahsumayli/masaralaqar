'use client'

import { motion } from 'framer-motion'
import { Download, ExternalLink, Book, Video, FileText, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

type ResourceType = 'book' | 'course' | 'template' | 'tool'

interface ResourceCardProps {
  title: string
  description: string
  type: ResourceType
  category: string
  downloadUrl?: string
  externalUrl?: string
  className?: string
}

const typeIcons: Record<ResourceType, React.ElementType> = {
  book: Book,
  course: Video,
  template: FileText,
  tool: Wrench,
}

const typeLabels: Record<ResourceType, string> = {
  book: 'كتاب',
  course: 'دورة',
  template: 'قالب',
  tool: 'أداة',
}

export function ResourceCard({
  title,
  description,
  type,
  category,
  downloadUrl,
  externalUrl,
  className,
}: ResourceCardProps) {
  const Icon = typeIcons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'group bg-surface border border-border rounded-2xl p-6 card-hover',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
            {typeLabels[type]}
          </span>
          <span className="px-2 py-1 bg-background text-text-secondary text-xs rounded">
            {category}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-cairo font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-4 line-clamp-2">{description}</p>

      {/* Action Button */}
      <div className="flex items-center gap-2">
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            تحميل مجاني
          </a>
        )}
        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            الوصول
          </a>
        )}
      </div>
    </motion.div>
  )
}
