'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-surface border-l border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-cairo font-bold text-lg text-text-primary block">مسار العقار</span>
            <span className="text-xs text-text-muted">لوحة التحكم</span>
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
        <Link
          href="/dashboard/help"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-border/50 hover:text-text-primary transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">المساعدة</span>
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
