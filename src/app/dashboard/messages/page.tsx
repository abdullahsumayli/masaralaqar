'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { MessageSquare, ChevronRight, Loader2 } from 'lucide-react'

export default function MessagesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-2 text-sm">
            <Link href="/dashboard" className="text-text-secondary hover:text-primary transition-colors">
              لوحة التحكم
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary font-medium">الرسائل</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">الرسائل</h1>
          <p className="text-text-secondary max-w-md mx-auto">
            ستتمكن قريباً من عرض جميع المحادثات التي أجراها صقر مع عملائك ومتابعتها من هنا.
          </p>
          <span className="inline-block mt-4 bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full font-medium">
            قريباً
          </span>
        </div>
      </main>
    </div>
  )
}
