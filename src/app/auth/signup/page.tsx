'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Building2, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { signUp } from '@/lib/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('جميع الحقول مطلوبة')
      }

      if (formData.password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('كلمة المرور غير متطابقة')
      }

      const { user, error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.company
      )

      if (signUpError) {
        throw new Error(signUpError)
      }

      if (user) {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0e27] to-black flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">تم إنشاء الحساب!</h2>
          <p className="text-gray-400 mb-6">
            تحقق من بريدك الإلكتروني لتفعيل حسابك
          </p>
          <Link
            href="/login"
            className="btn-primary inline-flex items-center justify-center"
          >
            الذهاب إلى صفحة الدخول
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0e27] to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب</h1>
          <p className="text-gray-400">انضم إلى مسار العقار وابدأ رحلتك</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="محمد أحمد"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pr-10 pl-4 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Company Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">اسم الشركة / المكتب</label>
            <div className="relative">
              <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="مكتب العقار الذهبي"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pr-10 pl-4 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition"
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
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pr-10 pl-4 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pr-10 pl-4 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">تأكيد كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pr-10 pl-4 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري إنشاء الحساب...
              </>
            ) : (
              'إنشاء الحساب'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-primary hover:underline">
            سجّل دخولك
          </Link>
        </p>
      </div>
    </div>
  )
}
