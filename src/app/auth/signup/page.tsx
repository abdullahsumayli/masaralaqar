'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, User, Loader2, AlertCircle, CheckCircle, Zap, ArrowRight } from 'lucide-react'
import { createLead } from '@/lib/leads'

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validation
      if (!formData.name || !formData.phone || !formData.email) {
        throw new Error('جميع الحقول مطلوبة')
      }

      if (!formData.email.includes('@')) {
        throw new Error('البريد الإلكتروني غير صحيح')
      }

      // Validate Saudi phone number
      const phoneRegex = /^(05|5|9665)\d{8}$/
      const cleanPhone = formData.phone.replace(/\s/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        throw new Error('رقم الجوال غير صحيح')
      }

      const { data, error: createError } = await createLead({
        name: formData.name,
        phone: cleanPhone,
        email: formData.email,
        source: 'website_trial',
      })

      if (createError) {
        throw new Error(createError)
      }

      if (data) {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Success State
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">تم التسجيل بنجاح! 🎉</h1>
          <p className="text-gray-400 mb-6">
            شكراً لك {formData.name}! سنتواصل معك خلال 24 ساعة لإعداد حسابك وربط واتساب.
          </p>
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-6">
            <p className="text-gray-300 text-sm mb-3">تم إرسال تفاصيل التجربة إلى:</p>
            <p className="text-primary font-bold">{formData.email}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ابدأ تجربتك المجانية</h1>
          <p className="text-gray-400">14 يوم مجاناً - بدون بطاقة ائتمان</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">الاسم</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أحمد العتيبي"
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">رقم الجوال</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="05xxxxxxxx"
                dir="ltr"
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition text-left"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ahmed@example.com"
                dir="ltr"
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition text-left"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-orange-600 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري التسجيل...
              </>
            ) : (
              'ابدأ التجربة المجانية'
            )}
          </button>

          <p className="text-center text-gray-500 text-sm">
            بالتسجيل، أنت توافق على{' '}
            <a href="#" className="text-primary hover:underline">الشروط والأحكام</a>
          </p>
        </form>

        {/* Back Link */}
        <p className="text-center text-gray-400 mt-8">
          <Link href="/" className="text-primary hover:underline flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </p>
      </div>
    </div>
  )
}
