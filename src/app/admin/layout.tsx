'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { AdminAuthGuard } from '@/components/admin/auth-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // Login page doesn't need sidebar/header
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#010409]">
        <AdminSidebar />
        <div className="mr-64">
          <AdminHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
