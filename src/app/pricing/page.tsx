'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getSubscriptionPlans, type SubscriptionPlan } from '@/lib/payments'
import { getCurrentUser } from '@/lib/auth'

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // Get plans
        const plansData = await getSubscriptionPlans()
        setPlans(plansData)
      } catch (error) {
        console.error('Error loading plans:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSelectPlan = (planName: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    if (planName === 'free') {
      // Free plan - direct upgrade
      router.push('/dashboard/settings')
    } else {
      // Paid plan - go to payment page
      router.push(`/subscribe?plan=${planName}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface">
      {/* Header */}
      <div className="pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 font-cairo">
            اختر خطتك المناسبة
          </h1>
          <p className="text-xl text-gray-400">
            ابدأ مع خطة مجانية أو ارقَ إلى خطة متقدمة
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="container max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border transition-all duration-300 ${
                  selectedPlan === plan.name
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-border hover:border-primary/50 bg-surface'
                }`}
              >
                {/* Most Popular Badge */}
                {plan.name === 'pro' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                      الأكثر شيوعاً
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2 font-cairo">
                    {plan.name === 'free' && 'مجاني'}
                    {plan.name === 'basic' && 'أساسي'}
                    {plan.name === 'pro' && 'احترافي'}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">
                        {plan.price_sar || 'مجاني'}
                      </span>
                      {plan.price_sar && (
                        <span className="text-gray-400">ريال سعودي/شهر</span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mb-8 ${
                      selectedPlan === plan.name
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {plan.name === 'free' ? 'ابدأ مجاناً' : 'اختر الخطة'}
                  </button>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features && plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}

                    {/* Limits */}
                    <div className="pt-4 border-t border-border mt-4">
                      {plan.max_properties && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">عدد العقارات:</span>
                          <span className="text-white font-semibold">{plan.max_properties}</span>
                        </div>
                      )}
                      {plan.max_leads && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">عدد العملاء:</span>
                          <span className="text-white font-semibold">{plan.max_leads}</span>
                        </div>
                      )}
                      {plan.max_storage_gb && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">التخزين:</span>
                          <span className="text-white font-semibold">{plan.max_storage_gb} GB</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="bg-surface/50 py-16 border-t border-border">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center font-cairo">
            الأسئلة الشائعة
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'هل يمكنني التحديث أو تغيير الخطة؟',
                a: 'نعم، يمكنك تغيير خطتك في أي وقت من إعدادات حسابك.',
              },
              {
                q: 'كيف أدفع الثمن؟',
                a: 'نحن نقبل تحويلات بنكية مباشرة. ستتلقى تفاصيل البنك بعد اختيار الخطة.',
              },
              {
                q: 'هل هناك استرداد للأموال؟',
                a: 'نعم، يمكنك الحصول على استرداد كامل خلال أول 30 يوماً من الاشتراك.',
              },
              {
                q: 'هل الخطة المجانية حقاً مجانية؟',
                a: 'نعم تماماً! الخطة المجانية توفر جميع الميزات الأساسية بدون أي تكاليف.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-background/50 p-6 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-3 font-cairo">
                  {faq.q}
                </h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
