"use client";

import {
  BarChart3,
  CreditCard,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TopUsageRow {
  officeId: string;
  officeName: string;
  planName: string;
  price: number;
  messagesUsed: number;
  messageLimit: number;
  percentUsed: number;
}

export default function AdminBillingUsagePage() {
  const [mrr, setMrr] = useState(0);
  const [mrrFormatted, setMrrFormatted] = useState("");
  const [topUsage, setTopUsage] = useState<TopUsageRow[]>([]);
  const [totalOffices, setTotalOffices] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/billing-overview")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMrr(data.mrr ?? 0);
          setMrrFormatted(data.mrrFormatted ?? "");
          setTopUsage(data.topUsage ?? []);
          setTotalOffices(data.totalActiveOffices ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-cairo">
          الفوترة والاستخدام
        </h1>
        <p className="text-gray-400 mt-1">
          إيرادات متكررة شهرياً (MRR) واستهلاك المكاتب
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-gray-400 text-sm">إيرادات متكررة شهرياً (MRR)</p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {mrrFormatted || `${mrr.toLocaleString("ar-SA")} ر.س`}
          </p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-gray-400 text-sm">مكاتب نشطة</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalOffices}</p>
        </div>
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-gray-400 text-sm">تقدير الإيرادات السنوية</p>
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {(mrr * 12).toLocaleString("ar-SA")} ر.س
          </p>
        </div>
      </div>

      {/* Top usage table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        <h3 className="text-sm font-medium text-gray-400 px-6 py-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          أعلى استهلاك
        </h3>
        {topUsage.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            لا توجد بيانات استهلاك
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#21262d]">
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    المكتب
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    الباقة
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    الاستهلاك
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    الحد
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    %
                  </th>
                  <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                    الإيراد/شهر
                  </th>
                </tr>
              </thead>
              <tbody>
                {topUsage.map((row) => (
                  <tr
                    key={row.officeId}
                    className="border-b border-[#21262d]/50 hover:bg-[#161b22]"
                  >
                    <td className="px-6 py-4 text-white text-sm font-medium">
                      {row.officeName}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {row.planName}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {row.messagesUsed.toLocaleString("ar-SA")}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {row.messageLimit === -1
                        ? "∞"
                        : row.messageLimit.toLocaleString("ar-SA")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          row.percentUsed >= 80
                            ? "text-amber-400"
                            : row.percentUsed >= 100
                              ? "text-red-400"
                              : "text-gray-400"
                        }`}
                      >
                        {row.percentUsed.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {row.price.toLocaleString("ar-SA")} ر.س
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
