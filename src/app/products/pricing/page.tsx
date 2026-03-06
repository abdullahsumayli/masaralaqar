'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, MessageCircle, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  getPlanPrice,
  getPlanNameArabic,
  getBotWhatsAppLink,
  getDefaultWhatsAppMessage,
} from '@/lib/bot'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const plans = [
  {
    type: 'free' as const,
    icon: MessageCircle,
    description: 'للتجربة والاختبار',
    features: [
      '10 رسائل كل شهر',
      'دعم العملاء الأساسي',
      'رد سريع على الاستفسارات',
      'إحصائيات بسيطة',
    ],
    notIncluded: ['تقارير مفصلة', 'تكامل API', 'دعم الأولوية'],
  },
  {
    type: 'basic' as const,
    icon: Zap,
    description: 'للعقاريين الناشئين',
    features: [
      '100 رسالة كل شهر',
      'دعم متقدم',
      'تقارير شهرية',
      'تحليل سلوك العملاء',
      'ردود مخصصة',
    ],
    notIncluded: ['تكامل API', 'دعم الأولوية'],
    popular: true,
  },
  {
    type: 'pro' as const,
    icon: Crown,
    description: 'للشركات والفريق',
    features: [
      'رسائل غير محدودة',
      'دعم الأولوية 24/7',
      'تقارير مفصلة',
      'تكامل API كامل',
      'إدارة متعددة المستخدمين',
      'تحليل متقدم',
    ],
    notIncluded: [],
  },
]

export function PricingPlans() {
  const botPhone = process.env.NEXT_PUBLIC_BOT_WHATSAPP_NUMBER || '966XXXXXXXXX'

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <motion.div
          className="text-center"
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            اختر الخطة المناسبة لك
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            ابدأ مجاناً وارقِ عندما تكون جاهزاً
          </p>

          {/* Monthly/Annual Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className="text-gray-400">شهري</span>
            <button className="relative inline-flex items-center w-14 h-7 bg-gray-700 rounded-full">
              <span className="absolute w-6 h-6 bg-primary rounded-full transition-all" />
            </button>
            <span className="text-gray-400">سنوي - 20% خصم</span>
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const price = getPlanPrice(plan.type as any)
            const planName = getPlanNameArabic(plan.type as any)

            return (
              <motion.div
                key={plan.type}
                variants={fadeInUp}
                className={`relative ${plan.popular ? 'md:scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1 rounded-full text-sm font-semibold">
                      الخيار الشهير
                    </span>
                  </div>
                )}

                <Card
                  className={`relative h-full flex flex-col p-8 ${
                    plan.popular
                      ? 'border-orange-500/50 bg-gradient-to-b from-gray-800/50 to-gray-900'
                      : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50'
                  } transition-all duration-300`}
                >
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-lg ${
                        plan.popular
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{planName}</h3>
                      <p className="text-sm text-gray-400">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{price}</span>
                      <span className="text-gray-400">ر.س / شهر</span>
                    </div>
                    {plan.type === 'free' && (
                      <p className="text-sm text-gray-500 mt-2">
                        مجاني للأبد، لا تحتاج بطاقة ائتمان
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}

                    {/* Not Included */}
                    {plan.notIncluded.length > 0 && (
                      <div>
                        <div className="border-t border-gray-700 my-4" />
                        {plan.notIncluded.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3 opacity-50"
                          >
                            <div className="w-5 h-5 text-gray-600 flex-shrink-0">
                              ✕
                            </div>
                            <span className="text-gray-500">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {plan.type === 'free' ? (
                    <Button
                      asChild
                      className={`w-full ${
                        plan.popular
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <a href={getBotWhatsAppLink(botPhone, getDefaultWhatsAppMessage(plan.type))}>
                        <MessageCircle className="w-4 h-4 ml-2" />
                        ابدأ الآن
                      </a>
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        asChild
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        <a
                          href={getBotWhatsAppLink(
                            botPhone,
                            getDefaultWhatsAppMessage(plan.type)
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-4 h-4 ml-2" />
                          اتصل الآن
                        </a>
                      </Button>
                      <p className="text-xs text-gray-500 text-center mt-2">
                        أو{' '}
                        <Link
                          href="/login"
                          className="text-orange-400 hover:text-orange-300"
                        >
                          قم بتسجيل الدخول
                        </Link>
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div
        className="max-w-4xl mx-auto px-4 mt-24"
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          الأسئلة الشائعة
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'هل يمكنني تبديل الخطة لاحقاً؟',
              a: 'نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. سيتم حساب الفرق تلقائياً.',
            },
            {
              q: 'ماذا يحدث إذا استنفدت حد الرسائل الشهري؟',
              a: 'يمكنك الترقية إلى خطة أعلى، أو سيتم إعادة تعيين الحد في بداية الشهر التالي.',
            },
            {
              q: 'هل هناك تجربة مجانية للخطط المدفوعة؟',
              a: 'نعم، ابدأ بالخطة المجانية واطلب النقل إلى خطة مدفوعة عندما تكون جاهزاً.',
            },
            {
              q: 'ما طرق الدفع المقبولة؟',
              a: 'نقبل التحويلات البنكية. تواصل معنا عبر الواتساب لمزيد من المعلومات.',
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold">{faq.q}</span>
                <span className="text-gray-400 group-open:text-orange-400 transition-colors">
                  +
                </span>
              </summary>
              <p className="mt-3 text-gray-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PricingPlans
