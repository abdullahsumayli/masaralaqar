"use client";

import { useRequireAdmin } from "@/hooks/useAuth";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface QueueStats {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export default function QueuesPage() {
  const { loading: authLoading } = useRequireAdmin();
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/system/queue-stats");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "فشل جلب حالة الطابور");
      setStats(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo">طوابير الرسائل</h1>
          <p className="text-gray-400 mt-1">حالة الطابور في الوقت الفعلي — يتم التحديث كل 10 ثوانٍ</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>
      <div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading && !stats ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary mb-1">
                طابور: whatsapp-messages
              </h2>
              <p className="text-sm text-text-secondary">
                حالة الطابور في الوقت الفعلي — يتم التحديث كل 10 ثوانٍ
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <QueueCard
                label="في الانتظار"
                value={stats.waiting}
                color="text-yellow-400"
                bgColor="bg-yellow-500/10"
              />
              <QueueCard
                label="قيد المعالجة"
                value={stats.active}
                color="text-blue-400"
                bgColor="bg-blue-500/10"
              />
              <QueueCard
                label="مكتملة"
                value={stats.completed}
                color="text-green-400"
                bgColor="bg-green-500/10"
              />
              <QueueCard
                label="فاشلة"
                value={stats.failed}
                color="text-red-400"
                bgColor="bg-red-500/10"
              />
              <QueueCard
                label="مؤجلة"
                value={stats.delayed}
                color="text-purple-400"
                bgColor="bg-purple-500/10"
              />
            </div>

            {/* Failed Messages Link */}
            {stats.failed > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-red-400 mb-2">
                  ⚠️ رسائل فاشلة: {stats.failed}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  بعض الرسائل فشلت بعد استنفاد كل محاولات إعادة المحاولة. تم
                  حفظها في جدول failed_messages للمراجعة.
                </p>
              </div>
            )}

            {/* Queue Info */}
            <div className="bg-background rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-text-primary mb-4">
                إعدادات الطابور
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <InfoRow label="اسم الطابور" value="whatsapp-messages" />
                <InfoRow label="محاولات إعادة" value="3 محاولات" />
                <InfoRow label="تأخير إعادة" value="أُسّي (2ث → 4ث → 8ث)" />
                <InfoRow label="معدل المعالجة" value="5 رسائل/ثانية" />
                <InfoRow label="التزامن" value="3 وظائف متزامنة" />
                <InfoRow
                  label="الرسائل المحتفظة"
                  value="500 مكتملة / 1000 فاشلة"
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function QueueCard({
  label,
  value,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-background rounded-xl p-5 border border-border">
      <div
        className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center mb-3`}
      >
        <Activity className={`w-5 h-5 ${color}`} />
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
      <p className="text-sm text-text-secondary mt-1">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-surface">
      <span className="text-text-secondary">{label}</span>
      <span className="text-text-primary font-medium">{value}</span>
    </div>
  );
}
