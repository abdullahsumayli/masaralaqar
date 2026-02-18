'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { useRequireAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useRequireAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="mr-64">
        <DashboardHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
