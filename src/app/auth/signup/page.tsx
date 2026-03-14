'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, Building2, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'
import { signUp } from '@/lib/auth'

const trustItems = [
  'تجربة مجانية 14 يوم',
  'بدون بطاقة ائتمان',
  'إلغاء في أي وقت',
]

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('جميع الحقول المطلوبة يجب تعبئتها')
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

      if (signUpError) throw new Error(signUpError)
      if (user) setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = formData.password.length === 0
    ? null
    : formData.password.length < 6
    ? 'weak'
    : formData.password.length < 10
    ? 'medium'
    : 'strong'

  if (success) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-10 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">تم إنشاء الحساب!</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              تحقق من بريدك الإلكتروني على رابط التفعيل، ثم سجّل دخولك لبدء تجربتك المجانية.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              الذهاب إلى صفحة الدخول
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#010409] flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between p-5 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white hidden sm:block">مسار العقار</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
          لديك حساب؟ سجّل دخولك
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            {trustItems.map(item => (
              <div key={item} className="flex items-center gap-1.5 text-gray-400 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-white mb-1.5">إنشاء حساب مجاني</h1>
              <p className="text-gray-400 text-sm">انضم لأكثر من 500 مكتب عقاري في السعودية</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 mb-5">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الاسم الكامل *</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="محمد أحمد"
                    autoComplete="name"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  اسم الشركة / المكتب
                  <span className="text-gray-500 font-normal mr-1">(اختياري)</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="مكتب العقار الذهبي"
                    autoComplete="organization"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    dir="ltr"
                    autoComplete="email"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="6 أحرف على الأقل"
                    autoComplete="new-password"
                    className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pr-10 pl-10 text-white placeholder-gray-600 focus:border-primary/60 focus:bg-[#1c2128] focus:outline-none transition-all text-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {passwordStrength && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1 flex-1">
                      {['weak', 'medium', 'strong'].map((level, i) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passwordStrength === 'weak' && i === 0 ? 'bg-red-500' :
                            passwordStrength === 'medium' && i <= 1 ? 'bg-yellow-500' :
                            passwordStrength === 'strong' ? 'bg-green-500' :
                            'bg-[#21262d]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${
                      passwordStrength === 'weak' ? 'text-red-400' :
                      passwordStrength === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrength === 'weak' ? 'ضعيفة' : passwordStrength === 'medium' ? 'متوسطة' : 'قوية'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`w-full bg-[#161b22] border rounded-xl py-3 pr-10 pl-4 text-white placeholder-gray-600 focus:outline-none transition-all text-sm ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500/50 focus:border-red-500/70'
                        : 'border-[#30363d] focus:border-primary/60 focus:bg-[#1c2128]'
                    }`}
                    disabled={loading}
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5">كلمة المرور غير متطابقة</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : 'إنشاء الحساب مجاناً'}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-6 pt-6 border-t border-[#21262d] text-center">
              <p className="text-gray-500 text-sm">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-primary hover:text-primary-light transition-colors font-medium">
                  سجّل دخولك
                </Link>
              </p>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-5 text-gray-600 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>بياناتك محمية وآمنة — لن نشارك معلوماتك مع أي طرف ثالث</span>
          </div>
        </div>
      </div>
    </div>
  )
}
