'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Shield, MessageCircle, BarChart3, Globe, Repeat, Clock, Users, Calendar } from 'lucide-react'

// Assuming Shadcn UI Card component exists, otherwise using standard divs
// Fallback for simple div if @/components/ui/card fails

const features = [
  {
    icon: MessageCircle,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "الرد الآلي الذكي",
    description: "نظام يرد على استفسارات العملاء في الواتساب والموقع فوراً، ويفهم اللهجة السعودية."
  },
  {
    icon: BarChart3,
    color: "text-green-500",
    bg: "bg-green-500/10",
    title: "تصفية العملاء",
    description: "يميز بين المشتري الجاد والمتصفح فقط، ويوجه الجادين مباشرة لفريق المبيعات."
  },
  {
    icon: Calendar,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    title: "جدولة المعاينات",
    description: "يتيح للعميل حجز موعد معاينة العقار تلقائياً بناءً على جدولك المتاح."
  },
  {
    icon: Globe,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    title: "تسويق متعدد القنوات",
    description: "انشر عقاراتك في جميع المنصات بضغطة زر واحدة مع تحسين الوصف بالذكاء الاصطناعي."
  },
  {
    icon: Repeat,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    title: "متابعة تلقائية",
    description: "لا تخسر عميلاً بسبب النسيان. النظام يتابع مع العملاء حتى إتمام الصفقة."
  },
  {
    icon: Shield,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    title: "أمان وموثوقية",
    description: "بياناتك وبيانات عملائك مشفرة ومحمية بأعلى معايير الأمان العالمية."
  }
]

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-surface/30 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            كل ما تحتاجه لإدارة <br />
            <span className="text-primary">مكتب عقاري حديث</span>
          </h2>
          <p className="text-text-secondary text-lg">
            أدوات متكاملة مصممة خصيصاً لسوق العقار السعودي، تساعدك على توفير الوقت ومضاعفة المبيعات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group bg-surface border border-border p-8 rounded-2xl hover:border-primary/50 transition-all hover:bg-surface/80"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
