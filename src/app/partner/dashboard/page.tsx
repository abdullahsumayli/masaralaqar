"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Copy,
  Loader2,
  LogOut,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { MqLogo } from "@/components/mq/MqLogo";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { signOut } from "@/lib/auth";

function formatSar(n: number): string {
  return n.toLocaleString("ar-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " ريال";
}

function formatNum(n: number): string {
  return n.toLocaleString("ar-SA");
}

interface DashboardData {
  totalSignups: number;
  totalPaidClients: number;
  totalEarnings: number;
  balance: number;
  conversionRate: number;
  avgEarningsPerClient: number;
  referralLink: string;
  referralCode: string;
}

interface ReferralItem {
  id: string;
  status: "registered" | "subscribed";
  commissionEarned: number;
  createdAt: string;
}

export default function PartnerDashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const [joining, setJoining] = useState(false);
  const [needsJoin, setNeedsJoin] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const [resDashboard, resReferrals] = await Promise.all([
        fetch("/api/partner/dashboard"),
        fetch("/api/partner/referrals"),
      ]);
      if (resDashboard.ok) {
        setData(await resDashboard.json());
        setNeedsJoin(false);
      } else if (resDashboard.status === 403) {
        setNeedsJoin(true);
        setData(null);
      } else {
        setData(null);
      }
      if (resReferrals.ok) {
        const json = await resReferrals.json();
        setReferrals(json.referrals ?? []);
      } else {
        setReferrals([]);
      }
    } catch {
      setData(null);
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch("/api/affiliate/join", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setToast("تم الانضمام لبرنامج الإحالة!");
        load();
      } else {
        setToast(json.error || "فشل الانضمام");
      }
    } catch {
      setToast("حدث خطأ");
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/partner/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    load();
  }, [load]);

  const copyLink = () => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink);
    setToast("تم نسخ الرابط!");
    setTimeout(() => setToast(null), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/partner/login");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data && !needsJoin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">فشل تحميل البيانات</p>
      </div>
    );
  }

  if (needsJoin) {
    return (
      <div className="min-h-screen">
        {toast && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-primary/90 text-white text-sm shadow-lg">
            {toast}
          </div>
        )}
        <header className="border-b border-[#21262d] bg-[#0D1117]/80 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/partner/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
                <MqLogo onPrimary className="h-[72%] w-[72%]" />
              </div>
              <span className="font-bold text-white">MQ · الشركاء</span>
            </Link>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">برنامج الإحالة</h1>
            <p className="text-text-secondary mb-8">
              انضم كشريك واحصل على عمولة عند إحالة عملاء جدد. السنة الأولى 30%، الثانية 20%، الثالثة 10%.
            </p>
            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
              انضم الآن
            </button>
            {toast && <p className="mt-4 text-sm text-primary">{toast}</p>}
            <Link href="/dashboard" className="mt-6 inline-block text-sm text-gray-400 hover:text-white transition-colors">
              العودة للوحة التحكم
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isFirstTime = data!.totalSignups === 0;

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-primary/90 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#21262d] bg-[#0D1117]/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/partner/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
              <MqLogo onPrimary className="h-[72%] w-[72%]" />
            </div>
            <span className="font-bold text-white">MQ · الشركاء</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">لوحة تحكم الشريك</h1>

        {/* First-time onboarding — prominent */}
        {isFirstTime && (
          <div className="bg-primary/15 border-2 border-primary/30 rounded-2xl p-6 mb-6">
            <p className="text-lg font-semibold text-white mb-2">
              ابدأ الآن — شارك رابطك لتحصل على أول عميل وأول عمولة
            </p>
            <p className="text-gray-400 text-sm mb-4">
              انسخ الرابط أدناه وأرسله لأي مكتب عقاري. عند التسجيل والاشتراك، تحصل على عمولتك.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={data.referralLink}
                className="flex-1 bg-[#161b22] border border-primary/30 rounded-xl px-4 py-3 text-white text-sm"
              />
              <button
                onClick={copyLink}
                className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold flex items-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                نسخ الرابط
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">كود الإحالة: {data.referralCode}</p>
          </div>
        )}

        {/* Stats — when has signups */}
        {!isFirstTime && (
          <>
            {/* Total earnings — prominent */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-400 mb-1">إجمالي الأرباح</p>
              <p className="text-3xl font-bold text-primary">
                {formatSar(data.totalEarnings)}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">إجمالي التسجيلات</p>
                <p className="text-2xl font-bold text-white">{formatNum(data.totalSignups)}</p>
              </div>
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">عملاء مدفوعون</p>
                <p className="text-2xl font-bold text-white">{formatNum(data.totalPaidClients)}</p>
              </div>
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">نسبة التحويل</p>
                <p className="text-2xl font-bold text-white">{data.conversionRate}%</p>
              </div>
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">الرصيد الحالي</p>
                <p className="text-2xl font-bold text-primary">{formatSar(data.balance)}</p>
              </div>
            </div>

            {/* Earnings per client */}
            {data.totalPaidClients > 0 && (
              <p className="text-center text-gray-300 text-sm mb-4">
                كل عميل مشترك ={" "}
                <span className="font-semibold text-primary">
                  {formatSar(Math.round(data.avgEarningsPerClient))}
                </span>{" "}
                لك
              </p>
            )}

            {/* Earnings projection */}
            {data.avgEarningsPerClient > 0 && (
              <div className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-400 mb-3">توقعات بناءً على متوسط عمولتك:</p>
                <div className="space-y-1.5 text-sm text-gray-300">
                  <p>لو جبت 3 عملاء = <span className="font-semibold text-primary">{formatSar(Math.round(data.avgEarningsPerClient * 3))}</span></p>
                  <p>لو جبت 5 عملاء = <span className="font-semibold text-primary">{formatSar(Math.round(data.avgEarningsPerClient * 5))}</span></p>
                  <p>لو جبت 10 عملاء = <span className="font-semibold text-primary">{formatSar(Math.round(data.avgEarningsPerClient * 10))}</span></p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Referral link — always show (compact if not first-time) */}
        {!isFirstTime && (
          <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              رابط الإحالة
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={data.referralLink}
                className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-2.5 text-white text-sm"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2.5 rounded-xl bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                نسخ
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">كود الإحالة: {data.referralCode}</p>
          </div>
        )}

        {/* Persistent CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-8 text-center">
          <p className="text-sm font-medium text-primary">
            ابدأ الآن — أرسل الرابط لعميل واحد اليوم
          </p>
        </div>

        {/* Referrals table */}
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">الإحالات</h2>
          {referrals.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد إحالات بعد. شارك رابطك لبدء الكسب.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-gray-400 border-b border-[#21262d]">
                    <th className="py-3 px-2">الحالة</th>
                    <th className="py-3 px-2">العمولة</th>
                    <th className="py-3 px-2">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-[#21262d] last:border-0">
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            r.status === "subscribed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {r.status === "subscribed" ? "مشترك" : "مسجّل"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-primary">{formatSar(r.commissionEarned)}</td>
                      <td className="py-3 px-2 text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          <Link href="/" className="font-cairo font-medium transition-colors hover:text-primary">
            MQ
          </Link>
        </p>
      </main>
    </div>
  );
}
