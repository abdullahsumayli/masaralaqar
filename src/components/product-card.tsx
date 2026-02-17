'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  icon: string
  title: string
  description: string
  features: string[]
  href: string
  price?: string
  className?: string
}

export function ProductCard({
  icon,
  title,
  description,
  features,
  href,
  price,
  className,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'group relative bg-surface border border-border rounded-2xl p-6 md:p-8 card-hover',
        className
      )}
    >
      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-cairo font-bold text-text-primary mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary mb-6">{description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-text-secondary text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Price (optional) */}
      {price && (
        <p className="text-primary font-semibold mb-6">{price}</p>
      )}

      {/* CTA */}
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
      >
        اكتشف أكثر
        <ArrowLeft className="w-4 h-4" />
      </Link>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  )
}
