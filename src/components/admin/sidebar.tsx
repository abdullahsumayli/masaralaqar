'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  HeadphonesIcon, 
  Settings, 
  LogOut,
  BarChart3,
  Bell,
  CreditCard,
  Zap,
  FileText,
  BookOpen,
  FolderOpen,
  UserPlus,
  GraduationCap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'الرئيسية',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'المشتركين',
    href: '/admin/subscribers',
    icon: Users,
  },
  {
    title: 'طلبات التجربة',
    href: '/admin/trials',
    icon: ClipboardList,
  },
  {
    title: 'الدعم الفني',
    href: '/admin/support',
    icon: HeadphonesIcon,
  },
  {
    title: 'المدونة',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    title: 'المكتبة',
    href: '/admin/library',
    icon: BookOpen,
  },
  {
    title: 'الأكاديمية',
    href: '/admin/academy',
    icon: GraduationCap,
  },
  {
    title: 'مدير الملفات',
    href: '/admin/media',
    icon: FolderOpen,
  },
  {
    title: 'العملاء المحتملون',
    href: '/admin/leads',
    icon: UserPlus,
  },
  {
    title: 'التحليلات',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-[#0D1117] border-l border-[#21262d] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#21262d]">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="مسار العقار"
            width={44}
            height={44}
            className="rounded-xl"
          />
          <div>
            <span className="font-cairo font-bold text-lg text-white block">مسار العقار</span>
            <span className="text-xs text-gray-500">لوحة الإدارة</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-gray-400 hover:bg-[#21262d] hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Stats Widget */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white">الإيرادات الشهرية</span>
        </div>
        <p className="text-2xl font-bold text-primary">٤٥,٦٠٠ ر.س</p>
        <p className="text-xs text-gray-500 mt-1">+12% من الشهر الماضي</p>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#21262d]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
