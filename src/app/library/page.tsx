'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { ResourceCard } from '@/components/resource-card'

const tabs = ['الكل', 'كتب', 'دورات', 'قوالب', 'أدوات']

const resources = [
  {
    title: 'دليل الأتمتة للمكاتب العقارية',
    description: 'كتاب شامل يغطي كل ما تحتاج معرفته عن أتمتة عمليات المكتب العقاري',
    type: 'book' as const,
    category: 'أتمتة',
    downloadUrl: '#',
  },
  {
    title: 'دورة أساسيات الذكاء الاصطناعي للعقاريين',
    description: 'دورة مجانية تشرح كيف يمكن للذكاء الاصطناعي تحسين أداء مكتبك',
    type: 'course' as const,
    category: 'ذكاء اصطناعي',
    externalUrl: '#',
  },
  {
    title: 'قالب متابعة العملاء (Excel)',
    description: 'قالب احترافي لتتبع العملاء والصفقات على Excel',
    type: 'template' as const,
    category: 'إدارة',
    downloadUrl: '#',
  },
  {
    title: 'حاسبة العائد على الاستثمار العقاري',
    description: 'أداة لحساب ROI للاستثمارات العقارية بسهولة',
    type: 'tool' as const,
    category: 'أدوات',
    externalUrl: '#',
  },
  {
    title: 'كتاب فن التفاوض العقاري',
    description: 'استراتيجيات وتكتيكات التفاوض الفعال في الصفقات العقارية',
    type: 'book' as const,
    category: 'مبيعات',
    downloadUrl: '#',
  },
  {
    title: 'دورة إتقان واتساب بزنس للعقاريين',
    description: 'تعلم كيفية استخدام واتساب بزنس بشكل احترافي لمكتبك',
    type: 'course' as const,
    category: 'تسويق',
    externalUrl: '#',
  },
  {
    title: 'قالب عرض العقار الاحترافي',
    description: 'قالب PowerPoint جاهز لعرض العقارات بشكل احترافي',
    type: 'template' as const,
    category: 'تسويق',
    downloadUrl: '#',
  },
  {
    title: 'أداة تحليل السوق العقاري',
    description: 'أداة لتحليل اتجاهات السوق العقاري في منطقتك',
    type: 'tool' as const,
    category: 'تحليل',
    externalUrl: '#',
  },
  {
    title: 'دليل التسويق الرقمي للعقارات',
    description: 'استراتيجيات التسويق الرقمي الفعالة للمكاتب العقارية',
    type: 'book' as const,
    category: 'تسويق',
    downloadUrl: '#',
  },
]

const typeMap: Record<string, string> = {
  'كتب': 'book',
  'دورات': 'course',
  'قوالب': 'template',
  'أدوات': 'tool',
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('الكل')
  const [email, setEmail] = useState('')

  const filteredResources = activeTab === 'الكل'
    ? resources
    : resources.filter((r) => r.type === typeMap[activeTab])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription
    alert('شكراً لاشتراكك! سنرسل لك أحدث الموارد.')
    setEmail('')
  }

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
            المكتبة المجانية
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            موارد مجانية لمساعدتك على تطوير مكتبك العقاري: كتب، دورات، قوالب، وأدوات
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <ResourceCard {...resource} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              لا توجد موارد في هذا التصنيف حالياً
            </p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-cairo font-bold text-text-primary mb-4">
              اشترك للحصول على أحدث الموارد
            </h2>
            <p className="text-text-secondary mb-8">
              نرسل لك أحدث الكتب والدورات والأدوات مباشرة لبريدك الإلكتروني
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                اشترك
              </button>
            </form>

            <p className="text-text-muted text-sm mt-4">
              لا رسائل مزعجة، يمكنك إلغاء الاشتراك في أي وقت
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
