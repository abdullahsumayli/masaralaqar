'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MessageCircle, 
  Clock, 
  Users, 
  Calendar, 
  BarChart3, 
  Shield,
  Zap,
  CheckCircle,
  HelpCircle,
  Building2,
  Phone,
  Play,
  Star,
  Bot,
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const features = [
  {
    icon: MessageCircle,
    title: 'رد فوري 24/7',
    description: 'يرد على عملائك في أي وقت، حتى في الليل وعطلة نهاية الأسبوع',
  },
  {
    icon: Users,
    title: 'تصفية ذكية',
    description: 'يفرز العملاء الجادين من المتصفحين بالذكاء الاصطناعي',
  },
  {
    icon: Calendar,
    title: 'جدولة تلقائية',
    description: 'يحجز مواعيد المعاينات تلقائياً في تقويمك',
  },
  {
    icon: BarChart3,
    title: 'تقارير مفصلة',
    description: 'إحصائيات وتحليلات عن أداء الردود والتحويلات',
  },
  {
    icon: Shield,
    title: 'أمان تام',
    description: 'بياناتك ومحادثاتك مشفرة ومحمية بالكامل',
  },
  {
    icon: Zap,
    title: 'تكامل سلس',
    description: 'يتكامل مع أنظمتك الحالية وواتساب بسهولة',
  },
]

const steps = [
  {
    number: '01',
    title: 'استقبال الرسالة',
    description: 'العميل يرسل استفساره على واتساب',
  },
  {
    number: '02',
    title: 'تحليل وتصفية',
    description: 'النظام يفهم الطلب ويحدد مدى جدية العميل',
  },
  {
    number: '03',
    title: 'رد ذكي وجدولة',
    description: 'رد مخصص + حجز موعد المعاينة تلقائياً',
  },
]

const plans = [
  {
    name: 'أساسي',
    price: '500',
    period: 'شهرياً',
    description: 'للمكاتب الصغيرة',
    features: [
      'رد آلي على واتساب',
      'حتى 500 محادثة/شهر',
      'تقارير أساسية',
      'دعم عبر الإيميل',
    ],
    highlighted: false,
  },
  {
    name: 'متقدم',
    price: '1,000',
    period: 'شهرياً',
    description: 'للمكاتب المتوسطة',
    features: [
      'كل مميزات الأساسي',
      'حتى 2,000 محادثة/شهر',
      'تصفية ذكية بـ AI',
      'جدولة المعاينات',
      'تقارير متقدمة',
      'دعم أولوية',
    ],
    highlighted: true,
  },
  {
    name: 'VIP',
    price: '2,500',
    period: 'شهرياً',
    description: 'للشركات الكبيرة',
    features: [
      'كل مميزات المتقدم',
      'محادثات غير محدودة',
      'تخصيص كامل',
      'API مفتوح',
      'مدير حساب مخصص',
      'دعم 24/7',
    ],
    highlighted: false,
  },
]

const faqs = [
  {
    question: 'ما هو نظام صقر؟',
    answer: 'نظام صقر هو مساعد ذكي للوسطاء العقاريين يعمل بالذكاء الاصطناعي. يرد على استفسارات العملاء تلقائياً عبر واتساب، يصفيهم حسب جديتهم، ويجدول المعاينات دون تدخل منك.',
  },
  {
    question: 'كم يستغرق تفعيل النظام؟',
    answer: 'يمكنك البدء في استخدام النظام خلال 24 ساعة من التسجيل. فريقنا سيساعدك في الإعداد والتخصيص.',
  },
  {
    question: 'هل يمكنني تجربته قبل الاشتراك؟',
    answer: 'نعم، نقدم تجربة مجانية لمدة 14 يوماً بدون بطاقة ائتمانية.',
  },
  {
    question: 'هل بياناتي آمنة؟',
    answer: 'بالتأكيد. جميع البيانات مشفرة ومخزنة بشكل آمن. نلتزم بأعلى معايير الأمان وحماية الخصوصية.',
  },
]

const testimonials = [
  {
    name: 'عبدالرحمن الغامدي',
    role: 'وسيط عقاري - الرياض',
    content: 'صقر وفّر علي ساعات يومياً كنت أضيعها في الرد على استفسارات. الآن أركز فقط على العملاء الجادين.',
    rating: 5,
  },
  {
    name: 'نورة العتيبي',
    role: 'مديرة مكتب عقاري - جدة',
    content: 'زادت صفقاتنا 40% بعد استخدام صقر. العملاء يحصلون على رد فوري والمعاينات تُجدول تلقائياً.',
    rating: 5,
  },
  {
    name: 'محمد الشهري',
    role: 'مستثمر عقاري - الدمام',
    content: 'أفضل استثمار عملته لعملي العقاري. الرد السريع يخلي العملاء يثقون فينا أكثر.',
    rating: 5,
  },
]

export default function SaqrPage() {
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

            <Link href="/services" className="text-text-secondary hover:text-primary transition-colors">الخدمات</Link>
            <Link href="/contact" className="text-text-secondary hover:text-primary transition-colors">تواصل معنا</Link>
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Bot className="w-4 h-4" />
              نظام صقر
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              مساعدك الذكي
              <br />
              <span className="text-primary">يرد ويصفي ويجدول</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              لا تخسر عملاء بسبب تأخر الرد. صقر يرد على استفسارات عملائك 24/7، 
              يصفي الجادين منهم، ويجدول المعاينات تلقائياً.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors text-lg"
              >
                جرب مجاناً 14 يوم
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors text-lg"
              >
                <Play className="w-5 h-5" />
                شاهد العرض التوضيحي
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mt-16">
              {[
                { value: '+500', label: 'وسيط يستخدم صقر' },
                { value: '+50,000', label: 'محادثة شهرياً' },
                { value: '< 3 ثواني', label: 'متوسط وقت الرد' },
                { value: '+40%', label: 'زيادة في الصفقات' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">كيف يعمل صقر؟</h2>
            <p className="text-text-secondary text-lg">ثلاث خطوات بسيطة لتحويل استفساراتك إلى صفقات</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative text-center p-8 bg-white rounded-2xl border border-border"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.number}</div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-x-1/2 text-primary">
                    <ArrowLeft className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">مميزات نظام صقر</h2>
            <p className="text-text-secondary text-lg">كل ما تحتاجه لإدارة عملائك بكفاءة</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-white border border-border rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ماذا يقول عملاؤنا؟</h2>
            <p className="text-text-secondary text-lg">قصص نجاح حقيقية من وسطاء يستخدمون صقر</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white border border-border rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-text-secondary mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-text-muted text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">باقات الاشتراك</h2>
            <p className="text-text-secondary text-lg">اختر الباقة المناسبة لحجم عملك</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-primary text-white ring-4 ring-primary/30 scale-105'
                    : 'bg-white border border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                      الأكثر طلباً
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/70' : 'text-text-muted'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">ر.س {plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-text-muted'}`}>
                    /{plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${plan.highlighted ? 'text-secondary' : 'text-green-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`w-full block text-center py-3 rounded-xl font-bold transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-primary hover:bg-white/90'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  ابدأ التجربة المجانية
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الأسئلة الشائعة</h2>
            <p className="text-text-secondary text-lg">إجابات على الأسئلة الأكثر تكراراً</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-border rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">{faq.question}</h3>
                    <p className="text-text-secondary">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جاهز لتحويل طريقة عملك؟
            </h2>
            <p className="text-white/80 text-lg mb-10">
              ابدأ تجربتك المجانية اليوم واكتشف كيف يمكن لصقر مساعدتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary-dark transition-colors"
              >
                جرب مجاناً 14 يوم
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                تواصل معنا
              </Link>
            </div>
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
