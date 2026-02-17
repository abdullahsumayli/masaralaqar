'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Send, 
  Linkedin, 
  Twitter,
  Clock,
  CheckCircle
} from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'info@masaralaqar.com',
    href: 'mailto:info@masaralaqar.com',
    description: 'راسلنا في أي وقت',
  },
  {
    icon: MessageCircle,
    title: 'واتساب',
    value: '+966 50 XXX XXXX',
    href: 'https://wa.me/966501234567',
    description: 'تواصل مباشر وسريع',
  },
  {
    icon: MapPin,
    title: 'الموقع',
    value: 'المملكة العربية السعودية',
    description: 'الرياض',
  },
]

const workingHours = [
  { day: 'الأحد - الخميس', hours: '9:00 ص - 6:00 م' },
  { day: 'الجمعة', hours: 'مغلق' },
  { day: 'السبت', hours: '10:00 ص - 4:00 م' },
]

const inquiryTypes = [
  'استفسار عام',
  'طلب عرض سعر',
  'دعم فني',
  'شراكات',
  'توظيف',
  'أخرى',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', phone: '', company: '', inquiryType: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-cairo font-bold text-text-primary mb-4">
            تواصل معنا
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            نسعد بالتواصل معك والإجابة على استفساراتك. اختر الطريقة المناسبة لك
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-cairo font-bold text-text-primary mb-6">
                أرسل رسالة
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-cairo font-bold text-text-primary mb-2">
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p className="text-text-secondary">
                    سنتواصل معك في أقرب وقت ممكن
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        الاسم الكامل <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                        placeholder="أدخل اسمك"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        البريد الإلكتروني <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        رقم الجوال
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-text-primary font-medium mb-2">
                        اسم الشركة/المكتب
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                        placeholder="اسم مكتبك العقاري"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      نوع الاستفسار <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">اختر نوع الاستفسار</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-text-primary font-medium mb-2">
                      رسالتك <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="كيف يمكننا مساعدتك؟"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2 text-lg">
                    <Send className="w-5 h-5" />
                    إرسال الرسالة
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Methods */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-lg font-cairo font-bold text-text-primary mb-6">
                طرق التواصل
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <div
                    key={method.title}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-background transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <method.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{method.title}</p>
                      {method.href ? (
                        <a
                          href={method.href}
                          target={method.href.startsWith('http') ? '_blank' : undefined}
                          rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-primary hover:text-primary-dark transition-colors"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-text-secondary">{method.value}</p>
                      )}
                      <p className="text-text-muted text-sm">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-cairo font-bold text-text-primary">
                  ساعات العمل
                </h3>
              </div>
              <div className="space-y-3">
                {workingHours.map((schedule) => (
                  <div key={schedule.day} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{schedule.day}</span>
                    <span className="text-text-primary font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-lg font-cairo font-bold text-text-primary mb-4">
                تابعنا
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/966501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <p className="text-text-primary font-medium mb-2">
                تفضل التحدث مباشرة؟
              </p>
              <p className="text-text-secondary text-sm mb-4">
                نحن متواجدون للإجابة على أسئلتك
              </p>
              <a
                href="https://wa.me/966501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                تواصل عبر واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
