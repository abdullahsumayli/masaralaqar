'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CTASectionProps {
  title: string
  description?: string
  buttonText: string
  buttonHref: string
  variant?: 'default' | 'glow'
  className?: string
}

export function CTASection({
  title,
  description,
  buttonText,
  buttonHref,
  variant = 'default',
  className,
}: CTASectionProps) {
  return (
    <section className={cn('section-padding', className)}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            'relative rounded-3xl p-8 md:p-12 lg:p-16 text-center overflow-hidden',
            variant === 'glow' && 'glow-border bg-surface',
            variant === 'default' && 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20'
          )}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-cairo font-bold text-text-primary mb-4">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
                {description}
              </p>
            )}

            {/* Button */}
            <Link
              href={buttonHref}
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              {buttonText}
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
