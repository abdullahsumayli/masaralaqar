'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Loader, ArrowRight } from 'lucide-react'
import { getSubscriptionPlan, submitBankTransfer, createUserSubscription, createInvoice } from '@/lib/payments'
import { getCurrentUser } from '@/lib/auth'
import type { SubscriptionPlan } from '@/lib/payments'

export default function SubscribeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planName = searchParams.get('plan') as string

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<'plan' | 'payment' | 'confirmation'>(
    'payment'
  )
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    transferDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
  })

  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check user
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/login')
          return
        }
        setUser(currentUser)

        // Load plan
        if (planName) {
          const planData = await getSubscriptionPlan(planName)
          if (planData) {
            setPlan(planData)
          } else {
            setError('الخطة المطلوبة غير موجودة')
          }
        }
      } catch (err: any) {
        console.error('Error loading:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [planName, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (!user || !plan) {
        throw new Error('بيانات ناقصة')
      }

      // Validate form
      if (!formData.bankName || !formData.accountNumber || !formData.transferDate || !formData.referenceNumber) {
        throw new Error('يرجى ملء جميع الحقول المطلوبة')
      }

      // Create subscription first (pending)
      const subscription = await createUserSubscription(user.id, plan.name, plan.id)

      // Submit bank transfer
      const transfer = await submitBankTransfer(user.id, {
        amount_sar: plan.price_sar || 0,
        plan_name: plan.name,
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        transfer_date: formData.transferDate,
        reference_number: formData.referenceNumber,
        subscription_id: subscription.id,
      })

      // Create invoice
      await createInvoice(user.id, {
        amount_sar: plan.price_sar || 0,
        description: `الاشتراك في الخطة ${plan.name} لمدة شهر`,
        payment_id: transfer.id,
        subscription_id: subscription.id,
      })

      setPaymentData(transfer)
      setSuccess('تم إرسال طلب الدفع بنجاح! سيتم التحقق من التحويل قريباً.')
      setStep('confirmation')
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'حدث خطأ أثناء معالجة الدفع')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg">{error || 'الخطة غير موجودة'}</p>
          <button
            onClick={() => router.push('/pricing')}
            className="mt-4 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg"
          >
            العودة للخطط
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-cairo">
            إتمام الاشتراك
          </h1>
          <p className="text-gray-400">
            خطة {plan.name === 'basic' ? 'أساسية' : 'احترافية'} - {plan.price_sar} ريال سعودي/شهر
          </p>
        </motion.div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {['payment', 'confirmation'].map((s, idx, arr) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step === s
                    ? 'bg-primary text-white'
                    : step !== 'payment'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`w-12 h-1 mx-4 ${
                    step !== 'payment' ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Payment Form */}
        {step === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-border rounded-2xl p-8 max-w-2xl mx-auto"
          >
            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-background/50 p-6 rounded-lg border border-border mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">اسم الخطة:</span>
                  <span className="text-white font-semibold">{plan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">المبلغ المستحق:</span>
                  <span className="text-2xl font-bold text-primary">{plan.price_sar} ر.س</span>
                </div>
              </div>

              {/* Bank Transfer Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg mb-8">
                <h3 className="text-white font-semibold mb-4 font-cairo">تعليمات التحويل البنكي:</h3>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li>1. قم بتحويل <span className="text-primary font-bold">{plan.price_sar} ريال</span> إلى حسابنا البنكي</li>
                  <li>2. تأكد من كتابة رقم المرجع الذي ستتلقاه</li>
                  <li>3. ملأ النموذج أدناه بتفاصيل التحويل</li>
                  <li>4. سيتم التحقق من التحويل خلال 24 ساعة</li>
                </ol>
              </div>

              {/* Bank Details (Usually shown) */}
              <div className="bg-background/50 p-6 rounded-lg border border-border">
                <h3 className="text-white font-semibold mb-4 font-cairo">بيانات حسابنا البنكي:</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">البنك:</span> <span className="text-white">البنك الأهلي السعودي</span></div>
                  <div><span className="text-gray-400">رقم الحساب:</span> <span className="text-white font-mono">1234567890</span></div>
                  <div><span className="text-gray-400">IBAN:</span> <span className="text-white font-mono">SA0012345678901234567890</span></div>
                  <div><span className="text-gray-400">اسم المستقبل:</span> <span className="text-white">مسار العقار</span></div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5 pt-6 border-t border-border">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    اسم البنك
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="مثال: البنك الأهلي"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    رقم حسابك
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم حسابك"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    تاريخ التحويل
                  </label>
                  <input
                    type="date"
                    name="transferDate"
                    value={formData.transferDate}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    رقم المرجع/الإيصال
                  </label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
                    placeholder="رقم المرجع من النظام البنكي"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-8"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <span>تأكيد الدفع</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Confirmation Screen */}
        {step === 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl p-12 max-w-2xl mx-auto text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />

            <h2 className="text-3xl font-bold text-white mb-4 font-cairo">
              تم استقبال طلبك بنجاح!
            </h2>

            <p className="text-gray-400 mb-8 text-lg">
              شكراً لاختيارك خطة {plan.name}. تم إرسال طلب الدفع الخاص بك للتحقق.
            </p>

            {/* Confirmation Details */}
            <div className="bg-background/50 p-6 rounded-lg border border-border mb-8 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">رقم الطلب:</span>
                  <span className="text-white font-mono text-sm">{paymentData?.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">المبلغ:</span>
                  <span className="text-white font-semibold">{plan.price_sar} ريال سعودي</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">الحالة:</span>
                  <span className="text-yellow-400 font-semibold">قيد المراجعة</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg mb-8 text-left">
              <h3 className="text-white font-semibold mb-4 font-cairo">الخطوات التالية:</h3>
              <ol className="space-y-2 text-sm text-gray-300">
                <li>✓ تم تسجيل طلب الدفع</li>
                <li>⏳ سيتم التحقق من التحويل خلال 24 ساعة</li>
                <li>📧 ستتلقى بريداً تأكيداً عند التحقق</li>
                <li>🎉 ستفعّل الخطة تلقائياً عند التحقق</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all"
              >
                الذهاب للـ Dashboard
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="flex-1 bg-background border border-border text-primary hover:bg-background/50 font-bold py-3 rounded-lg transition-all"
              >
                الخطط الأخرى
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
