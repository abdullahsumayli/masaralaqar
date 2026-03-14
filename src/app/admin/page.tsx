"use client";

import {
    ArrowUpRight,
    BookOpen,
    Brain,
    Building2,
    CreditCard,
    FileText,
    FolderOpen,
    MessageCircle,
    Smartphone,
    TrendingUp,
    UserPlus,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PlatformStats {
  totalOffices: number;
  activeSubscriptions: number;
  totalProperties: number;
  totalLeads: number;
  connectedWhatsApp: number;
  todayAiMessages: number;
  todayWhatsappMessages: number;
}

interface RecentOffice {
  id: string;
  office_name: string;
  city: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    totalOffices: 0,
    activeSubscriptions: 0,
    totalProperties: 0,
    totalLeads: 0,
    connectedWhatsApp: 0,
    todayAiMessages: 0,
    todayWhatsappMessages: 0,
  });
  const [recentOffices, setRecentOffices] = useState<RecentOffice[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback content stats
  const [contentData, setContentData] = useState({
    blogPosts: 0,
    libraryResources: 0,
    downloadLeads: 0,
    uploadedFiles: 0,
  });

  useEffect(() => {
    // Load content stats from localStorage (existing behavior)
    const blogPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const libraryResources = JSON.parse(
      localStorage.getItem("libraryResources") || "[]",
    );
    const downloadLeads = JSON.parse(
      localStorage.getItem("downloadLeads") || "[]",
    );
    const uploadedFiles = JSON.parse(
      localStorage.getItem("uploadedFiles") || "[]",
    );
    setContentData({
      blogPosts: blogPosts.length,
      libraryResources: libraryResources.length,
      downloadLeads: downloadLeads.length,
      uploadedFiles: uploadedFiles.length,
    });

    // Load platform stats from API
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.recentOffices) setRecentOffices(data.recentOffices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const platformStats = [
    {
      title: "المكاتب المسجلة",
      value: stats.totalOffices,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      href: "/admin/subscribers",
    },
    {
      title: "الاشتراكات الفعالة",
      value: stats.activeSubscriptions,
      icon: CreditCard,
      color: "from-green-500 to-green-600",
      href: "/admin/plans",
    },
    {
      title: "إجمالي العقارات",
      value: stats.totalProperties,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      href: "/admin/system-analytics",
    },
    {
      title: "إجمالي العملاء",
      value: stats.totalLeads,
      icon: Users,
      color: "from-orange-500 to-orange-600",
      href: "/admin/leads",
    },
  ];

  const usageStats = [
    {
      title: "رسائل AI اليوم",
      value: stats.todayAiMessages,
      icon: Brain,
      color: "text-violet-400",
    },
    {
      title: "رسائل واتساب اليوم",
      value: stats.todayWhatsappMessages,
      icon: MessageCircle,
      color: "text-green-400",
    },
    {
      title: "واتساب متصل",
      value: stats.connectedWhatsApp,
      icon: Smartphone,
      color: "text-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">
            لوحة إدارة المنصة
          </h1>
          <p className="text-gray-400 mt-1">نظرة شاملة على مسار العقار</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            النظام يعمل
          </span>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-gray-400 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? "..." : stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Usage Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {usageStats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[#161b22] flex items-center justify-center">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-xl font-bold text-white">
                {loading ? "..." : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Offices */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <div className="flex items-center justify-between p-5 border-b border-[#21262d]">
            <h2 className="text-lg font-bold text-white">
              أحدث المكاتب المسجلة
            </h2>
            <Link
              href="/admin/subscribers"
              className="text-primary text-sm hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          <div className="p-5">
            {recentOffices.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">لا توجد مكاتب مسجلة بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOffices.map((office) => (
                  <div
                    key={office.id}
                    className="flex items-center justify-between p-3 bg-[#161b22] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">
                          {office.office_name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {office.city || "غير محدد"}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(office.created_at).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Stats */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl">
          <div className="p-5 border-b border-[#21262d]">
            <h2 className="text-lg font-bold text-white">إحصائيات المحتوى</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <Link
              href="/admin/blog"
              className="p-4 bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">
                {contentData.blogPosts}
              </p>
              <p className="text-gray-500 text-xs">مقال</p>
            </Link>
            <Link
              href="/admin/library"
              className="p-4 bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-colors"
            >
              <BookOpen className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-2xl font-bold text-white">
                {contentData.libraryResources}
              </p>
              <p className="text-gray-500 text-xs">مورد</p>
            </Link>
            <Link
              href="/admin/leads"
              className="p-4 bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-colors"
            >
              <UserPlus className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-2xl font-bold text-white">
                {contentData.downloadLeads}
              </p>
              <p className="text-gray-500 text-xs">عميل محتمل</p>
            </Link>
            <Link
              href="/admin/media"
              className="p-4 bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-colors"
            >
              <FolderOpen className="w-5 h-5 text-orange-400 mb-2" />
              <p className="text-2xl font-bold text-white">
                {contentData.uploadedFiles}
              </p>
              <p className="text-gray-500 text-xs">ملف</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-primary/10 to-orange-600/5 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-bold text-white">إجراءات سريعة</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            href="/admin/subscribers"
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <Users className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">المشتركين</span>
          </Link>
          <Link
            href="/admin/plans"
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">الباقات</span>
          </Link>
          <Link
            href="/admin/ai-usage"
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">استهلاك AI</span>
          </Link>
          <Link
            href="/admin/whatsapp-sessions"
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <Smartphone className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">جلسات واتساب</span>
          </Link>
          <Link
            href="/admin/system-analytics"
            className="flex items-center gap-3 p-4 bg-[#0D1117] rounded-xl hover:bg-[#161b22] border border-[#21262d] transition-all"
          >
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-white text-sm">التحليلات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
