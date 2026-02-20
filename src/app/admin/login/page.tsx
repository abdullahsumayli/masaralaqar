'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Lock, Eye, EyeOff, AlertCircle, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // List of admin emails
    const ADMIN_EMAILS = ['sumayliabdullah@gmail.com']

    try {
      // Sign in with Supabase
      const result = await signIn(email, password)
      
      if (result.error) {
        setError(result.error || 'بيانات الدخول غير صحيحة')
        setIsLoading(false)
        return
      }
      
      // Check if email is in admin list
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        setError('أنت لا تملك صلاحيات الوصول إلى لوحة الإدارة')
        setIsLoading(false)
        return
      }

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err: any) {
      console.error('Admin login error:', err)
      setError(err.message || 'بيانات الدخول غير صحيحة')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Image
              src="/logo.png"
              alt="مسار العقار"
              width={56}
              height={56}
              className="rounded-xl"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 font-cairo">لوحة الإدارة</h1>
            <p className="text-gray-400">دخول إداري فقط</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-12 pl-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-12 pl-12 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#21262d]">
            <p className="text-center text-gray-500 text-sm">
              مسار العقار © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

