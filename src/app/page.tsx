'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Clock,
  Users,
  Calendar,
  Zap,
  Filter,
  CheckCircle,
  ChevronDown,
  Star,
  Shield,
  Smartphone,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const problems = [
    {
      icon: Clock,
      text: 'عميل راسلك الساعة 2 الفجر وما رديت = راح للمنافس',
    },
    {
      icon: Users,
      text: 'تضيع وقتك مع متصفحين وتفوّت العملاء الجادين',
    },
    {
      icon: Calendar,
      text: 'تنسى تتابع عميل كان جاد = صفقة ضايعة',
    },
  ]

  const solutions = [
    {
      icon: Zap,
      title: 'رد فوري 24/7',
      description: 'يرد على واتساب بالذكاء الاصطناعي حتى أثناء نومك',
    },
    {
      icon: Filter,
      title: 'تصفية تلقائية',
      description: 'يفرز العملاء الجادين من المتصفحين تلقائياً',
    },
    {
      icon: Calendar,
      title: 'جدولة المعاينات',
      description: 'يجدول المواعيد من دون تدخّل منك',
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'ربط واتساب',
      description: 'في 5 دقائق فقط',
    },
    {
      number: '2',
      title: 'تخصيص الردود',
      description: 'حسب عقاراتك وأسلوبك',
    },
    {
      number: '3',
      title: 'استقبل العملاء',
      description: 'الجادين فقط جاهزين للشراء',
    },
  ]

  const testimonials = [
    {
      name: 'عبدالله الغامدي',
      role: 'وسيط عقاري - الرياض',
      text: 'صقر غيّر طريقة شغلي كلياً. صرت أستقبل عملاء جادين بس وأقفل صفقات أكثر بوقت أقل.',
      rating: 5,
    },
    {
      name: 'محمد العتيبي',
      role: 'وسيط عقاري - جدة',
      text: 'كنت أضيع ساعات أرد على رسائل واتساب. الحين صقر يسوي الشغل وأنا أتفرغ للمعاينات.',
      rating: 5,
    },
    {
      name: 'فهد القحطاني',
      role: 'وسيط عقاري - الدمام',
      text: 'أول شهر مع صقر أقفلت 3 صفقات زيادة. الاستثمار يرجع أضعاف.',
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: 'هل يشتغل مع واتساب العادي؟',
      answer: 'نعم! صقر يشتغل مع واتساب العادي وواتساب بزنس. الربط سهل وما يحتاج أي تغيير في رقمك الحالي.',
    },
    {
      question: 'هل أحتاج خبرة تقنية؟',
      answer: 'أبداً. الإعداد كله بخطوات بسيطة ومعاك دعم فني إذا احتجت أي مساعدة. معظم العملاء يبدأون في أقل من 10 دقائق.',
    },
    {
      question: 'هل بياناتي وبيانات عملائي آمنة؟',
      answer: 'طبعاً. نستخدم تشفير من الدرجة البنكية وسيرفراتنا في السعودية. بياناتك ملكك ولا نشاركها مع أي طرف.',
    },
    {
      question: 'كم يستغرق الإعداد؟',
      answer: '5-10 دقائق فقط. تربط واتساب، تضيف عقاراتك، وتخصص أسلوب الرد، فيبدأ صقر العمل فوراً.',
    },
    {
      question: 'ماذا يحدث بعد انتهاء التجربة؟',
      answer: 'بعد 14 يوم، تقدر تستمر بـ 500 ريال/شهر أو تلغي بدون أي التزام. ما نحتاج بطاقة ائتمان للتجربة.',
    },
  ]

  const features = [
    'رد فوري 24/7',
    'تصفية العملاء تلقائياً',
    'جدولة المعاينات',
    'إحصائيات وتقارير',
    'دعم فني متواصل',
    'تحديثات مجانية',
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">ص</span>
            </div>
            <span className="text-white font-bold text-xl">صقر</span>
          </div>
          <Link
            href="/auth/signup"
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            ابدأ مجاناً
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                <Zap className="w-4 h-4" />
                نظام الرد الآلي الذكي للوسطاء العقاريين
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            >
              لا تخسر عميل بسبب
              <span className="text-primary"> رد متأخر </span>
              على واتساب
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              نظام صقر يرد على عملائك فوراً، يصفي الجادين، ويجدول المعاينات حتى أثناء نومك
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white text-lg font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                ابدأ تجربتك المجانية - 14 يوم
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-500 text-sm">
                بدون بطاقة ائتمان - إلغاء في أي وقت
              </p>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
            <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-3xl border border-white/10 p-6 md:p-10">
              {/* Mock WhatsApp Chat */}
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex justify-start">
                  <div className="bg-[#202020] rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                    <p className="text-white text-sm">السلام عليكم، عندكم شقق للبيع في حي النرجس؟</p>
                    <p className="text-gray-500 text-xs mt-1">2:34 AM</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                    <p className="text-white text-sm">وعليكم السلام! أهلاً فيك 👋</p>
                    <p className="text-white text-sm mt-2">نعم عندنا شقق في النرجس. كم ميزانيتك التقريبية؟ وهل تبحث عن شقة جاهزة أو على الخارطة؟</p>
                    <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                      2:34 AM
                      <span className="text-primary">✓✓</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-primary text-sm">
                  <Zap className="w-4 h-4" />
                  <span>رد تلقائي من صقر</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              هل تعاني من هذه المشاكل؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg">
              معظم الوسطاء يخسرون صفقات بسبب هذه الأخطاء
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                  <problem.icon className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-white text-lg">{problem.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              صقر يحل لك كل هذا
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg">
              نظام ذكي يعمل 24/7 لتتفرغ لإقفال الصفقات
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <solution.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{solution.title}</h3>
                <p className="text-gray-400">{solution.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              كيف يعمل صقر؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg">
              3 خطوات بسيطة وتبدأ تستقبل عملاء جادين
            </motion.p>
          </motion.div>

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
                className="text-center relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-l from-primary/50 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold relative z-10">
                  {step.number}
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              وسطاء زيك جربوا صقر
            </motion.h2>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
              <span className="font-bold">أكثر من 200 وسيط يستخدمون صقر</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-[#111] border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-[#0d0d0d]">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              خطة واحدة، كل شيء مشمول
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg">
              بدون خطط معقدة أو رسوم مخفية
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-2 border-primary rounded-3xl p-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Zap className="w-4 h-4" />
              الأكثر شعبية
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold text-white">500</span>
              <span className="text-gray-400 text-xl"> ريال/شهر</span>
            </div>

            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="block w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              ابدأ مجاناً الآن - 14 يوم تجربة
            </Link>

            <p className="text-gray-500 text-sm mt-4">
              بدون بطاقة ائتمان • إلغاء في أي وقت
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              أسئلة شائعة
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-[#111] border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-right"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/20 to-orange-600/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              جاهز تبدأ؟
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg mb-8">
              انضم لأكثر من 200 وسيط عقاري يستخدمون صقر كل يوم
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-orange-600 text-white text-lg font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                ابدأ تجربتك المجانية - 14 يوم
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold">ص</span>
            </div>
            <span className="text-white font-bold">نظام صقر</span>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2026 مسار العقار. جميع الحقوق محفوظة.
          </p>
          
          <a
            href="https://wa.me/966501234567"
            className="text-gray-400 hover:text-primary transition-colors text-sm"
          >
            تواصل معنا
          </a>
        </div>
      </footer>
    </div>
  )
}
