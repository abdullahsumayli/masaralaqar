'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader } from 'lucide-react'

export function RootLayoutGuard() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    // إذا كان المستخدم يدخل الموقع، افحص نوعه
    if (user && profile) {
      // الـ admin يروح للـ admin
      if ((profile as any).role === 'admin') {
        router.push('/admin')
        return
      }

      // باقي المستخدمين يروحون للـ dashboard
      if ((profile as any).role === 'user') {
        router.push('/dashboard')
        return
      }
    }

    // الزوار بدون حساب يشوفون الصفحة الرئيسية (landing page)
  }, [user, profile, loading, router])

  // لا نظهر شيء حتى ننتهي من التحقق
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // بعد انتهاء التحقق، لا نظهر أي شيء لأن router.push سيتولى الأمر
  return null
}
