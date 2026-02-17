'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { value: '60%', label: 'توفير في الوقت' },
  { value: '3x', label: 'زيادة في المبيعات' },
  { value: '24/7', label: 'تواجد مستمر' },
  { value: '+10k', label: 'عميل تم خدمتهم' },
]

export function StatsSection() {
  return (
    <section className="py-20 border-y border-border bg-surface/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-x-reverse divide-border/30">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-4"
            >
              <div className="text-4xl md:text-5xl font-black text-primary mb-2 font-sora">{stat.value}</div>
              <div className="text-text-secondary font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
