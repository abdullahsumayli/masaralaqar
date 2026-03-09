"use client";

import {
    Activity,
    Building2,
    Database,
    Loader2,
    MessageSquare,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface PlatformStats {
  totalOffices: number;
  totalSubscriptions: number;
  totalProperties: number;
  totalLeads: number;
  todayAiMessages: number;
  todayWhatsappMessages: number;
  connectedSessions: number;
  whatsappSessions: number;
  recentOffices: { id: string; name: string; created_at: string }[];
}

export default function AdminSystemAnalyticsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const metricsCards = [
    {
      label: "المكاتب المسجّلة",
      value: stats?.totalOffices || 0,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "الاشتراكات الفعّالة",
      value: stats?.totalSubscriptions || 0,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "إجمالي العقارات",
      value: stats?.totalProperties || 0,
      icon: Database,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "إجمالي العملاء",
      value: stats?.totalLeads || 0,
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "رسائل AI اليوم",
      value: stats?.todayAiMessages || 0,
      icon: MessageSquare,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      label: "رسائل واتساب اليوم",
      value: stats?.todayWhatsappMessages || 0,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-cairo">
          تحليلات النظام
        </h1>
        <p className="text-gray-400 mt-1">نظرة شاملة على أداء وحالة المنصة</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricsCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-gray-400 text-sm">{card.label}</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {card.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Connection Health */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">
          حالة اتصالات واتساب
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">الجلسات المتصلة</span>
              <span className="text-white font-medium">
                {stats?.connectedSessions || 0} / {stats?.whatsappSessions || 0}
              </span>
            </div>
            <div className="h-3 bg-[#161b22] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                style={{
                  width: `${stats?.whatsappSessions ? ((stats.connectedSessions || 0) / stats.whatsappSessions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Offices */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">
          آخر المكاتب المسجّلة
        </h3>
        {stats?.recentOffices && stats.recentOffices.length > 0 ? (
          <div className="space-y-3">
            {stats.recentOffices.map((office, idx) => (
              <div
                key={office.id}
                className="flex items-center justify-between p-3 bg-[#161b22] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white text-sm">{office.name}</span>
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(office.created_at).toLocaleDateString("ar-SA")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">لا توجد مكاتب مسجّلة بعد.</p>
        )}
      </div>

      {/* System Info */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">معلومات النظام</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-[#161b22] rounded-xl">
            <span className="text-gray-400">إصدار المنصة</span>
            <span className="text-white font-mono">2.0.0-beta</span>
          </div>
          <div className="flex justify-between p-3 bg-[#161b22] rounded-xl">
            <span className="text-gray-400">محرك AI</span>
            <span className="text-white font-mono">GPT-4o-mini</span>
          </div>
          <div className="flex justify-between p-3 bg-[#161b22] rounded-xl">
            <span className="text-gray-400">مزود واتساب</span>
            <span className="text-white font-mono">UltraMsg</span>
          </div>
          <div className="flex justify-between p-3 bg-[#161b22] rounded-xl">
            <span className="text-gray-400">قاعدة البيانات</span>
            <span className="text-white font-mono">Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
