"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  AlertCircle,
  CreditCard,
  Loader2,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UsageData {
  messagesUsed: number;
  messageLimit: number;
  percentUsed: number;
  isAtLimit: boolean;
  isNearLimit: boolean;
  overageMessages?: number;
  overageAmountSar?: number;
}

interface SubscriptionData {
  planName: string;
  planNameAr: string;
  price: number;
  maxInstances: number;
  features: string[];
}

const PAYMENT_MESSAGES: Record<string, string> = {
  success: "تم الدفع بنجاح",
  canceled: "تم إلغاء الدفع",
  missing_ref: "معرف الدفع مفقود",
  payment_not_found: "لم يتم العثور على الدفع",
  invalid_metadata: "بيانات الدفع غير صالحة",
  activation_failed: "فشل تفعيل الاشتراك",
  verification_failed: "فشل التحقق من الدفع",
};

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null,
  );
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/usage");
      const json = await res.json();
      if (json.success) {
        setSubscription(json.subscription ?? null);
        setUsage(json.usage ?? null);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, fetchData]);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const canceled = searchParams.get("canceled");
    if (success === "true") {
      setToast({ type: "success", text: PAYMENT_MESSAGES.success });
      fetchData();
      router.replace("/dashboard/billing", { scroll: false });
    } else if (canceled === "1") {
      setToast({ type: "error", text: PAYMENT_MESSAGES.canceled });
      router.replace("/dashboard/billing", { scroll: false });
    } else if (error) {
      setToast({
        type: "error",
        text: PAYMENT_MESSAGES[error] || `فشل الدفع: ${error}`,
      });
      router.replace("/dashboard/billing", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleUpgrade = async (newPlan: string) => {
    setUpgrading(newPlan);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
      const json = await res.json();
      if (json.success && json.url) {
        window.location.href = json.url;
        return;
      }
      setToast({ type: "error", text: json.error || "فشل في إنشاء عملية الدفع" });
    } catch {
      setToast({ type: "error", text: "حدث خطأ. حاول مرة أخرى." });
    } finally {
      setUpgrading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-full bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const planName = subscription?.planName ?? "free";
  const planNameAr = subscription?.planNameAr ?? "مجانية";

  return (
    <div className="min-h-full bg-surface">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
            toast.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          الفوترة والاستخدام
        </h1>
        <p className="text-text-secondary text-sm mb-8">
          مراقبة استهلاكك وترقية الباقة
        </p>

        {/* Current plan */}
        <div className="bg-background rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary">{planNameAr}</h2>
              <p className="text-sm text-text-muted">
                {subscription?.price
                  ? `${subscription.price.toLocaleString("ar-SA")} ر.س / شهر`
                  : "مجاني"}
              </p>
            </div>
          </div>

          {/* Usage bar */}
          {usage && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">ردود الذكاء الاصطناعي</span>
                <span className="font-medium text-text-primary">
                  {usage.messagesUsed.toLocaleString("ar-SA")} /{" "}
                  {usage.messageLimit === -1
                    ? "∞"
                    : usage.messageLimit.toLocaleString("ar-SA")}
                </span>
              </div>
              <div className="h-3 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usage.isAtLimit
                      ? "bg-red-500"
                      : usage.isNearLimit
                        ? "bg-amber-500"
                        : "bg-primary"
                  }`}
                  style={{
                    width: `${usage.messageLimit === -1 ? 0 : Math.min(100, usage.percentUsed)}%`,
                  }}
                />
              </div>
              {usage.isNearLimit && !usage.isAtLimit && (
                <p className="text-amber-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  اقتربت من الحد الشهري
                </p>
              )}
              {usage.isAtLimit && (
                <p className="text-amber-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  تجاوز الحد — الاستخدام الإضافي يُحتسب ويُضاف للفاتورة
                </p>
              )}
              {usage.overageAmountSar != null && usage.overageAmountSar > 0 && (
                <p className="text-primary text-sm mt-3 font-medium">
                  استخدام إضافي: {usage.overageAmountSar.toFixed(2)} ريال
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upgrade options */}
        <div className="space-y-4">
          <h3 className="font-medium text-text-primary">ترقية الباقة</h3>
          <div className="grid gap-3">
            {["starter", "growth", "pro"].map((p) => {
              const isCurrent = p === planName;
              const labels: Record<string, string> = {
                starter: "بداية — 499 ر.س",
                growth: "نمو — 999 ر.س",
                pro: "احترافي — 1999 ر.س",
              };
              return (
                <div
                  key={p}
                  className="flex items-center justify-between bg-background rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium text-text-primary">
                      {labels[p] ?? p}
                    </span>
                  </div>
                  {isCurrent ? (
                    <span className="text-xs text-primary font-medium">
                      الباقة الحالية
                    </span>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(p)}
                      disabled={!!upgrading}
                      className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                    >
                      {upgrading === p ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          جاري الدفع...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          ترقية
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Link to full subscription / checkout */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard/subscription"
            className="text-primary text-sm hover:underline"
          >
            عرض جميع الباقات والدفع
          </Link>
        </div>
      </div>
    </div>
  );
}
