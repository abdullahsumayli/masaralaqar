'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import { Loader } from 'lucide-react'

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthorized(true)
      return
    }

    const checkAdminAccess = async () => {
      try {
        const user = await getCurrentUser()
        
        if (!user) {
          router.push('/admin/login')
          return
        }

        const profile = await getUserProfile(user.id)
        
        if (profile?.role === 'admin') {
          setIsAuthorized(true)
        } else {
          // Not an admin, redirect to dashboard
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking admin access:', error)
        router.push('/admin/login')
      }
    }

    checkAdminAccess()
  }, [pathname, router])

  // Show loading while checking auth
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#010409] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
