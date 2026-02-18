'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  MessageCircle, 
  Users, 
  Rocket, 
  Clock, 
  CheckCircle,
  Linkedin,
  Quote,
  Send
} from 'lucide-react'

interface Service {
  id: string
  icon: string
  title: string
  duration: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonHref: string
}

interface Trainer {
  name: string
  title: string
  bio: string
  credentials: string[]
  linkedin: string
}

interface Testimonial {
  id: string
  quote: string
  author: string
  company: string
}

const iconMap: Record<string, any> = {
  MessageCircle,
  Users,
  Rocket,
}

const defaultServices: Service[] = [
  {
    id: '1',
    icon: 'MessageCircle',
    title: 'استشارات فردية',
    duration: '60 دقيقة',
    price: '500 ريال',
    description: 'جلسة استشارية فردية لحل تحديات مكتبك العقاري وتحديد خطة الأتمتة المناسبة',
    features: ['تحليل وضع مكتبك الحالي', 'خطة أتمتة مخصصة', 'توصيات الأدوات المناسبة', 'متابعة بعد الجلسة'],
    buttonText: 'احجز الآن',
    buttonHref: '#booking',
  },
  {
    id: '2',
    icon: 'Users',
    title: 'تدريب المكاتب',
    duration: 'يوم كامل',
    price: '3,000 ريال',
    description: 'تدريب مكثف لفريق مكتبك على الأتمتة والتقنيات الحديثة في مقر عملكم',
    features: ['تدريب فريق كامل (حتى 10 أشخاص)', 'ورشة عمل تطبيقية', 'إعداد الأدوات الأساسية', 'دعم لمدة شهر'],
    buttonText: 'تواصل معنا',
    buttonHref: '/contact',
  },
  {
    id: '3',
    icon: 'Rocket',
    title: 'برنامج التحول الرقمي',
    duration: '3 أشهر',
    price: 'يبدأ من 15,000 ريال',
    description: 'برنامج متكامل للتحول الرقمي الشامل لمكتبك العقاري مع متابعة مستمرة',
    features: ['تحليل شامل وخطة استراتيجية', 'تنفيذ الأتمتة الكاملة', 'تدريب الفريق', 'دعم ومتابعة لـ 3 أشهر', 'تقارير أداء شهرية'],
    buttonText: 'اعرف أكثر',
    buttonHref: '/contact',
  },
]

const defaultTrainer: Trainer = {
  name: 'عبدالله صميلي',
  title: 'مؤسس مسار العقار',
  bio: 'خبير في أتمتة العمليات العقارية والذكاء الاصطناعي مع أكثر من 10 سنوات خبرة في السوق العقاري السعودي. ساعد أكثر من 50 مكتب عقاري على التحول الرقمي.',
  credentials: ['ماجستير في إدارة الأعمال', 'شهادة معتمدة في الذكاء الاصطناعي', 'مدرب معتمد من HubSpot', '+50 مكتب عقاري تم تدريبهم'],
  linkedin: 'https://linkedin.com',
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'استشارة عبدالله غيرت نظرتنا للأتمتة. خلال شهر ضاعفنا إنتاجيتنا وقللنا الجهد للنصف.',
    author: 'محمد العتيبي',
    company: 'مكتب الرياض للعقارات',
  },
  {
    id: '2',
    quote: 'برنامج التحول الرقمي كان أفضل استثمار لمكتبنا. النتائج فاقت توقعاتنا.',
    author: 'خالد السعيد',
    company: 'مجموعة الخليج العقارية',
  },
  {
    id: '3',
    quote: 'تدريب الفريق كان ممتاز. الآن كل موظف يفهم كيف يستخدم الأدوات بفعالية.',
    author: 'فهد الشمري',
    company: 'عقارات الشرق',
  },
]

export default function AcademyPage() {
  const [services, setServices] = useState<Service[]>(defaultServices)
  const [trainer, setTrainer] = useState<Trainer>(defaultTrainer)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  // Load data from localStorage
  useEffect(() => {
    const savedServices = localStorage.getItem('academyServices')
    const savedTrainer = localStorage.getItem('academyTrainer')
    const savedTestimonials = localStorage.getItem('academyTestimonials')

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    }

    if (savedTrainer) {
      setTrainer(JSON.parse(savedTrainer))
    }

    if (savedTestimonials) {
      const parsed = JSON.parse(savedTestimonials)
      if (parsed.length > 0) {
        setTestimonials(parsed)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('academyBookings') || '[]')
    bookings.push({ ...formData, date: new Date().toISOString() })
    localStorage.setItem('academyBookings', JSON.stringify(bookings))
    
    alert('شكراً! سنتواصل معك قريباً.')
    setFormData({ name: '', email: '', phone: '', service: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">التعلم والتطوير</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cairo font-bold text-text-primary mb-6">
            أكاديمية مسار العقار
          </h1>
          
          <p className="text-2xl md:text-3xl text-primary font-semibold mb-4">
            العقار علم.. والأتمتة استدامة
          </p>
          
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            استشارات، تدريب، وبرامج تحول رقمي متكاملة للمكاتب العقارية.
            نساعدك على فهم وتطبيق أحدث التقنيات لتحقيق نتائج استثنائية.
          </p>
          
          <Link href="#services" className="btn-primary inline-flex items-center gap-2 text-lg">
            استعرض الخدمات
          </Link>
        </motion.div>
      </section>

      {/* Services */}
      <section id="services" className="bg-surface/30 py-16 md:py-20 mb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
              خدماتنا
            </h2>
            <p className="text-text-secondary text-lg">
              اختر الخدمة المناسبة لاحتياجات مكتبك
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || MessageCircle
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background border border-border rounded-2xl p-6 md:p-8 flex flex-col"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-cairo font-bold text-text-primary mb-2">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-text-secondary text-sm">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                    <span className="text-primary font-semibold">{service.price}</span>
                  </div>
                  
                  <p className="text-text-secondary mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 mb-8 flex-1">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={service.buttonHref}
                    className="btn-primary text-center"
                  >
                    {service.buttonText}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Trainer */}
      <section className="container-custom mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
              عن المدرب
            </h2>
            
            <h3 className="text-2xl text-primary font-semibold mb-2">
              {trainer.name}
            </h3>
            <p className="text-text-secondary mb-4">{trainer.title}</p>
            
            <p className="text-text-secondary mb-6 leading-relaxed">
              {trainer.bio}
            </p>
            
            <ul className="space-y-2 mb-6">
              {trainer.credentials.map((credential, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {credential}
                </li>
              ))}
            </ul>
            
            <a
              href={trainer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              تواصل على LinkedIn
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">👨‍💼</span>
                  </div>
                  <p className="text-xl font-cairo font-bold text-text-primary">
                    {trainer.name}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {trainer.title}
                  </p>
                </div>
              </div>
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-surface/50 border-y border-border py-16 md:py-20 mb-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
                آراء عملائنا
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background border border-border rounded-2xl p-6"
                >
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-text-secondary mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.author}</p>
                    <p className="text-text-muted text-sm">{testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section id="booking" className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
              احجز استشارتك
            </h2>
            <p className="text-text-secondary">
              أرسل طلبك وسنتواصل معك خلال 24 ساعة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-primary font-medium mb-2">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-text-primary font-medium mb-2">الجوال</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-text-primary font-medium mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-text-primary font-medium mb-2">الخدمة المطلوبة</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                required
              >
                <option value="">اختر الخدمة</option>
                {services.map((service) => (
                  <option key={service.id} value={service.title}>{service.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-text-primary font-medium mb-2">رسالتك (اختياري)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 py-4"
            >
              <Send className="w-5 h-5" />
              إرسال الطلب
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}
