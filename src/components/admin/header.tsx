'use client'

import { Bell, Search, User, ChevronDown, Settings } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  return (
    <header className="h-16 bg-[#0D1117] border-b border-[#21262d] px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="ابحث عن مشترك، تذكرة دعم..."
            className="w-full bg-[#161b22] border border-[#21262d] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Links */}
        <Link
          href="/"
          target="_blank"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          عرض الموقع
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl bg-[#161b22] border border-[#21262d] flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </button>

          {showNotifications && (
            <div className="absolute left-0 top-12 w-80 bg-[#161b22] border border-[#21262d] rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-[#21262d]">
                <h3 className="font-bold text-white">الإشعارات</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[
                  { title: 'طلب تجربة جديد', desc: 'مكتب الأفق العقاري طلب تجربة نظام صقر', time: 'منذ 5 دقائق', type: 'trial' },
                  { title: 'تذكرة دعم جديدة', desc: 'مشكلة في ربط الواتساب - عقارات المستقبل', time: 'منذ 15 دقيقة', type: 'support' },
                  { title: 'اشتراك جديد', desc: 'دار الإعمار اشترك في الباقة الاحترافية', time: 'منذ ساعة', type: 'subscription' },
                  { title: 'تجديد اشتراك', desc: 'شركة البناء جددت اشتراكها', time: 'منذ ساعتين', type: 'renewal' },
                ].map((notification, i) => (
                  <div key={i} className="p-4 border-b border-[#21262d]/50 hover:bg-[#21262d]/50 cursor-pointer transition-colors">
                    <p className="font-medium text-white text-sm">{notification.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{notification.desc}</p>
                    <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[#21262d]">
                <button className="w-full text-center text-primary text-sm font-medium hover:underline">
                  عرض جميع الإشعارات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#21262d] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">م</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">مسار العقار</p>
              <p className="text-xs text-gray-500">مدير النظام</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showProfile && (
            <div className="absolute left-0 top-14 w-48 bg-[#161b22] border border-[#21262d] rounded-xl shadow-xl overflow-hidden">
              <div className="p-2">
                <button className="w-full text-right px-4 py-2 text-sm text-gray-400 hover:bg-[#21262d] rounded-lg transition-colors">
                  الملف الشخصي
                </button>
                <button className="w-full text-right px-4 py-2 text-sm text-gray-400 hover:bg-[#21262d] rounded-lg transition-colors">
                  الإعدادات
                </button>
                <hr className="my-2 border-[#21262d]" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
