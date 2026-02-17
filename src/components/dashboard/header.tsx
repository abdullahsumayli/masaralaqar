'use client'

import { Bell, Search, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="ابحث عن عميل، عقار، أو معاينة..."
            className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute left-0 top-12 w-80 bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-text-primary">الإشعارات</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[
                  { title: 'عميل جديد', desc: 'محمد أحمد أرسل طلب معاينة', time: 'منذ 5 دقائق' },
                  { title: 'معاينة قادمة', desc: 'لديك معاينة بعد ساعة', time: 'منذ 30 دقيقة' },
                  { title: 'رسالة جديدة', desc: 'سارة علي أرسلت رسالة', time: 'منذ ساعة' },
                ].map((notification, i) => (
                  <div key={i} className="p-4 border-b border-border/50 hover:bg-background/50 cursor-pointer transition-colors">
                    <p className="font-medium text-text-primary text-sm">{notification.title}</p>
                    <p className="text-text-secondary text-xs mt-1">{notification.desc}</p>
                    <p className="text-text-muted text-xs mt-2">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
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
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-background transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-text-primary">عبدالله</p>
              <p className="text-xs text-text-muted">مدير</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>

          {showProfile && (
            <div className="absolute left-0 top-14 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
              <div className="p-2">
                <button className="w-full text-right px-4 py-2 text-sm text-text-secondary hover:bg-background rounded-lg transition-colors">
                  الملف الشخصي
                </button>
                <button className="w-full text-right px-4 py-2 text-sm text-text-secondary hover:bg-background rounded-lg transition-colors">
                  الإعدادات
                </button>
                <hr className="my-2 border-border" />
                <button className="w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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
