"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Plan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  maxProperties: number;
  maxAiMessages: number;
  maxWhatsappMessages: number;
  features: string[];
  isActive: boolean;
}

interface CurrentSub {
  planName: string;
  status: string;
  endsAt: string | null;
}

const PLAN_ICONS: Record<string, React.ElementType> = {
  free: Zap,
  basic: CreditCard,
  pro: Sparkles,
};

const PLAN_COLORS: Record<string, string> = {
  free: "border-border",
  basic: "border-primary/40",
  pro: "border-amber-400/40",
};

const PLAN_BADGE: Record<string, string> = {
  free: "",
  basic: "bg-primary/10 text-primary",
  pro: "bg-amber-400/10 text-amber-400",
};

function formatLimit(val: number) {
  return val === -1 ? "غير محدود" : val.toLocaleString("ar-SA");
}

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSub, setCurrentSub] = useState<CurrentSub | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle redirect from Moyasar callback
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  useEffect(() => {
    if (success === "true") {
      setToast({ type: "success", text: "تم الدفع بنجاح! تم تفعيل اشتراكك." });
      setTimeout(() => setToast(null), 5000);
    } else if (error) {
      const errMessages: Record<string, string> = {
        missing_id: "معرف الدفع مفقود",
        invalid_metadata: "بيانات الدفع غير صالحة",
        payment_failed: "فشل الدفع",
        payment_authorized: "الدفع قيد المعالجة",
        verification_failed: "فشل التحقق من الدفع",
      };
      setToast({ type: "error", text: errMessages[error] || `خطأ: ${error}` });
      setTimeout(() => setToast(null), 6000);
    }
  }, [success, error]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          fetch("/api/plans"),
          fetch("/api/subscription/current"),
        ]);
        const plansData = await plansRes.json();
        setPlans(plansData.plans || []);
        if (subRes.ok) {
          const subData = await subRes.json();
          setCurrentSub(subData.subscription || null);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleUpgrade = async (plan: Plan) => {
    if (!plan.price || paying) return;
    setPaying(plan.name);
    try {
      // For now: redirect to bank transfer flow
      // Future: integrate Moyasar JS form for card payments
      router.push(`/dashboard/subscription/checkout?plan=${plan.name}`);
    } catch {
      setToast({ type: "error", text: "حدث خطأ. حاول مرة أخرى." });
    } finally {
      setPaying(null);
    }
  };

  const currentPlan = profile?.subscription || currentSub?.planName || "free";

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border shadow-xl text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.text}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            باقات الاشتراك
          </h1>
          <p className="text-text-secondary text-sm">
            اختر الباقة التي تناسب حجم نشاطك العقاري
          </p>
          {currentSub?.endsAt && (
            <p className="text-xs text-text-muted mt-2">
              اشتراكك الحالي ينتهي في:{" "}
              <span className="text-primary">
                {new Date(currentSub.endsAt).toLocaleDateString("ar-SA")}
              </span>
            </p>
          )}
        </div>

        {/* Plans */}
        {plans.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>لا توجد باقات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.name === currentPlan;
              const Icon = PLAN_ICONS[plan.name] || CreditCard;
              const isPopular = plan.name === "pro";

              return (
                <div
                  key={plan.id}
                  className={`relative bg-background rounded-2xl border p-6 flex flex-col transition-all ${
                    isCurrent
                      ? "border-primary shadow-[0_0_0_2px_rgba(79,142,247,0.25)]"
                      : PLAN_COLORS[plan.name] || "border-border"
                  } ${isPopular ? "shadow-lg" : ""}`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute -top-3 right-1/2 translate-x-1/2">
                      <span className="px-3 py-1 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                        الأكثر شيوعاً
                      </span>
                    </div>
                  )}

                  {/* Current badge */}
                  {isCurrent && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                        باقتك الحالية
                      </span>
                    </div>
                  )}

                  {/* Plan icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        PLAN_BADGE[plan.name]
                          ? PLAN_BADGE[plan.name] + " border border-current/20"
                          : "bg-surface border border-border"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">
                        {plan.nameAr || plan.name}
                      </h3>
                      <p className="text-xs text-text-muted">{plan.name}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <p className="text-3xl font-bold text-text-primary">
                        مجاني
                      </p>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-text-primary">
                          {plan.price.toLocaleString("ar-SA")}
                        </span>
                        <span className="text-text-secondary text-sm">
                          ر.س / شهر
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Limits */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    <LimitRow
                      label="عقارات"
                      value={formatLimit(plan.maxProperties)}
                    />
                    <LimitRow
                      label="رسائل AI"
                      value={formatLimit(plan.maxAiMessages)}
                    />
                    <LimitRow
                      label="رسائل واتساب"
                      value={formatLimit(plan.maxWhatsappMessages)}
                    />
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-text-secondary">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <div className="w-full py-2.5 text-center rounded-xl bg-primary/5 border border-primary/20 text-primary text-sm font-medium">
                      ✓ اشتراكك الحالي
                    </div>
                  ) : plan.price === 0 ? (
                    <div className="w-full py-2.5 text-center rounded-xl bg-surface border border-border text-text-muted text-sm">
                      الباقة الافتراضية
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan)}
                      disabled={!!paying}
                      className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        isPopular
                          ? "bg-gradient-to-l from-amber-500 to-orange-500 text-white hover:opacity-90"
                          : "bg-primary text-white hover:bg-primary-dark"
                      } disabled:opacity-50`}
                    >
                      {paying === plan.name ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      {paying === plan.name ? "جاري المعالجة..." : "اشترك الآن"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Billing note */}
        <p className="text-center text-xs text-text-muted mt-8">
          جميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة — يمكن إلغاء
          الاشتراك في أي وقت
        </p>
      </main>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </li>
  );
}
