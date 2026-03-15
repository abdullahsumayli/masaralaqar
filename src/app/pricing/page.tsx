"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Tag, X } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PricingCard, type PricingPlan } from "@/components/pricing/PricingCard";
import { PricingSchema } from "@/components/pricing/PricingSchema";

const COUPON_COOKIE_NAME = "saqr_coupon";

function getCouponCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COUPON_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCouponCookie(code: string, discountPercent: number) {
  if (typeof document === "undefined") return;
  const value = JSON.stringify({ code, discountPercent });
  document.cookie = `${COUPON_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
}

function clearCouponCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COUPON_COOKIE_NAME}=; path=/; max-age=0`;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    nameAr: "المبتدئ",
    price: 499,
    description: "مثالي للبداية",
    features: [
      "مستخدم واحد",
      "رقم واتساب واحد",
      "رد آلي ذكي أساسي",
      "إدارة العملاء المحتملين",
      "تحليلات أساسية",
    ],
    cta: "ابدأ الآن",
    ctaHref: "/auth/signup",
  },
  {
    id: "pro",
    name: "Pro",
    nameAr: "احترافي",
    price: 999,
    description: "للفرق والمكاتب النامية",
    features: [
      "حتى 5 مستخدمين",
      "حتى 5 أرقام واتساب",
      "ردود ذكية متقدمة",
      "إدارة العملاء",
      "كتالوج العقارات",
      "سير عمل أتمتة",
      "تحليلات متقدمة",
    ],
    cta: "ابدأ الخطة الاحترافية",
    ctaHref: "/auth/signup",
    popular: true,
    badge: "الأكثر شعبية",
  },
  {
    id: "business",
    name: "Business",
    nameAr: "أعمال",
    price: 1999,
    description: "للشركات الكبرى",
    features: [
      "حتى 10 مستخدمين",
      "حتى 10 أرقام واتساب",
      "أتمتة ذكية متقدمة",
      "إدارة الفريق",
      "تقارير متقدمة",
      "دعم ذو أولوية",
    ],
    cta: "تواصل مع المبيعات",
    ctaHref: "/contact",
    ctaExternal: false,
  },
];

export default function PricingPage() {
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const saved = getCouponCookie();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.code && parsed?.discountPercent) {
          setCouponApplied({ code: parsed.code, discountPercent: parsed.discountPercent });
        }
      } catch {
        clearCouponCookie();
      }
    }
  }, []);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setValidating(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/affiliate/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid && data.discountPercent) {
        setCouponApplied({ code: data.code || code, discountPercent: data.discountPercent });
        setCouponCookie(data.code || code, data.discountPercent);
      } else {
        setCouponError("كود غير صالح أو منتهي");
      }
    } catch {
      setCouponError("حدث خطأ في التحقق");
    } finally {
      setValidating(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponCode("");
    setCouponError(null);
    clearCouponCookie();
  };

  const plans: PricingPlan[] = DEFAULT_PLANS.map((p) => {
    if (!couponApplied || p.price === 0) return { ...p, ctaHref: p.ctaHref };
    const discount = (p.price * couponApplied.discountPercent) / 100;
    const firstMonthPrice = Math.round(p.price - discount);
    return {
      ...p,
      price: firstMonthPrice,
      priceOriginal: p.price,
      ctaHref: `/auth/signup?coupon=${encodeURIComponent(couponApplied.code)}`,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <PricingSchema />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <p className="text-center mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5">
            Masar AlAqar
          </span>
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary text-center mb-4">
          خطط التسعير
        </h1>
        <p className="text-xl text-text-secondary text-center mb-12">
          اختر الخطة المناسبة لمكتبك العقاري — صقر ومنتجات المنصة
        </p>

        {/* Coupon */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[180px] flex gap-2">
              <span className="flex items-center gap-2 text-text-muted text-sm flex-shrink-0">
                <Tag className="w-4 h-4" />
                كود خصم
              </span>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setCouponError(null);
                }}
                placeholder="مثال: SAQR10"
                className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted"
                disabled={!!couponApplied}
              />
            </div>
            {couponApplied ? (
              <button
                type="button"
                onClick={removeCoupon}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/15 text-primary border border-primary/25 text-sm font-medium"
              >
                <X className="w-4 h-4" />
                إزالة {couponApplied.code}
              </button>
            ) : (
              <button
                type="button"
                onClick={applyCoupon}
                disabled={validating || !couponCode.trim()}
                className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                تطبيق
              </button>
            )}
          </div>
          {couponError && (
            <p className="text-red-400 text-sm mt-2">{couponError}</p>
          )}
          {couponApplied && (
            <p className="text-green-400 text-sm mt-2">
              خصم {couponApplied.discountPercent}% على الشهر الأول
            </p>
          )}
        </div>

        {/* 3 column layout — Pro larger + highlighted */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          <PricingCard plan={plans[0]} />
          <PricingCard plan={plans[1]} highlighted />
          <PricingCard plan={plans[2]} />
        </div>

        {/* جدول مقارنة الخطط */}
        <section className="mt-24 overflow-x-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            مقارنة الخطط
          </h2>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-right py-4 px-4 text-text-primary font-semibold w-[45%]">الميزة</th>
                  <th className="text-center py-4 px-4 text-text-primary font-semibold">المبتدئ</th>
                  <th className="text-center py-4 px-4 text-primary font-semibold bg-primary/5">احترافي</th>
                  <th className="text-center py-4 px-4 text-text-primary font-semibold">أعمال</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ["عدد المستخدمين", "1", "حتى 5", "حتى 10"],
                  ["عدد أرقام واتساب", "1", "حتى 5", "حتى 10"],
                  ["رد آلي ذكي", "✅", "✅", "✅"],
                  ["إدارة العملاء المحتملين", "✅", "✅", "✅"],
                  ["كتالوج العقارات", "❌", "✅", "✅"],
                  ["سير عمل أتمتة", "❌", "✅", "✅"],
                  ["تحليلات متقدمة", "أساسية", "✅", "✅"],
                  ["إدارة الفريق", "❌", "❌", "✅"],
                  ["تقارير متقدمة", "❌", "❌", "✅"],
                  ["دعم ذو أولوية", "❌", "❌", "✅"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-text-primary">{row[0]}</td>
                    <td className="py-3 px-4 text-center">{row[1]}</td>
                    <td className="py-3 px-4 text-center bg-primary/5">{row[2]}</td>
                    <td className="py-3 px-4 text-center">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Compare the Cost */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            قارن التكلفة
          </h2>
          <div className="max-w-2xl mx-auto overflow-x-auto">
            <table className="w-full border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-surface">
                  <th className="text-right py-4 px-4 text-text-primary font-semibold">البديل</th>
                  <th className="text-right py-4 px-4 text-text-primary font-semibold">التكلفة/شهر</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                <tr className="border-t border-border">
                  <td className="py-3 px-4">3 موظفين خدمة عملاء</td>
                  <td className="py-3 px-4">12,000 ر.س</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-3 px-4">نظام صقر</td>
                  <td className="py-3 px-4 text-primary font-semibold">ابتداءً من 499 ر.س</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Trust */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            لماذا تثق بنا؟
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "إلغاء في أي وقت", desc: "لا التزامات طويلة المدى" },
              { title: "دفع آمن", desc: "معاملات مشفرة وآمنة" },
              { title: "أتمتة بالذكاء الاصطناعي", desc: "ردود ذكية وتوفير وقتك" },
              { title: "موثوق من فرق عقارية", desc: "مكاتب حقيقية تستخدم صقر من Masar AlAqar" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface border border-border rounded-xl p-5 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
