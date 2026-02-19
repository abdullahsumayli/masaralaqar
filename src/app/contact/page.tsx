'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { createLead } from '@/lib/leads'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const contactInfo = [
  {
    icon: Phone,
    label: 'الهاتف',
    value: '+966 50 XXX XXXX',
    href: 'tel:+966500000000',
  },
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: 'info@masaralaqar.com',
    href: 'mailto:info@masaralaqar.com',
  },
  {
    icon: MapPin,
    label: 'الموقع',
    value: 'الرياض، المملكة العربية السعودية',
    href: '#',
  },
  {
    icon: Clock,
    label: 'ساعات العمل',
    value: 'الأحد - الخميس: 9ص - 6م',
    href: '#',
  },
]

const socialLinks = [
  {
    name: 'X (تويتر)',
    href: 'https://twitter.com/masaralaqar',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'لينكدإن',
    href: 'https://linkedin.com/company/masaralaqar',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'واتساب',
    href: 'https://wa.me/966500000000',
    icon: <MessageCircle className="w-5 h-5" />,
  },
]

const faqItems = [
  {
    question: 'ما هي خدمات مسار العقار؟',
    answer: 'نقدم ثلاث خدمات رئيسية: حلول الذكاء الاصطناعي والأتمتة (نظام صقر)، خدمات الوساطة العقارية، والتدريب والاستشارات عبر أكاديمية مسار العقار.',
  },
  {
    question: 'كم يكلف نظام صقر؟',
    answer: 'نقدم باقات متنوعة تبدأ من 299 ر.س شهرياً. يمكنك تجربة النظام مجاناً لمدة 14 يوماً قبل الاشتراك.',
  },
  {
    question: 'هل يمكنني حجز استشارة مجانية؟',
    answer: 'نعم، نقدم استشارات مجانية لمدة 30 دقيقة لمناقشة احتياجاتك واختيار الحل المناسب لك.',
  },
  {
    question: 'كيف يمكنني الانضمام للأكاديمية؟',
    answer: 'يمكنك زيارة صفحة الأكاديمية واختيار المسار التعليمي المناسب لمستواك، ثم التسجيل في الدورات المتاحة.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const subjectMap: Record<string, string> = {
      saqr: 'استفسار عن نظام صقر',
      brokerage: 'خدمات الوساطة العقارية',
      academy: 'الأكاديمية والتدريب',
      partnership: 'شراكات وتعاون',
      support: 'دعم فني',
      other: 'أخرى',
    }

    const { error } = await createLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      subject: subjectMap[formData.subject] || formData.subject,
      message: formData.message,
      source: 'contact_form',
    })
    
    if (error) {
      alert('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.')
    }
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-primary font-bold text-xl block leading-tight">مسار العقار</span>
              <span className="text-text-secondary text-xs">Masar Al-Aqar</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-text-secondary hover:text-primary transition-colors">الرئيسية</Link>
            <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors">المدونة</Link>
            <Link href="/library" className="text-text-secondary hover:text-primary transition-colors">المكتبة</Link>
            <Link href="/academy" className="text-text-secondary hover:text-primary transition-colors">الأكاديمية</Link>
            <Link href="/services" className="text-text-secondary hover:text-primary transition-colors">الخدمات</Link>
            <Link href="/contact" className="text-primary font-medium">تواصل معنا</Link>
          </nav>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors"
          >
            <Phone className="w-4 h-4" />
            تواصل معنا
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-surface to-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              📞 تواصل معنا
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              نحن هنا لمساعدتك
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              راسلنا أو اتصل بنا — فريقنا جاهز للرد على استفساراتك ومساعدتك في رحلتك العقارية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white border border-border rounded-2xl p-8"
            >
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">شكراً لتواصلك!</h3>
                  <p className="text-text-secondary mb-6">
                    تم استلام رسالتك بنجاح. سنتواصل معك في أقرب وقت ممكن.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                          placeholder="محمد أحمد"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">رقم الجوال</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                          placeholder="05XXXXXXXX"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                        placeholder="example@email.com"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الموضوع</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">اختر الموضوع</option>
                        <option value="saqr">استفسار عن نظام صقر</option>
                        <option value="brokerage">خدمات الوساطة العقارية</option>
                        <option value="academy">الأكاديمية والتدريب</option>
                        <option value="partnership">شراكات وتعاون</option>
                        <option value="support">دعم فني</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الرسالة</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="اكتب رسالتك هنا..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          جاري الإرسال...
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>
                          إرسال الرسالة
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-2xl font-bold mb-6">معلومات التواصل</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-start gap-4 p-4 bg-white border border-border rounded-xl hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <info.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm text-text-muted mb-1">{info.label}</div>
                        <div className="font-medium">{info.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-2xl font-bold mb-6">تابعنا</h2>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all"
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Quick CTA */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white"
              >
                <h3 className="text-xl font-bold mb-3">تفضل التواصل المباشر؟</h3>
                <p className="text-white/80 mb-6">
                  تحدث مع فريقنا مباشرة عبر واتساب للحصول على رد سريع
                </p>
                <a
                  href="https://wa.me/966500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-bold hover:bg-white/90 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  تواصل عبر واتساب
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">الأسئلة الشائعة</h2>
            <p className="text-text-secondary">
              إجابات على الأسئلة الأكثر تكراراً
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-4"
          >
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-border rounded-xl p-6"
              >
                <h3 className="font-bold mb-2">{item.question}</h3>
                <p className="text-text-secondary">{item.answer}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">مسار العقار</span>
          </div>
          <p className="text-white/60 text-sm">
            © 2026 مسار العقار. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  )
}
