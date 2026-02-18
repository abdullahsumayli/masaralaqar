'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Building2,
  BarChart3,
  Bell,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/auth'

const menuItems = [
  {
    title: 'الرئيسية',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'العملاء',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    title: 'المعاينات',
    href: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    title: 'الرسائل',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'التقارير',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'الإعدادات',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setLoggingOut(false)
    }
  }

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-surface border-l border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl">
            🦅
          </div>
          <div>
            <span className="font-cairo font-bold text-lg text-text-primary block">نظام صقر</span>
            <span className="text-xs text-text-muted">لوحة تحكم المكتب</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-text-secondary hover:bg-border/50 hover:text-text-primary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="px-4 py-3 rounded-xl bg-border/50 text-xs">
          <p className="text-text-muted">المستخدم</p>
          <p className="text-text-primary font-medium mt-1 truncate">{profile?.email}</p>
        </div>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-border/50 hover:text-text-primary transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">الإعدادات</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{loggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
        </button>
      </div>
    </aside>
  )
}
