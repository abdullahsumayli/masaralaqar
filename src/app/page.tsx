'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Building2,
  Brain,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Zap,
  Users,
  Rocket,
  Star,
  Play,
  ChevronRight,
  Sparkles,
  Target,
  Clock,
  Award,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const services = [
  {
    icon: Brain,
    title: 'الذكاء الاصطناعي',
    description: 'أتمتة الردود وروبوتات تسويق ذكية',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Building2,
    title: 'الوساطة العقارية',
    description: 'بيع وشراء وتأجير العقارات',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    icon: GraduationCap,
    title: 'التدريب الاحترافي',
    description: 'دورات وورش عمل للوسطاء',
    color: 'from-orange-400 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'التحليلات',
    description: 'تقارير وأداء السوق العقاري',
    color: 'from-yellow-500 to-orange-500',
  },
]

const features = [
  { icon: MessageSquare, text: 'رد آلي 24/7', desc: 'يرد على عملاءك فوراً' },
  { icon: Users, text: 'إدارة العملاء', desc: 'نظام متكامل لـ CRM' },
  { icon: BarChart3, text: 'تحليلات ذكية', desc: 'تتبع أداء مبيعاتك' },
  { icon: Zap, text: 'أتمتة التسويق', desc: 'حملات تلقائية متعددة' },
]

const testimonials = [
  {
    name: 'أحمد محمد',
    role: 'مدير مكتب عقاري',
    image: 'أح',
    text: 'نظام صقر وفّر علي أكثر من 5 ساعات يومياً. الآن الرد على العملاء يكون فورياً وأجدادهم مصنفين تلقائياً.',
    rating: 5,
    company: 'مكتب الأهلي للعقار',
  },
  {
    name: 'سارة علي',
    role: 'وسيط عقاري',
    image: 'س',
    text: 'أفضل استثمار قدمته لمكتبي. نسبة تحويل العميل زادت 40% في أول شهرين.',
    rating: 5,
    company: 'سارة للعقارات',
  },
  {
    name: 'خالد عمر',
    role: 'مالك شركة',
    image: 'خ',
    text: 'فريق مسار العقار محترف جداً. الدعم الفني متوفر والخدمة ممتازة.',
    rating: 5,
    company: 'شركة عمر العقارية',
  },
]

const stats = [
  { value: '+500', label: 'عميل سعيد' },
  { value: '+1,000', label: 'صفقة ناجحة' },
  { value: '+2,500', label: 'متدرب' },
  { value: '5+', label: 'سنوات خبرة' },
]

const whyUs = [
  { title: 'سرعة الرد', desc: 'رد آلي فوري على مدار الساعة', icon: Zap },
  { title: 'تصفية ذكية', desc: 'تصنيف العملاء حسب درجة الجدّية', icon: Target },
  { title: 'تكامل كامل', desc: 'ربط مع واتساب وجميع المنصات', icon: BarChart3 },
  { title: 'دعم متواصل', desc: 'فريق دعم سعودي متاح دائماً', icon: Award },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/966545374069"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-8 h-8 text-white" />
      </motion.a>

      {/* Header - Sticky */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/98 shadow-md py-3' : 'bg-white/95 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-primary font-bold text-xl block leading-tight">مسار العقار</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/products/saqr" className="text-text-secondary hover:text-primary transition-colors font-medium">نظام صقر</Link>
            <Link href="/services" className="text-text-secondary hover:text-primary transition-colors font-medium">الخدمات</Link>

            <Link href="/blog" className="text-text-secondary hover:text-primary transition-colors font-medium">المدونة</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              <Play className="w-4 h-4" />
              عرض تجريبي
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">تواصل معنا</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              الحل الشامل للمكاتب العقارية
            </motion.span>
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              لا<span className="text-primary"> تخسر عميل</span> بسبب
              <span className="text-secondary"> رد متأخر</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
              نظام صقر يرد على عملاءك فوراً على واتساب، يصفي الجادين، ويجدول المعاينات - وأنت نايم. جربه مجاناً 14 يوم.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products/saqr"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
              >
                جرب صقر مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-primary text-primary text-lg font-bold rounded-xl hover:bg-primary hover:text-white transition-colors"
              >
                <Play className="w-5 h-5" />
                شاهد العرض
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center gap-8 text-text-secondary">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>تجربة مجانية 14 يوم</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>بدون بطاقة ائتمان</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Quick View */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white border border-border rounded-2xl p-6 hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-text-secondary text-sm">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              لماذا مسار العقار؟
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              مميزات نظام صقر
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center border border-border"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Saqr Product Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
                ⭐ منتجنا الرئيسي
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                نظام صقر لإدارة العمل العقاري
              </h2>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                نظام متكامل مدعوم بالذكاء الاصطناعي يساعدك في:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/10 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-bold">{feature.text}</div>
                      <div className="text-white/70 text-sm">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products/saqr"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-colors"
                >
                  جرب مجاناً 14 يوم
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  شاهد العرض
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="bg-white rounded-xl p-5 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary text-lg">نظام صقر</div>
                      <div className="text-sm text-text-secondary">لوحة التحكم الذكية</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-4/5"></div>
                    <div className="h-4 bg-gray-100 rounded-full w-3/5"></div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="bg-green-100 text-green-700 text-xs font-bold py-2 rounded-lg text-center">+120 عميل</div>
                      <div className="bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded-lg text-center">+85 صفقة</div>
                      <div className="bg-orange-100 text-orange-700 text-xs font-bold py-2 rounded-lg text-center">+95% رضا</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
              آراء عملائنا
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              ماذا يقول عملاؤنا؟
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-border rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-text-secondary mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{testimonial.image}</span>
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
              ابدأ تحولتك الرقمية الآن
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/90 text-lg mb-8">
              انضم لأكثر من 500 مكتب عقاري يستخدمون نظام صقر
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/966545374069"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-secondary text-lg font-bold rounded-xl hover:bg-white/90 transition-colors"
              >
                <MessageSquare className="w-6 h-6" />
                تواصل عبر واتساب
              </a>
              <Link
                href="/products/saqr"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/50 text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                جرب مجاناً
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-primary text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg">مسار العقار</span>
              </div>
              <p className="text-white/80 text-sm">
                منصتك الشاملة للعقار والتقنية في المملكة العربية السعودية.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/products/saqr" className="hover:text-white transition-colors">نظام صقر</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">خدماتنا</Link></li>

                <li><Link href="/blog" className="hover:text-white transition-colors">المدونة</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link href="/services#ai" className="hover:text-white transition-colors">الذكاء الاصطناعي</Link></li>
                <li><Link href="/services#brokerage" className="hover:text-white transition-colors">الوساطة العقارية</Link></li>
                <li><Link href="/services#training" className="hover:text-white transition-colors">التدريب</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span dir="ltr">+966 54 537 4069</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@masaralaqar.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>السعودية</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2026 مسار العقار. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
