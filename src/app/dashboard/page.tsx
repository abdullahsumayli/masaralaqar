'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  TrendingUp,
  Calendar,
  Bell,
  ChevronLeft,
  Loader,
  MessageSquare,
  BarChart3,
  Clock
} from 'lucide-react'
import { signOut } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = [
    { label: 'العملاء النشطين', value: '24', icon: Users, change: '+12%', positive: true },
    { label: 'الرسائل اليوم', value: '156', icon: MessageSquare, change: '+8%', positive: true },
    { label: 'المعاينات المجدولة', value: '8', icon: Calendar, change: '+3', positive: true },
    { label: 'معدل التحويل', value: '32%', icon: TrendingUp, change: '+5%', positive: true },
  ]

  const recentActivity = [
    { type: 'message', text: 'رسالة جديدة من أحمد محمد', time: 'منذ 5 دقائق' },
    { type: 'lead', text: 'عميل جديد مهتم بشقة في الرياض', time: 'منذ 15 دقيقة' },
    { type: 'meeting', text: 'معاينة مجدولة غداً الساعة 10 صباحاً', time: 'منذ ساعة' },
    { type: 'message', text: 'رد تلقائي أُرسل لـ 3 عملاء', time: 'منذ ساعتين' },
  ]

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="مسار العقار"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="font-cairo font-bold text-lg text-text-primary">
                  مسار العقار
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-text-secondary hover:text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-text-secondary hidden md:block">
                  {user.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 text-text-secondary hover:text-red-500 transition-colors"
              >
                {isLoggingOut ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            مرحباً بك في لوحة التحكم
          </h1>
          <p className="text-text-secondary">
            إليك نظرة عامة على نشاطك اليوم
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-background rounded-xl p-6 border border-border"
            >
              <h2 className="text-lg font-bold text-text-primary mb-4">إجراءات سريعة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/dashboard/leads"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface hover:bg-primary/5 transition-colors text-center"
                >
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-sm text-text-secondary">العملاء</span>
                </Link>
                <Link
                  href="/dashboard/messages"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface hover:bg-primary/5 transition-colors text-center"
                >
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <span className="text-sm text-text-secondary">الرسائل</span>
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface hover:bg-primary/5 transition-colors text-center"
                >
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <span className="text-sm text-text-secondary">التحليلات</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface hover:bg-primary/5 transition-colors text-center"
                >
                  <Settings className="w-6 h-6 text-primary" />
                  <span className="text-sm text-text-secondary">الإعدادات</span>
                </Link>
              </div>
            </motion.div>

            {/* Performance Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-background rounded-xl p-6 border border-border"
            >
              <h2 className="text-lg font-bold text-text-primary mb-4">أداء الأسبوع</h2>
              <div className="h-64 flex items-center justify-center bg-surface rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-text-muted mx-auto mb-2" />
                  <p className="text-text-secondary">رسم بياني للأداء</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-background rounded-xl p-6 border border-border"
            >
              <h2 className="text-lg font-bold text-text-primary mb-4">النشاط الأخير</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">{activity.text}</p>
                      <p className="text-xs text-text-muted">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upgrade Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-white"
            >
              <h3 className="font-bold text-lg mb-2">ترقية حسابك</h3>
              <p className="text-white/80 text-sm mb-4">
                احصل على ميزات إضافية مثل الردود التلقائية غير المحدودة والتقارير المتقدمة
              </p>
              <Link
                href="/products/saqr"
                className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                عرض الباقات
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
