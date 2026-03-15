"use client";

import { Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface LeaderEntry {
  rank: number;
  affiliateId: string;
  name: string;
  referralCode?: string;
  revenue?: number;
  customers?: number;
}

export default function LeaderboardPage() {
  const [byRevenue, setByRevenue] = useState<LeaderEntry[]>([]);
  const [byCustomers, setByCustomers] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/affiliate/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.byRevenue) setByRevenue(data.byRevenue);
        if (data.byCustomers) setByCustomers(data.byCustomers);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">
          لوحة المتصدرين — برنامج الإحالة
        </h1>
        <p className="text-text-secondary text-center mb-10">
          أفضل 20 شريكاً حسب الإيرادات وعدد العملاء المُحالين
        </p>

        {loading ? (
          <div className="text-center py-16 text-text-muted">جاري التحميل...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                حسب الإيرادات
              </h2>
              <ul className="space-y-3">
                {byRevenue.length === 0 ? (
                  <li className="text-text-muted text-sm">لا بيانات بعد</li>
                ) : (
                  byRevenue.map((e) => (
                    <li
                      key={e.affiliateId}
                      className="flex items-center gap-4 py-2 border-b border-border last:border-0"
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          e.rank === 1
                            ? "bg-amber-500/20 text-amber-400"
                            : e.rank === 2
                              ? "bg-gray-400/20 text-gray-300"
                              : e.rank === 3
                                ? "bg-amber-700/20 text-amber-600"
                                : "bg-surface text-text-muted"
                        }`}
                      >
                        {e.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate">{e.name}</p>
                        {e.referralCode && (
                          <p className="text-xs text-text-muted">{e.referralCode}</p>
                        )}
                      </div>
                      <span className="text-primary font-semibold">{e.revenue?.toFixed(2)} ر.س</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                حسب عدد العملاء
              </h2>
              <ul className="space-y-3">
                {byCustomers.length === 0 ? (
                  <li className="text-text-muted text-sm">لا بيانات بعد</li>
                ) : (
                  byCustomers.map((e) => (
                    <li
                      key={e.affiliateId}
                      className="flex items-center gap-4 py-2 border-b border-border last:border-0"
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          e.rank === 1
                            ? "bg-amber-500/20 text-amber-400"
                            : e.rank === 2
                              ? "bg-gray-400/20 text-gray-300"
                              : e.rank === 3
                                ? "bg-amber-700/20 text-amber-600"
                                : "bg-surface text-text-muted"
                        }`}
                      >
                        {e.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate">{e.name}</p>
                        {e.referralCode && (
                          <p className="text-xs text-text-muted">{e.referralCode}</p>
                        )}
                      </div>
                      <span className="text-primary font-semibold">{e.customers} عميل</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
