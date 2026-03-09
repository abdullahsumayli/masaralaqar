"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    BarChart3,
    Bell,
    Building2,
    ChevronLeft,
    Clock,
    Home,
    Loader2,
    LogOut,
    MessageSquare,
    Settings,
    Sparkles,
    TrendingUp,
    Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    router.push("/");
  };

  if (loading || !user) return null;

  const stats = [
    {
      label: "العملاء النشطين",
      value: "24",
      icon: Users,
      change: "+12%",
      positive: true,
    },
    {
      label: "الرسائل اليوم",
      value: "156",
      icon: MessageSquare,
      change: "+8%",
      positive: true,
    },
    {
      label: "عقاراتي",
      value: "—",
      icon: Building2,
      change: "",
      positive: true,
    },
    {
      label: "معدل التحويل",
      value: "32%",
      icon: TrendingUp,
      change: "+5%",
      positive: true,
    },
  ];

  const recentActivity = [
    { type: "message", text: "رسالة جديدة من أحمد محمد", time: "منذ 5 دقائق" },
    {
      type: "lead",
      text: "عميل جديد مهتم بشقة في الرياض",
      time: "منذ 15 دقيقة",
    },
    {
      type: "meeting",
      text: "معاينة مجدولة غداً الساعة 10 صباحاً",
      time: "منذ ساعة",
    },
    { type: "message", text: "رد تلقائي أُرسل لـ 3 عملاء", time: "منذ ساعتين" },
  ];

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
                  <Loader2 className="w-5 h-5 animate-spin" />
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
          <p className="text-text-secondary">إليك نظرة عامة على نشاطك اليوم</p>
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
                <span
                  className={`text-sm font-medium ${stat.positive ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-text-primary mb-1">
                {stat.value}
              </p>
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
              <h2 className="text-lg font-bold text-text-primary mb-4">
                إجراءات سريعة
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <Link
                  href="/dashboard/properties"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface hover:bg-primary/5 transition-colors text-center"
                >
                  <Home className="w-6 h-6 text-primary" />
                  <span className="text-sm text-text-secondary">العقارات</span>
                </Link>
                <Link
                  href="/dashboard/clients"
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
                <a
                  href="https://wa.me/966545374069"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface hover:bg-[#25D366]/10 transition-colors text-center"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-sm text-text-secondary">واتساب</span>
                </a>
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
                <Link
                  href="/dashboard/recommendations"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface hover:bg-primary/5 transition-colors text-center"
                >
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span className="text-sm text-text-secondary">التوصيات</span>
                </Link>
              </div>
            </motion.div>

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-background rounded-xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">
                  أداء الأسبوع
                </h2>
                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+18%</span>
                </div>
              </div>
              {/* Simple bar chart */}
              <div className="flex items-end gap-2 h-40">
                {[
                  { day: "الأحد", messages: 40, leads: 2 },
                  { day: "الإثنين", messages: 72, leads: 5 },
                  { day: "الثلاثاء", messages: 55, leads: 3 },
                  { day: "الأربعاء", messages: 90, leads: 7 },
                  { day: "الخميس", messages: 65, leads: 4 },
                  { day: "الجمعة", messages: 30, leads: 1 },
                  { day: "السبت", messages: 48, leads: 3 },
                ].map((d) => (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div
                        className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/30"
                        style={{ height: `${(d.messages / 90) * 100}%` }}
                        title={`${d.messages} رسالة`}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted">
                      {d.day.slice(0, 2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary/20" />
                  <span className="text-xs text-text-secondary">الرسائل</span>
                </div>
                <p className="text-xs text-text-muted">
                  مجموع هذا الأسبوع:{" "}
                  <span className="text-text-primary font-medium">
                    400 رسالة
                  </span>
                </p>
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
              <h2 className="text-lg font-bold text-text-primary mb-4">
                النشاط الأخير
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-primary">
                        {activity.text}
                      </p>
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
                احصل على ميزات إضافية مثل الردود التلقائية غير المحدودة
                والتقارير المتقدمة
              </p>
              <Link
                href="/products/saqr"
                className="inline-flex items-center gap-2 bg-[#F0F4FF] text-[#070B14] px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors"
              >
                عرض الباقات
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
