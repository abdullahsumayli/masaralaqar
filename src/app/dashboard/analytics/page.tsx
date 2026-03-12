"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    BarChart3,
    Building2,
    CalendarDays,
    ChevronRight,
    Eye,
    Loader2,
    MessageSquare,
    RefreshCw,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface AnalyticsData {
  totalProperties: number;
  totalLeads: number;
  totalMessages: number;
  totalViewings: number;
  conversionRate: number;
  aiResponseCount: number;
  topRequestedProperties: Array<{ id: string; title: string; views: number }>;
  leadsByStatus: Record<string, number>;
  dailyMessages: Array<{ date: string; count: number }>;
  leadsBySource: Record<string, number>;
}

const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  qualified: "مؤهل",
  converted: "تم التحويل",
  lost: "مفقود",
};

const SOURCE_LABELS: Record<string, string> = {
  whatsapp: "واتساب",
  website: "الموقع",
  manual: "يدوي",
  unknown: "غير محدد",
};

const COLORS = [
  "#4F8EF7",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "خطأ في جلب البيانات");
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user, fetchAnalytics]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusData = data
    ? Object.entries(data.leadsByStatus).map(([key, value]) => ({
        name: STATUS_LABELS[key] || key,
        value,
      }))
    : [];

  const sourceData = data
    ? Object.entries(data.leadsBySource).map(([key, value]) => ({
        name: SOURCE_LABELS[key] || key,
        value,
      }))
    : [];

  return (
    <div className="min-h-screen bg-surface" dir="rtl">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/dashboard"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                لوحة التحكم
              </Link>
              <ChevronRight className="w-4 h-4 text-text-muted" />
              <span className="text-text-primary font-medium">التحليلات</span>
            </div>
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              تحديث
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                icon={Building2}
                label="العقارات"
                value={data.totalProperties}
              />
              <StatCard
                icon={Users}
                label="العملاء المحتملين"
                value={data.totalLeads}
              />
              <StatCard
                icon={MessageSquare}
                label="رسائل الذكاء الاصطناعي"
                value={data.totalMessages}
              />
              <StatCard
                icon={Eye}
                label="طلبات المعاينة"
                value={data.totalViewings}
              />
              <StatCard
                icon={TrendingUp}
                label="معدل التحويل"
                value={`${data.conversionRate}%`}
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Messages Chart */}
              <div className="bg-background rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    الرسائل اليومية (آخر 30 يوم)
                  </h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.dailyMessages}>
                      <defs>
                        <linearGradient
                          id="colorMsg"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4F8EF7"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4F8EF7"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis
                        dataKey="date"
                        stroke="#64748B"
                        fontSize={11}
                        tickFormatter={(v: string) => v.slice(5)}
                      />
                      <YAxis stroke="#64748B" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          background: "#0F172A",
                          border: "1px solid #1E293B",
                          borderRadius: "8px",
                          color: "#F0F4FF",
                          direction: "rtl",
                        }}
                        labelFormatter={(v) => `التاريخ: ${v}`}
                        formatter={(v) => [v, "الرسائل"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#4F8EF7"
                        strokeWidth={2}
                        fill="url(#colorMsg)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Leads by Status */}
              <div className="bg-background rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    العملاء حسب الحالة
                  </h3>
                </div>
                {statusData.length > 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, percent }: { name?: string; percent?: number }) =>
                            `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`
                          }
                        >
                          {statusData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#0F172A",
                            border: "1px solid #1E293B",
                            borderRadius: "8px",
                            color: "#F0F4FF",
                            direction: "rtl",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-text-muted text-sm">
                    لا توجد بيانات بعد
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Leads by Source */}
              <div className="bg-background rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    مصادر العملاء
                  </h3>
                </div>
                {sourceData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sourceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis type="number" stroke="#64748B" fontSize={11} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          stroke="#64748B"
                          fontSize={12}
                          width={80}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#0F172A",
                            border: "1px solid #1E293B",
                            borderRadius: "8px",
                            color: "#F0F4FF",
                            direction: "rtl",
                          }}
                          formatter={(v) => [v, "عدد العملاء"]}
                        />
                        <Bar
                          dataKey="value"
                          fill="#4F8EF7"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-text-muted text-sm">
                    لا توجد بيانات بعد
                  </div>
                )}
              </div>

              {/* Top Properties */}
              <div className="bg-background rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    أكثر العقارات مشاهدة
                  </h3>
                </div>
                {data.topRequestedProperties.length > 0 ? (
                  <div className="space-y-3">
                    {data.topRequestedProperties.map((prop, i) => (
                      <div
                        key={prop.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-surface"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                            {i + 1}
                          </span>
                          <span className="text-sm text-text-primary truncate max-w-[200px]">
                            {prop.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-text-secondary text-sm">
                          <Eye className="w-4 h-4" />
                          {prop.views}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-text-muted text-sm">
                    لا توجد بيانات بعد
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-background rounded-xl p-5 border border-border">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary mt-1">{label}</p>
    </div>
  );
}
