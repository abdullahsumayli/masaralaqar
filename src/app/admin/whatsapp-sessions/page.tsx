"use client";

import {
    Loader2,
    QrCode,
    RefreshCw,
    Smartphone,
    Wifi,
    WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";

interface WhatsAppSession {
  id: string;
  office_id: string;
  phone_number: string;
  instance_id: string;
  status: "pending" | "connected" | "disconnected";
  connected_at: string | null;
  created_at: string;
  office?: { name: string };
}

export default function AdminWhatsAppSessionsPage() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    connected: 0,
    disconnected: 0,
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats({
        total: data.whatsappSessions || 0,
        connected: data.connectedSessions || 0,
        disconnected:
          (data.whatsappSessions || 0) - (data.connectedSessions || 0),
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    connected: {
      label: "متصل",
      color: "bg-green-500/10 text-green-400",
      icon: Wifi,
    },
    disconnected: {
      label: "غير متصل",
      color: "bg-red-500/10 text-red-400",
      icon: WifiOff,
    },
    pending: {
      label: "قيد الانتظار",
      color: "bg-amber-500/10 text-amber-400",
      icon: QrCode,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">
            جلسات الواتساب
          </h1>
          <p className="text-gray-400 mt-1">
            إدارة ومراقبة اتصالات واتساب المكاتب
          </p>
        </div>
        <button
          onClick={loadSessions}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] text-gray-300 rounded-xl hover:bg-[#21262d] transition-colors border border-[#21262d]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <p className="text-gray-400 text-sm">إجمالي الجلسات</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">متصلة</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.connected}</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-gray-400 text-sm">غير متصلة</p>
          </div>
          <p className="text-3xl font-bold text-red-400">
            {stats.disconnected}
          </p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        {sessions.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#21262d]">
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  المكتب
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  رقم الهاتف
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  الحالة
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  آخر اتصال
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const sc = statusConfig[session.status];
                return (
                  <tr
                    key={session.id}
                    className="border-b border-[#21262d]/50 hover:bg-[#161b22] transition-colors"
                  >
                    <td className="px-6 py-4 text-white text-sm">
                      {session.office?.name || session.office_id}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-300 text-sm font-mono"
                      dir="ltr"
                    >
                      {session.phone_number}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc.color}`}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {session.connected_at
                        ? new Date(session.connected_at).toLocaleDateString(
                            "ar-SA",
                          )
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <Smartphone className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">لا توجد جلسات واتساب مسجّلة حالياً.</p>
            <p className="text-gray-500 text-sm mt-2">
              ستظهر الجلسات هنا عندما تقوم المكاتب بربط أرقامها عبر واتساب.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
