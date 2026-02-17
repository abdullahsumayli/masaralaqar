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
  HelpCircle
} from 'lucide-react'
import { CTASection } from '@/components/cta-section'

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
    description: 'للمكاتب الكبيرة',
    features: [
      'كل مميزات المتقدم',
      'محادثات غير محدودة',
      'تخصيص كامل',
      'تكامل API',
      'مدير حساب مخصص',
      'تدريب الفريق',
    ],
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'كم يستغرق تفعيل النظام؟',
    a: 'التفعيل يتم خلال 24-48 ساعة فقط. فريقنا يقوم بكل الإعدادات نيابة عنك.',
  },
  {
    q: 'هل يعمل مع رقم واتساب الحالي؟',
    a: 'نعم، يمكن ربط النظام برقم واتساب بزنس الحالي الخاص بمكتبك.',
  },
  {
    q: 'هل يمكنني تخصيص الردود؟',
    a: 'نعم، يمكنك تخصيص كل الردود لتتناسب مع أسلوب مكتبك ونوع العقارات.',
  },
  {
    q: 'ماذا يحدث إذا تجاوزت عدد المحادثات؟',
    a: 'نتواصل معك للترقية. لن يتوقف النظام فجأة.',
  },
  {
    q: 'هل يمكن إلغاء الاشتراك في أي وقت؟',
    a: 'نعم، يمكنك الإلغاء في أي وقت بدون رسوم إضافية.',
  },
]

export default function SaqrPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="text-6xl mb-6">🦅</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cairo font-bold text-text-primary mb-6">
            نظام صقر
          </h1>
          <p className="text-xl md:text-2xl text-primary font-semibold mb-4">
            نظام الرد الآلي الذكي للمكاتب العقارية
          </p>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            يرد على عملائك فوراً على واتساب، يُصفّي الجادين من المتصفحين، 
            ويُجدول المعاينات تلقائياً - وأنت مرتاح.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2 text-lg">
              ابدأ تجربتك المجانية
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="#pricing" className="btn-outline inline-flex items-center gap-2">
              شاهد الأسعار
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="bg-surface/50 border-y border-border py-16 md:py-20 mb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-6">
              كم عميل ضاع منك بسبب التأخر في الرد؟
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              الدراسات تُظهر أن <span className="text-primary font-bold">60%</span> من العملاء 
              يتحولون للمنافس إذا لم يحصلوا على رد خلال ساعة واحدة.
              <br />
              السؤال: كم ساعة يستغرق مكتبك للرد عادةً؟
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background border border-border rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">60%</div>
                <div className="text-text-secondary text-sm">عملاء يذهبون للمنافس</div>
              </div>
              <div className="bg-background border border-border rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">5 دقائق</div>
                <div className="text-text-secondary text-sm">متوسط توقع الرد</div>
              </div>
              <div className="bg-background border border-border rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">فوري</div>
                <div className="text-text-secondary text-sm">مع نظام صقر</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
            كيف يعمل نظام صقر؟
          </h2>
          <p className="text-text-secondary text-lg">
            ثلاث خطوات بسيطة لتحويل استفسارات واتساب إلى مواعيد حقيقية
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-surface border border-border rounded-2xl p-6 text-center"
            >
              <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
              <h3 className="text-xl font-cairo font-bold text-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-text-secondary">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2">
                  <ArrowLeft className="w-8 h-8 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-surface/30 py-16 md:py-20 mb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
              المميزات
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-background border border-border rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-cairo font-bold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
            خطط الأسعار
          </h2>
          <p className="text-text-secondary text-lg">
            اختر الخطة المناسبة لحجم مكتبك
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-8 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary glow-border'
                  : 'bg-surface border border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 right-6 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                  الأكثر طلباً
                </div>
              )}
              <h3 className="text-xl font-cairo font-bold text-text-primary mb-1">
                {plan.name}
              </h3>
              <p className="text-text-secondary text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                <span className="text-text-secondary mr-1">ريال/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-text-secondary text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-background border border-border text-text-primary hover:border-primary hover:text-primary'
                }`}
              >
                ابدأ الآن
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
            الأسئلة الشائعة
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <h3 className="font-cairo font-bold text-text-primary mb-2">{faq.q}</h3>
              <p className="text-text-secondary">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="ابدأ تجربتك المجانية اليوم"
        description="14 يوم تجربة مجانية • لا يُطلب بطاقة ائتمان • إعداد خلال 24 ساعة"
        buttonText="ابدأ الآن مجاناً"
        buttonHref="/contact"
        variant="glow"
      />
    </div>
  )
}
