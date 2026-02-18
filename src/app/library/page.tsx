'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Send, Download, ExternalLink, BookOpen, Video, FileSpreadsheet, Wrench, X, User, Phone, CheckCircle } from 'lucide-react'

const tabs = ['الكل', 'كتب', 'دورات', 'قوالب', 'أدوات']

interface Resource {
  id: string
  title: string
  description: string
  type: 'book' | 'course' | 'template' | 'tool'
  category: string
  downloadUrl?: string
  externalUrl?: string
}

// Default resources
const defaultResources: Resource[] = [
  {
    id: '1',
    title: 'دليل الأتمتة الشامل للمكاتب العقارية',
    description: 'كتاب إلكتروني يشرح كيفية أتمتة عمليات مكتبك العقاري من الألف إلى الياء',
    type: 'book',
    category: 'أتمتة',
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'قوالب ردود واتساب الجاهزة',
    description: '50+ قالب رد جاهز للتعامل مع استفسارات العملاء الأكثر شيوعاً',
    type: 'template',
    category: 'تواصل',
    downloadUrl: '#',
  },
  {
    id: '3',
    title: 'دورة الذكاء الاصطناعي للوسطاء العقاريين',
    description: 'دورة مجانية تعلمك أساسيات استخدام AI في العمل العقاري',
    type: 'course',
    category: 'تعليم',
    externalUrl: '#',
  },
  {
    id: '4',
    title: 'حاسبة العائد على الاستثمار العقاري',
    description: 'أداة تساعدك على حساب ROI للعقارات بدقة عالية',
    type: 'tool',
    category: 'تحليل',
    externalUrl: '#',
  },
  {
    id: '5',
    title: 'نموذج تأهيل العملاء المحتملين',
    description: 'قالب جاهز لتصفية وتأهيل العملاء المحتملين بكفاءة',
    type: 'template',
    category: 'مبيعات',
    downloadUrl: '#',
  },
  {
    id: '6',
    title: 'كتاب فن التفاوض العقاري',
    description: 'استراتيجيات وتقنيات التفاوض الناجح في الصفقات العقارية',
    type: 'book',
    category: 'مبيعات',
    downloadUrl: '#',
  },
]

const typeMap: Record<string, string> = {
  'كتب': 'book',
  'دورات': 'course',
  'قوالب': 'template',
  'أدوات': 'tool',
}

const typeConfig = {
  book: { label: 'كتاب', icon: BookOpen, color: 'text-blue-500 bg-blue-500/10' },
  course: { label: 'دورة', icon: Video, color: 'text-purple-500 bg-purple-500/10' },
  template: { label: 'قالب', icon: FileSpreadsheet, color: 'text-green-500 bg-green-500/10' },
  tool: { label: 'أداة', icon: Wrench, color: 'text-orange-500 bg-orange-500/10' },
}

interface DownloadFormData {
  name: string
  email: string
  phone: string
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('الكل')
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [formData, setFormData] = useState<DownloadFormData>({ name: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [email, setEmail] = useState('')

  // Load resources from localStorage (from admin)
  useEffect(() => {
    const savedResources = localStorage.getItem('libraryResources')
    if (savedResources) {
      const parsed = JSON.parse(savedResources)
      // Only show published resources
      const published = parsed.filter((r: any) => r.published)
      if (published.length > 0) {
        setResources(published)
      }
    }
  }, [])

  const filteredResources = activeTab === 'الكل'
    ? resources
    : resources.filter((r) => r.type === typeMap[activeTab])

  const handleDownloadClick = (resource: Resource) => {
    // Check if user already registered
    const userEmail = localStorage.getItem('userDownloadEmail')
    
    if (userEmail) {
      // User already registered, allow direct download
      handleDirectDownload(resource)
    } else {
      // Show registration modal
      setSelectedResource(resource)
      setShowDownloadModal(true)
    }
  }

  const handleDirectDownload = (resource: Resource) => {
    if (resource.downloadUrl) {
      if (resource.downloadUrl.startsWith('data:')) {
        // Base64 file - create download link
        const link = document.createElement('a')
        link.href = resource.downloadUrl
        link.download = resource.title
        link.click()
      } else if (resource.downloadUrl !== '#' && resource.downloadUrl !== '#uploaded') {
        window.open(resource.downloadUrl, '_blank')
      } else {
        alert('الملف غير متاح حالياً')
      }
    } else if (resource.externalUrl) {
      window.open(resource.externalUrl, '_blank')
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Save lead to localStorage
    const lead = {
      id: Date.now().toString(),
      ...formData,
      resourceId: selectedResource?.id,
      resourceTitle: selectedResource?.title,
      downloadedAt: new Date().toISOString(),
    }

    const existingLeads = JSON.parse(localStorage.getItem('downloadLeads') || '[]')
    existingLeads.push(lead)
    localStorage.setItem('downloadLeads', JSON.stringify(existingLeads))
    
    // Save user email for future downloads
    localStorage.setItem('userDownloadEmail', formData.email)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setShowSuccess(true)

    // Auto download after 2 seconds
    setTimeout(() => {
      if (selectedResource) {
        handleDirectDownload(selectedResource)
      }
      setShowDownloadModal(false)
      setShowSuccess(false)
      setSelectedResource(null)
      setFormData({ name: '', email: '', phone: '' })
    }, 2000)
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]')
    subscribers.push({ email, subscribedAt: new Date().toISOString() })
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers))
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
          {filteredResources.map((resource, index) => {
            const config = typeConfig[resource.type]
            const TypeIcon = config.icon

            return (
              <motion.div
                key={resource.id || resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-background rounded-full text-text-muted text-xs">
                    {config.label}
                  </span>
                </div>

                <h3 className="font-cairo font-bold text-text-primary text-lg mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-text-muted text-xs">{resource.category}</span>
                  <button
                    onClick={() => handleDownloadClick(resource)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    {resource.downloadUrl ? (
                      <>
                        <Download className="w-4 h-4" />
                        تحميل مجاني
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        الوصول
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
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
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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

      {/* Download Registration Modal */}
      <AnimatePresence>
        {showDownloadModal && selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSubmitting && setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D1117] border border-[#21262d] rounded-2xl w-full max-w-md overflow-hidden"
            >
              {showSuccess ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">شكراً لك!</h3>
                  <p className="text-gray-400">جاري تحميل الملف...</p>
                </div>
              ) : (
                <>
                  <div className="border-b border-[#21262d] p-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">تحميل مجاني</h2>
                    <button 
                      onClick={() => setShowDownloadModal(false)}
                      className="w-8 h-8 rounded-lg hover:bg-[#21262d] flex items-center justify-center text-gray-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    {/* Resource Info */}
                    <div className="bg-[#161b22] rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${typeConfig[selectedResource.type].color} flex items-center justify-center flex-shrink-0`}>
                          {(() => {
                            const Icon = typeConfig[selectedResource.type].icon
                            return <Icon className="w-5 h-5" />
                          })()}
                        </div>
                        <div>
                          <h4 className="font-medium text-white line-clamp-1">{selectedResource.title}</h4>
                          <p className="text-gray-500 text-sm">{typeConfig[selectedResource.type].label} مجاني</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 text-center">
                      أدخل بياناتك للحصول على الملف مجاناً
                    </p>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">الاسم الكامل *</label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="أدخل اسمك"
                            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">البريد الإلكتروني *</label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="example@email.com"
                            dir="ltr"
                            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary text-left"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">رقم الجوال *</label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            placeholder="05xxxxxxxx"
                            dir="ltr"
                            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary text-left"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-xl font-medium transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            جاري التحميل...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            تحميل الآن
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-gray-500 text-xs text-center mt-4">
                      بياناتك محفوظة ولن نشاركها مع أي طرف ثالث
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
