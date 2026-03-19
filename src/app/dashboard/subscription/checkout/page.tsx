"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  AlertCircle,
  ArrowRight,
  Building,
  CheckCircle2,
  CreditCard,
  Loader2,
  Phone,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
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
}

const PAYMENT_METHODS = [
  {
    id: "bank_transfer",
    label: "تحويل بنكي",
    desc: "تحويل مباشر لحساب الشركة",
    icon: Building,
  },
  {
    id: "stcpay",
    label: "STC Pay",
    desc: "الدفع عبر STC Pay",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "بطاقة ائتمانية",
    desc: "Visa / Mastercard عبر Moyasar",
    icon: CreditCard,
  },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["id"];

const BANK_INFO = {
  bankName: "البنك الأهلي السعودي",
  accountName: "شركة مسار العقار للتقنية",
  iban: "SA0000000000000000000000",
  swift: "NCBKSAJE",
};

function formatLimit(val: number) {
  return val === -1 ? "غير محدود" : val.toLocaleString("ar-SA");
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "basic";
  const { user, loading: authLoading } = useAuth();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Bank transfer form
  const [bankForm, setBankForm] = useState({
    bankName: "",
    transferDate: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    phone: "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.plans || []).find((p: Plan) => p.name === planParam);
        setPlan(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, planParam]);

  const handleBankTransfer = async () => {
    if (!plan) return;
    if (!bankForm.bankName || !bankForm.referenceNumber) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/payments/bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: plan.name,
          amountSar: plan.price,
          bankName: bankForm.bankName,
          transferDate: bankForm.transferDate,
          referenceNumber: bankForm.referenceNumber,
          phone: bankForm.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل في إرسال الطلب");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ. حاول مجدداً.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardPayment = async () => {
    if (!plan) return;
    setError("");
    setSubmitting(true);
    try {
      if (["starter", "growth", "pro"].includes(plan.name)) {
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: plan.name }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
          return;
        }
        setError(data.error || "فشل في إنشاء عملية الدفع");
      } else {
        setError(
          "الدفع بالبطاقة متاح للباقات: بداية، نمو، احترافي. استخدم التحويل البنكي للباقات الأخرى.",
        );
      }
    } catch {
      setError("حدث خطأ. حاول مجدداً.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (method === "bank_transfer") handleBankTransfer();
    else if (method === "card") handleCardPayment();
    else
      setError(
        "طريقة الدفع هذه ستكون متاحة قريباً. استخدم التحويل البنكي حالياً.",
      );
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-full bg-surface flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-text-primary font-bold mb-2">الباقة غير موجودة</p>
          <Link
            href="/dashboard/subscription"
            className="text-primary hover:underline text-sm"
          >
            العودة للباقات
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-full bg-surface flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center bg-background rounded-2xl border border-border p-8">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            تم استلام طلبك!
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            سيتم مراجعة التحويل وتفعيل الاشتراك خلال 24 ساعة. ستصلك رسالة
            بريد إلكتروني عند التأكيد.
          </p>
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            الرجوع للباقات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-surface">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          href="/dashboard/subscription"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للباقات
        </Link>

        <h1 className="text-2xl font-bold text-text-primary mb-8">
          إتمام الاشتراك
        </h1>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left — Payment form */}
          <div className="md:col-span-3 space-y-6">
            {/* Payment method selector */}
            <div className="bg-background rounded-2xl border border-border p-6">
              <h2 className="font-bold text-text-primary mb-4">طريقة الدفع</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      method === pm.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={pm.id}
                      checked={method === pm.id}
                      onChange={() => setMethod(pm.id)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        method === pm.id ? "border-primary" : "border-text-muted"
                      }`}
                    >
                      {method === pm.id && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                      )}
                    </div>
                    <pm.icon className="w-5 h-5 text-text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-text-primary text-sm">
                        {pm.label}
                      </p>
                      <p className="text-text-muted text-xs">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Bank transfer details */}
            {method === "bank_transfer" && (
              <div className="bg-background rounded-2xl border border-border p-6 space-y-5">
                <h2 className="font-bold text-text-primary">بيانات التحويل</h2>

                {/* Our bank info */}
                <div className="bg-surface rounded-xl p-4 border border-border space-y-2.5 text-sm">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">
                    حساب الشركة
                  </p>
                  <Row label="البنك" value={BANK_INFO.bankName} />
                  <Row label="اسم الحساب" value={BANK_INFO.accountName} />
                  <Row label="رقم IBAN" value={BANK_INFO.iban} mono />
                  <Row label="SWIFT" value={BANK_INFO.swift} mono />
                  <Row
                    label="المبلغ"
                    value={`${plan.price.toLocaleString("ar-SA")} ريال`}
                    highlight
                  />
                </div>

                {/* User input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      اسم البنك الذي حوّلت منه{" "}
                      <span className="text-error">*</span>
                    </label>
                    <input
                      value={bankForm.bankName}
                      onChange={(e) =>
                        setBankForm({ ...bankForm, bankName: e.target.value })
                      }
                      placeholder="مثال: بنك الراجحي"
                      className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        تاريخ التحويل <span className="text-error">*</span>
                      </label>
                      <input
                        type="date"
                        value={bankForm.transferDate}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            transferDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        رقم المرجع <span className="text-error">*</span>
                      </label>
                      <input
                        value={bankForm.referenceNumber}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            referenceNumber: e.target.value,
                          })
                        }
                        placeholder="رقم الحوالة"
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary text-sm"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      رقم الجوال (للتواصل)
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 bg-surface border border-l-0 border-border rounded-r-lg text-text-muted text-sm">
                        +966
                      </span>
                      <input
                        value={bankForm.phone}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, phone: e.target.value })
                        }
                        placeholder="5XXXXXXXX"
                        className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-l-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary text-sm"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {submitting ? "جاري الإرسال..." : "تأكيد الاشتراك"}
            </button>
          </div>

          {/* Right — Order summary */}
          <div className="md:col-span-2">
            <div className="bg-background rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="font-bold text-text-primary mb-5">ملخص الطلب</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">الباقة</span>
                  <span className="font-bold text-text-primary">
                    {plan.nameAr || plan.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">الفترة</span>
                  <span className="text-text-primary text-sm">شهري</span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">الإجمالي</span>
                  <span className="text-xl font-bold text-primary">
                    {plan.price.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
              </div>

              {/* Included */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                  يشمل الاشتراك
                </p>
                <FeatureRow
                  label={`${formatLimit(plan.maxProperties)} عقار`}
                />
                <FeatureRow
                  label={`${formatLimit(plan.maxAiMessages)} رسالة AI`}
                />
                <FeatureRow
                  label={`${formatLimit(plan.maxWhatsappMessages)} رسالة واتساب`}
                />
                {plan.features?.map((f, i) => (
                  <FeatureRow key={i} label={f} />
                ))}
              </div>

              <p className="text-xs text-text-muted mt-5 text-center">
                يمكن إلغاء الاشتراك في أي وقت
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{label}</span>
      <span
        className={`${mono ? "font-mono text-xs" : ""} ${highlight ? "text-primary font-bold" : "text-text-primary"}`}
      >
        {value}
      </span>
    </div>
  );
}

function FeatureRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
      <span className="text-text-secondary">{label}</span>
    </div>
  );
}
