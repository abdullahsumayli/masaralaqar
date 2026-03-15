"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Copy,
  Loader2,
  Share2,
  Tag,
  Users,
  Wallet,
  TrendingUp,
  Gift,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface DashboardData {
  joined: boolean;
  referralLink: string | null;
  referralCode: string | null;
  coupons: { id: string; code: string; discountPercent: number; active: boolean }[];
  totalReferrals: number;
  activeCustomers: number;
  monthlyEarnings: number;
  totalEarnings: number;
  pendingPayout: number;
  commissions: { id: string; amount: number; percentage: number; tierLevel: number; createdAt: string }[];
}

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPercent, setNewCouponPercent] = useState(10);
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/affiliate/dashboard");
      const json = await res.json();
      if (res.ok) setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    load();
  }, [load]);

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

  const copyLink = () => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink);
    setToast("تم نسخ الرابط!");
    setTimeout(() => setToast(null), 2000);
  };

  const createCoupon = async () => {
    if (!newCouponCode.trim()) return;
    setCreatingCoupon(true);
    try {
      const res = await fetch("/api/affiliate/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCouponCode.trim(), discountPercent: newCouponPercent }),
      });
      const json = await res.json();
      if (res.ok) {
        setToast("تم إنشاء الكوبون");
        setNewCouponCode("");
        load();
      } else {
        setToast(json.error || "فشل إنشاء الكوبون");
      }
    } catch {
      setToast("حدث خطأ");
    } finally {
      setCreatingCoupon(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-full bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-full bg-surface flex items-center justify-center">
        <p className="text-text-muted">فشل تحميل البيانات</p>
      </div>
    );
  }

  if (!data.joined) {
    return (
      <div className="min-h-full bg-surface">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Share2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">برنامج الإحالة</h1>
          <p className="text-text-secondary mb-8">
            انضم كشريك وأحصل على عمولة عند إحالة عملاء جدد. السنة الأولى 30%، الثانية 20%، الثالثة 10%. إحالة ضمن الإحالة: 5% إضافية.
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-primary/90 text-white text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-6">برنامج الإحالة</h1>

        {/* Referral link */}
        <div className="bg-background border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            رابط الإحالة
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={data.referralLink || ""}
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2.5 rounded-xl bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              نسخ
            </button>
          </div>
          <p className="text-xs text-text-muted mt-2">كود الإحالة: {data.referralCode}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-text-muted mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">إجمالي الإحالات</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{data.totalReferrals}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-text-muted mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">عملاء نشطون</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{data.activeCustomers}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-text-muted mb-1">
              <Wallet className="w-4 h-4" />
              <span className="text-xs">أرباح هذا الشهر</span>
            </div>
            <p className="text-2xl font-bold text-primary">{data.monthlyEarnings.toFixed(2)} ر.س</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-text-muted mb-1">
              <Gift className="w-4 h-4" />
              <span className="text-xs">إجمالي الأرباح</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{data.totalEarnings.toFixed(2)} ر.س</p>
          </div>
        </div>
        {data.pendingPayout > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-200">
              مبلغ معلّق للصرف: <strong>{data.pendingPayout.toFixed(2)} ر.س</strong>
            </p>
          </div>
        )}

        {/* Coupons */}
        <div className="bg-background border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            كوبوناتي
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.coupons.map((c) => (
              <span
                key={c.id}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text-primary"
              >
                {c.code} ({c.discountPercent}%)
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="كود الكوبون (مثل SAQR10)"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
              className="w-40 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
            />
            <input
              type="number"
              min={1}
              max={100}
              value={newCouponPercent}
              onChange={(e) => setNewCouponPercent(Number(e.target.value) || 10)}
              className="w-20 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
            />
            <span className="flex items-center text-text-muted text-sm">%</span>
            <button
              onClick={createCoupon}
              disabled={creatingCoupon || !newCouponCode.trim()}
              className="px-4 py-2 rounded-lg bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25 flex items-center gap-1 disabled:opacity-50"
            >
              {creatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              إضافة كوبون
            </button>
          </div>
        </div>

        {/* Recent commissions */}
        <div className="bg-background border border-border rounded-2xl p-6">
          <h2 className="text-sm font-medium text-text-secondary mb-4">آخر العمولات</h2>
          {data.commissions.length === 0 ? (
            <p className="text-text-muted text-sm">لا توجد عمولات بعد</p>
          ) : (
            <ul className="space-y-2">
              {data.commissions.map((c) => (
                <li
                  key={c.id}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm"
                >
                  <span className="text-text-primary">
                    {c.amount.toFixed(2)} ر.س ({c.percentage}%{c.tierLevel === 2 ? " طبقة 2" : ""})
                  </span>
                  <span className="text-text-muted">{new Date(c.createdAt).toLocaleDateString("ar-SA")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
