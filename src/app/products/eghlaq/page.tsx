'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Bell, 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Repeat,
  Target,
  CheckCircle,
  HelpCircle,
  Workflow
} from 'lucide-react'
import { CTASection } from '@/components/cta-section'

const features = [
  {
    icon: Bell,
    title: 'تذكيرات ذكية',
    description: 'تذكيرات تلقائية بالمتابعة في الوقت المناسب',
  },
  {
    icon: Users,
    title: 'إدارة العملاء',
    description: 'قاعدة بيانات متكاملة لجميع عملائك المحتملين',
  },
  {
    icon: TrendingUp,
    title: 'تتبع الصفقات',
    description: 'متابعة كل صفقة من أول تواصل حتى الإغلاق',
  },
  {
    icon: Calendar,
    title: 'جدولة المتابعات',
    description: 'جدول متابعات تلقائي لكل عميل',
  },
  {
    icon: BarChart3,
    title: 'تقارير المبيعات',
    description: 'إحصائيات دقيقة عن أداء فريق المبيعات',
  },
  {
    icon: Repeat,
    title: 'أتمتة المهام',
    description: 'أتمتة المهام المتكررة وتوفير الوقت',
  },
]

const steps = [
  {
    number: '01',
    title: 'إضافة العميل',
    description: 'العميل يُضاف للنظام (يدوياً أو من نظام صقر)',
  },
  {
    number: '02',
    title: 'متابعة تلقائية',
    description: 'رسائل وتذكيرات تلقائية حسب مرحلة العميل',
  },
  {
    number: '03',
    title: 'إغلاق الصفقة',
    description: 'تتبع حتى الإغلاق مع تقارير مفصلة',
  },
]

const plans = [
  {
    name: 'أساسي',
    price: '400',
    period: 'شهرياً',
    description: 'للمكاتب الصغيرة',
    features: [
      'إدارة حتى 200 عميل',
      'متابعات تلقائية أساسية',
      'تقارير شهرية',
      'دعم عبر الإيميل',
    ],
    highlighted: false,
  },
  {
    name: 'متقدم',
    price: '800',
    period: 'شهرياً',
    description: 'للمكاتب المتوسطة',
    features: [
      'كل مميزات الأساسي',
      'إدارة حتى 1,000 عميل',
      'تكامل مع واتساب',
      'تتبع مراحل الصفقات',
      'تقارير أسبوعية',
      'دعم أولوية',
    ],
    highlighted: true,
  },
  {
    name: 'VIP',
    price: '1,500',
    period: 'شهرياً',
    description: 'للمكاتب الكبيرة',
    features: [
      'كل مميزات المتقدم',
      'عملاء غير محدودين',
      'تكامل مع نظام صقر',
      'API للتكامل الخارجي',
      'مدير حساب مخصص',
      'تخصيص كامل',
    ],
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'كيف تتكامل المنصة مع نظام صقر؟',
    a: 'العملاء الذين يأتون من نظام صقر يُنقلون تلقائياً لمنصة إغلاق للمتابعة، مع كل بياناتهم.',
  },
  {
    q: 'هل يمكنني استيراد بيانات العملاء الحاليين؟',
    a: 'نعم، يمكنك استيراد بياناتك من Excel أو أي نظام CRM آخر.',
  },
  {
    q: 'كيف تعمل المتابعات التلقائية؟',
    a: 'تُحدد قواعد المتابعة (مثلاً: إذا لم يرد العميل خلال 3 أيام، أرسل رسالة). النظام ينفذ تلقائياً.',
  },
  {
    q: 'هل المنصة مناسبة لفرق المبيعات؟',
    a: 'نعم، تدعم المنصة تعدد المستخدمين مع صلاحيات مختلفة وتقارير لكل موظف.',
  },
  {
    q: 'ما الفرق بين منصة إغلاق ونظام صقر؟',
    a: 'صقر للرد الآلي وجذب العملاء، إغلاق للمتابعة وإدارة دورة البيع حتى الإغلاق.',
  },
]

const salesStages = [
  { name: 'عميل جديد', color: 'bg-blue-500' },
  { name: 'تواصل أولي', color: 'bg-yellow-500' },
  { name: 'معاينة', color: 'bg-orange-500' },
  { name: 'مفاوضات', color: 'bg-purple-500' },
  { name: 'إغلاق', color: 'bg-green-500' },
]

export default function EghlaqPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cairo font-bold text-text-primary mb-6">
            منصة إغلاق
          </h1>
          <p className="text-xl md:text-2xl text-primary font-semibold mb-4">
            أتمتة متابعة العملاء وإغلاق الصفقات
          </p>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            نظام متكامل لإدارة دورة البيع العقاري من أول تواصل حتى إغلاق الصفقة.
            لا تدع أي عميل يضيع من المتابعة.
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
              كم صفقة ضاعت بسبب نسيان المتابعة؟
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              <span className="text-primary font-bold">80%</span> من الصفقات تحتاج 5 متابعات أو أكثر للإغلاق.
              <br />
              لكن معظم المكاتب تتوقف بعد المتابعة الأولى.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background border border-border rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">44%</div>
                <div className="text-text-secondary text-sm">يستسلمون بعد متابعة واحدة</div>
              </div>
              <div className="bg-background border border-border rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">5+</div>
                <div className="text-text-secondary text-sm">متابعات للإغلاق</div>
              </div>
              <div className="bg-background border border-border rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">تلقائي</div>
                <div className="text-text-secondary text-sm">مع منصة إغلاق</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sales Pipeline Preview */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Workflow className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
            تتبع كل صفقة بوضوح
          </h2>
          <p className="text-text-secondary text-lg">
            اعرف بالضبط أين كل عميل في رحلة الشراء
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {salesStages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-surface border border-border rounded-xl px-6 py-4"
            >
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <span className="text-text-primary font-medium">{stage.name}</span>
              {index < salesStages.length - 1 && (
                <ArrowLeft className="w-4 h-4 text-text-muted mr-2 hidden sm:block" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-surface/30 py-16 md:py-20 mb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
              كيف تعمل المنصة؟
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-background border border-border rounded-2xl p-6 text-center"
              >
                <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-cairo font-bold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-custom mb-20">
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
              className="bg-surface border border-border rounded-xl p-6"
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
      </section>

      {/* Integration with Saqr */}
      <section className="bg-gradient-to-br from-primary/10 to-transparent py-16 md:py-20 mb-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-5xl">🦅</span>
              <span className="text-3xl text-primary">+</span>
              <span className="text-5xl">🎯</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-cairo font-bold text-text-primary mb-4">
              قوة التكامل: صقر + إغلاق
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              نظام صقر يجلب العملاء ويُصفّيهم، ومنصة إغلاق تتابعهم حتى الإغلاق.
              معاً يشكلان نظام مبيعات متكامل.
            </p>
            <Link href="/products/saqr" className="btn-outline inline-flex items-center gap-2">
              تعرف على نظام صقر
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
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
            اختر الخطة المناسبة لحجم فريقك
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
        description="14 يوم تجربة مجانية • لا يُطلب بطاقة ائتمان • إعداد سريع"
        buttonText="ابدأ الآن مجاناً"
        buttonHref="/contact"
        variant="glow"
      />
    </div>
  )
}
