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
  Target,
  Award,
  Shield,
  TrendingUp,
  Clock,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
}

const services = [
  { icon: Brain, title: 'الذكاء الاصطناعي', description: 'أتمتة الردود وروبوتات تسويق ذكية', color: 'from-orange-500 to-orange-600' },
  { icon: Building2, title: 'الوساطة العقارية', description: 'بيع وشراء وتأجير العقارات', color: 'from-amber-500 to-yellow-500' },
  { icon: GraduationCap, title: 'التدريب الاحترافي', description: 'دورات وورش عمل للوسطاء', color: 'from-orange-400 to-amber-500' },
  { icon: BarChart3, title: 'التحليلات', description: 'تقارير وأداء السوق العقاري', color: 'from-yellow-500 to-orange-500' },
]

const features = [
  { icon: MessageSquare, text: 'رد آلي 24/7', desc: 'يرد على عملاءك فوراً بدون تأخير' },
  { icon: Users, text: 'إدارة العملاء', desc: 'نظام CRM متكامل وذكي' },
  { icon: BarChart3, text: 'تحليلات ذكية', desc: 'تتبع أداء مبيعاتك لحظةً بلحظة' },
  { icon: Zap, text: 'أتمتة التسويق', desc: 'حملات تلقائية متعددة القنوات' },
]

const testimonials = [
  { name: 'أحمد محمد', role: 'مدير مكتب عقاري', avatar: 'أح', text: 'نظام صقر وفّر علي أكثر من 5 ساعات يومياً. الآن الرد على العملاء يكون فورياً وأجدادهم مصنفين تلقائياً.', rating: 5, company: 'مكتب الأهلي للعقار' },
  { name: 'سارة علي', role: 'وسيط عقاري', avatar: 'س', text: 'أفضل استثمار قدمته لمكتبي. نسبة تحويل العميل زادت 40% في أول شهرين فقط.', rating: 5, company: 'سارة للعقارات' },
  { name: 'خالد عمر', role: 'مالك شركة', avatar: 'خ', text: 'فريق مسار العقار محترف جداً. الدعم الفني متوفر دائماً والخدمة تفوق التوقعات.', rating: 5, company: 'شركة عمر العقارية' },
]

const stats = [
  { value: '+500', label: 'مكتب عقاري', icon: Building2 },
  { value: '+1,000', label: 'صفقة ناجحة', icon: TrendingUp },
  { value: '+2,500', label: 'متدرب', icon: Users },
  { value: '5+', label: 'سنوات خبرة', icon: Award },
]

const whyUs = [
  { title: 'سرعة الرد', desc: 'رد آلي فوري على مدار الساعة 24/7', icon: Zap },
  { title: 'تصفية ذكية', desc: 'تصنيف العملاء حسب درجة الجدّية', icon: Target },
  { title: 'تكامل كامل', desc: 'ربط سلس مع واتساب وجميع المنصات', icon: BarChart3 },
  { title: 'دعم سعودي', desc: 'فريق دعم محلي متاح على مدار الساعة', icon: Shield },
]

const navLinks = [
  { href: '/products/saqr', label: 'نظام صقر' },
  { href: '/services', label: 'الخدمات' },
  { href: '/products/pricing', label: 'الأسعار' },
  { href: '/blog', label: 'المدونة' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/966545374069"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        aria-label="تواصل عبر واتساب"
      >
        <MessageSquare className="w-7 h-7 text-white" />
      </motion.a>

      {/* ── Sticky Header ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-border py-3' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-cairo font-bold text-lg text-text-primary hidden sm:block">مسار العقار</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-all font-medium text-sm">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-text-secondary hover:text-primary transition-colors font-medium text-sm">
              دخول النظام
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary hover:text-white transition-all">
              <Play className="w-3.5 h-3.5" />
              عرض تجريبي
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
              <Phone className="w-4 h-4" />
              تواصل معنا
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-text-primary hover:bg-surface transition-colors"
            aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
          className="lg:hidden overflow-hidden bg-white border-t border-border"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-text-secondary hover:text-primary hover:bg-surface transition-all font-medium">
                {link.label}
              </Link>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2">
              <Link href="/demo" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary rounded-xl font-semibold text-sm">
                عرض تجريبي
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold text-sm">
                تواصل معنا
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-secondary/4 pointer-events-none" />
        <div className="absolute top-24 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center max-w-4xl mx-auto">

            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-8 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              الحل الشامل للمكاتب العقارية في السعودية
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 tracking-tight">
              لا <span className="text-primary">تخسر عميلاً</span> بسبب
              <br className="hidden sm:block" />
              <span className="text-secondary"> رد متأخر</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
              نظام <strong className="text-text-primary">صقر</strong> يرد على عملاءك فوراً على واتساب، يصنّف الجادّين تلقائياً، ويجدول المعاينات — وأنت مرتاح. جربه <strong className="text-primary">مجاناً 14 يوم</strong>.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link href="/products/saqr" className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-base font-bold rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
                جرب صقر مجاناً
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link href="/demo" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-border text-text-primary text-base font-bold rounded-xl hover:border-primary hover:text-primary transition-all hover:-translate-y-0.5">
                <Play className="w-5 h-5 text-primary" />
                شاهد كيف يعمل
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 text-text-secondary text-sm">
              {['تجربة مجانية 14 يوم', 'بدون بطاقة ائتمان', 'إلغاء في أي وقت'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-10 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-text-secondary text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-14">
            <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">خدماتنا</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">ما يميزنا عن غيرنا</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => (
              <motion.div key={i} variants={fadeInUp} className="group bg-white border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-14">
            <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">لماذا مسار العقار؟</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-3">مميزات لن تجدها في مكان آخر</motion.h2>
            <motion.p variants={fadeInUp} className="text-text-secondary max-w-xl mx-auto">صُمّم نظام صقر خصيصاً للسوق العقاري السعودي بفهم عميق لاحتياجاتك</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 text-center border border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Saqr Product ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary via-primary to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 text-white rounded-full text-sm font-semibold mb-6 border border-white/20">
                <Rocket className="w-4 h-4" />
                منتجنا الرئيسي
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                نظام صقر لإدارة<br />العمل العقاري
              </h2>
              <p className="text-white/85 text-lg leading-relaxed mb-8">
                نظام متكامل مدعوم بالذكاء الاصطناعي يساعدك على تحويل مكتبك العقاري إلى آلة مبيعات ذكية تعمل 24/7.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-10">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-0.5">{feature.text}</div>
                      <div className="text-white/65 text-xs">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/products/saqr" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg">
                  جرب مجاناً 14 يوم
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Link href="/demo" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                  <Play className="w-5 h-5" />
                  شاهد العرض
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div variants={fadeInUp} className="relative">
              <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  <div className="flex-1 mx-3 h-7 bg-white/10 rounded-lg flex items-center px-3">
                    <span className="text-white/40 text-xs">dashboard.masaralaqar.com</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary text-sm">لوحة صقر الذكية</div>
                      <div className="text-xs text-green-500 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />
                        متصل ونشط
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'عملاء جدد', val: '+28', color: 'bg-blue-50 text-blue-700' },
                      { label: 'صفقات', val: '+12', color: 'bg-green-50 text-green-700' },
                      { label: 'رضا العملاء', val: '98%', color: 'bg-orange-50 text-orange-700' },
                    ].map((s, i) => (
                      <div key={i} className={`${s.color} rounded-xl p-2.5 text-center`}>
                        <div className="font-bold text-sm">{s.val}</div>
                        <div className="text-xs opacity-80 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {['رد تلقائي — أحمد محمد', 'موعد معاينة — غداً 4م', 'عميل جديد — سارة علي'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-xs text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-14">
            <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">آراء عملائنا</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">ماذا يقول عملاؤنا؟</motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="bg-white border border-border rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-text-secondary leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-text-muted">{t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-secondary via-secondary to-secondary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Clock className="w-4 h-4" />
              العرض محدود — جرب مجاناً الآن
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              ابدأ تحوّلك الرقمي اليوم
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/85 text-lg mb-10 max-w-xl mx-auto">
              انضم لأكثر من <strong className="text-white">500 مكتب عقاري</strong> يستخدمون نظام صقر لتنمية أعمالهم
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/966545374069" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-secondary text-base font-bold rounded-xl hover:bg-white/90 transition-colors shadow-xl">
                <MessageSquare className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
              <Link href="/products/saqr" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white text-base font-bold rounded-xl hover:bg-white/10 transition-colors">
                جرب مجاناً
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-14 px-4 bg-text-primary text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">مسار العقار</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                منصتك الشاملة للعقار والتقنية في المملكة العربية السعودية.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white/90">روابط سريعة</h4>
              <ul className="space-y-2.5 text-white/60 text-sm">
                <li><Link href="/products/saqr" className="hover:text-white transition-colors">نظام صقر</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">خدماتنا</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">المدونة</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">المكتبة</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white/90">الشركة</h4>
              <ul className="space-y-2.5 text-white/60 text-sm">
                <li><Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white/90">تواصل معنا</h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span dir="ltr">+966 54 537 4069</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:info@masaralaqar.com" className="hover:text-white transition-colors">info@masaralaqar.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>المملكة العربية السعودية</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-white/40 text-sm">
            <p>© {new Date().getFullYear()} مسار العقار. جميع الحقوق محفوظة.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white/70 transition-colors">سياسة الخصوصية</Link>
              <Link href="/terms" className="hover:text-white/70 transition-colors">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
