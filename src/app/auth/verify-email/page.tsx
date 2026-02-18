'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Mail, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0e27] to-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-white mb-3">تأكيد البريد الإلكتروني</h1>
        <p className="text-gray-400 mb-6">
          تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. 
          يرجى فتح الرسالة والنقر على الرابط للتحقق من حسابك.
        </p>

        {/* Instructions */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-medium text-white mb-4">ما الخطوات التالية؟</h3>
          <ol className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>افتح بريدك الإلكتروني</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>ابحث عن رسالة من <strong className="text-white">noreply@masaralaqar.com</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>انقر على الرابط "تأكيد البريد الإلكتروني"</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <span>عد للموقع وادخل حسابك</span>
            </li>
          </ol>
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="block w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-all mb-4"
        >
          العودة للدخول
        </Link>

        {/* Resend */}
        <button className="w-full text-primary hover:text-primary/80 font-medium py-2 text-sm">
          إعادة إرسال الرسالة
        </button>

        {/* Support */}
        <p className="text-gray-500 text-sm mt-6">
          هل تواجه مشكلة؟{' '}
          <Link href="/support" className="text-primary hover:underline">
            تواصل معنا
          </Link>
        </p>
      </div>
    </div>
  )
}
