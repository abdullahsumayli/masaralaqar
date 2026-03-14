"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronLeft,
  Clock,
  FileText,
  MessageCircleQuestion,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AnalyticsData {
  totalProperties: number;
  totalLeads: number;
  totalMessages: number;
  totalViewings: number;
  conversionRate: number;
  dailyMessages: Array<{ date: string; count: number }>;
}

interface RecentLead {
  id: string;
  name: string;
  status: string;
  created_at: string;
  last_contacted_at?: string;
  source: string;
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [pendingUnansweredCount, setPendingUnansweredCount] = useState<number>(0);

  // ── Real data states ──
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // ── Fetch analytics ──
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setAnalyticsLoading(true);
      try {
        const [analyticsRes, leadsRes, unansweredRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/leads/list"),
          fetch("/api/unanswered-questions?status=pending"),
        ]);

        if (analyticsRes.ok) {
          const json = await analyticsRes.json();
          if (json.success) setAnalytics(json.data);
        }

        if (leadsRes.ok) {
          const json = await leadsRes.json();
          if (json.success && Array.isArray(json.leads)) {
            // Most recent 4 leads for activity feed
            setRecentLeads(json.leads.slice(0, 4));
          }
        }

        const unansweredJson = await unansweredRes.json().catch(() => ({}));
        if (unansweredRes.ok && unansweredJson?.success && Array.isArray(unansweredJson?.questions)) {
          setPendingUnansweredCount(unansweredJson.questions.length);
        }
      } catch {
        // ignore
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || !user) return null;

  // ── Build stats from real analytics ──
  const stats = [
    {
      label: "العملاء المحتملين",
      value: analyticsLoading ? "—" : String(analytics?.totalLeads ?? 0),
      icon: Users,
      change: "",
      positive: true,
    },
    {
      label: "رسائل الذكاء الاصطناعي",
      value: analyticsLoading ? "—" : String(analytics?.totalMessages ?? 0),
      icon: MessageSquare,
      change: "",
      positive: true,
    },
    {
      label: "عقاراتي",
      value: analyticsLoading ? "—" : String(analytics?.totalProperties ?? 0),
      icon: Building2,
      change: "",
      positive: true,
    },
    {
      label: "معدل التحويل",
      value: analyticsLoading ? "—" : `${analytics?.conversionRate ?? 0}%`,
      icon: TrendingUp,
      change: "",
      positive: true,
    },
  ];

  // ── Weekly chart from daily messages (last 7 days) ──
  const weeklyData = (() => {
    if (!analytics?.dailyMessages?.length) return [];
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const last7 = analytics.dailyMessages.slice(-7);
    const maxCount = Math.max(...last7.map((d) => d.count), 1);
    return last7.map((d) => ({
      day: days[new Date(d.date).getDay()],
      messages: d.count,
      height: Math.max((d.count / maxCount) * 100, 4),
    }));
  })();

  const weeklyTotal = weeklyData.reduce((s, d) => s + d.messages, 0);

  // ── Recent activity from real leads ──
  const recentActivity = recentLeads.map((lead) => {
    const time = (() => {
      const ref = lead.last_contacted_at || lead.created_at;
      const diff = Date.now() - new Date(ref).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "الآن";
      if (mins < 60) return `منذ ${mins} دقيقة`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `منذ ${hours} ساعة`;
      return `منذ ${Math.floor(hours / 24)} يوم`;
    })();

    const statusLabels: Record<string, string> = {
      new: "عميل جديد",
      contacted: "تم التواصل مع",
      interested: "عميل مهتم",
      negotiating: "تفاوض مع",
      converted: "تم تحويل",
      lost: "عميل مفقود",
    };

    return {
      text: `${statusLabels[lead.status] || "عميل"}: ${lead.name}`,
      time,
      source: lead.source,
    };
  });

  return (
    <div className="min-h-full bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              مرحباً{profile?.name ? ` ${profile.name}` : ""} 👋
            </h1>
            <p className="text-text-secondary">إليك نظرة عامة على نشاطك</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingUnansweredCount > 0 && (
              <Link
                href="/dashboard/unanswered-questions"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-sm"
              >
                <MessageCircleQuestion className="w-4 h-4" />
                <span>{pendingUnansweredCount} سؤال</span>
              </Link>
            )}
            <Link
              href="/dashboard/properties/add"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors shadow-button-blue"
            >
              <Building2 className="w-4 h-4" />
              إضافة عقار
            </Link>
          </div>
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
              </div>
              <p className="text-2xl font-bold text-text-primary mb-1">
                {analyticsLoading ? (
                  <span className="inline-block w-10 h-7 bg-surface animate-pulse rounded" />
                ) : (
                  stat.value
                )}
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
                {[
                  { href: "/dashboard/properties", icon: Home, label: "العقارات" },
                  { href: "/dashboard/clients", icon: Users, label: "العملاء" },
                  { href: "/dashboard/messages", icon: MessageSquare, label: "الرسائل" },
                  {
                    href: "/dashboard/unanswered-questions",
                    icon: MessageCircleQuestion,
                    label: "أسئلة بدون إجابة",
                    badge: pendingUnansweredCount,
                  },
                  { href: "/dashboard/whatsapp", icon: null, label: "واتساب", isWhatsapp: true },
                  { href: "/dashboard/analytics", icon: BarChart3, label: "التحليلات" },
                  { href: "/dashboard/settings", icon: Settings, label: "الإعدادات" },
                  { href: "/dashboard/recommendations", icon: Sparkles, label: "التوصيات", gold: true },
                  { href: "/dashboard/ai-listings", icon: FileText, label: "الإعلانات الذكية", amber: true },
                  { href: "/dashboard/viewings", icon: CalendarDays, label: "طلبات المعاينة" },
                  { href: "/dashboard/reports", icon: FileText, label: "التقارير" },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-lg bg-surface transition-colors text-center
                      ${action.isWhatsapp ? "hover:bg-[#25D366]/10" : "hover:bg-primary/5"}`}
                  >
                    {action.badge != null && action.badge > 0 && (
                      <span className="absolute top-2 left-2 min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {action.badge}
                      </span>
                    )}
                    {action.isWhatsapp ? (
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ) : (
                      action.icon && (
                        <action.icon
                          className={`w-6 h-6 ${action.amber ? "text-amber-500" : action.gold ? "text-amber-400" : "text-primary"}`}
                        />
                      )
                    )}
                    <span className="text-sm text-text-secondary">{action.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Performance Chart — real weekly data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-background rounded-xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">
                  أداء الأسبوع الماضي
                </h2>
                {weeklyTotal > 0 && (
                  <div className="flex items-center gap-1 text-primary text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{weeklyTotal} رسالة</span>
                  </div>
                )}
              </div>

              {analyticsLoading ? (
                <div className="flex items-end gap-2 h-40">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-surface animate-pulse rounded-t-md"
                        style={{ height: `${40 + Math.random() * 60}%` }}
                      />
                      <span className="text-[10px] text-text-muted">—</span>
                    </div>
                  ))}
                </div>
              ) : weeklyData.length > 0 ? (
                <div className="flex items-end gap-2 h-40">
                  {weeklyData.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/40"
                        style={{ height: `${d.height}%` }}
                        title={`${d.messages} رسالة`}
                      />
                      <span className="text-[10px] text-text-muted">
                        {d.day.slice(0, 2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-text-muted text-sm">
                  لا توجد بيانات بعد — ابدأ باستخدام صقر لتظهر هنا الإحصائيات
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary/20" />
                  <span className="text-xs text-text-secondary">رسائل الذكاء الاصطناعي</span>
                </div>
                {!analyticsLoading && weeklyTotal > 0 && (
                  <p className="text-xs text-text-muted">
                    مجموع الأسبوع:{" "}
                    <span className="text-text-primary font-medium">{weeklyTotal} رسالة</span>
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity — real leads */}
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
                {analyticsLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-surface animate-pulse rounded w-3/4" />
                        <div className="h-2.5 bg-surface animate-pulse rounded w-1/3" />
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-text-primary">{activity.text}</p>
                        <p className="text-xs text-text-muted">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Users className="w-8 h-8 text-primary/30 mx-auto mb-2" />
                    <p className="text-sm text-text-muted">لا يوجد نشاط بعد</p>
                  </div>
                )}
              </div>
              {recentLeads.length > 0 && (
                <Link
                  href="/dashboard/clients"
                  className="block mt-4 text-center text-xs text-primary hover:underline"
                >
                  عرض كل العملاء
                </Link>
              )}
            </motion.div>

            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="bg-background rounded-xl p-5 border border-border"
            >
              <h3 className="font-bold text-text-primary mb-3 text-sm">ملخص سريع</h3>
              <div className="space-y-3">
                {[
                  { label: "طلبات معاينة", value: analytics?.totalViewings ?? "—", href: "/dashboard/viewings" },
                  { label: "أسئلة بانتظار الرد", value: pendingUnansweredCount, href: "/dashboard/unanswered-questions" },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center justify-between hover:text-primary transition-colors group">
                    <span className="text-sm text-text-secondary group-hover:text-primary">{item.label}</span>
                    <span className="text-sm font-bold text-text-primary group-hover:text-primary">
                      {analyticsLoading ? "—" : item.value}
                    </span>
                  </Link>
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
