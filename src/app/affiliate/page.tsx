"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Share2, ArrowLeft, Wallet, Users, Gift } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const commissionSteps = [
  { year: "السنة الأولى", pct: "30%", desc: "عمولة على كل دفعة من العميل المُحال" },
  { year: "السنة الثانية", pct: "20%", desc: "عمولة مستمرة حتى الشهر 24" },
  { year: "السنة الثالثة", pct: "10%", desc: "عمولة حتى الشهر 36 ثم تتوقف" },
];

const howItWorks = [
  { step: 1, title: "انضم للبرنامج", desc: "سجّل كشريك واحصل على رابط إحالة وكوبونات خاصة" },
  { step: 2, title: "شارك الرابط", desc: "انشر رابطك أو كوبونك مع العملاء والمتابعين" },
  { step: 3, title: "احصل على العمولة", desc: "عند اشتراك العميل نُحوّل لك عمولتك تلقائياً" },
];

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-background text-[#F0F4FF]">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Share2 className="w-4 h-4" />
              برنامج الإحالة
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ما هو برنامج <span className="text-primary">الإحالة</span>؟
            </h1>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              انضم كشريك واربح عمولة عند إحالة مكاتب عقارية أو وكلاء لاستخدام منصة{" "}
              <span className="font-cairo font-semibold text-primary">MQ</span>. 
              عمولات متدرجة على مدى 36 شهراً مع إمكانية عمولة إضافية للإحالة ضمن الإحالة.
            </p>
          </motion.section>

          {/* Commission structure */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" />
              هيكل العمولات
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {commissionSteps.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.08] bg-[#111E35]/80 p-5"
                >
                  <div className="text-2xl font-bold text-primary mb-1">{s.pct}</div>
                  <div className="text-[#F0F4FF] font-medium mb-2">{s.year}</div>
                  <p className="text-[#94A3B8] text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[#475569] text-sm mt-4">
              إحالة ضمن الإحالة (طبقة ثانية): عمولة إضافية 5% للشريك الذي أدخل الشريك المُحيل.
            </p>
          </motion.section>

          {/* How it works */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              كيف يعمل؟
            </h2>
            <div className="space-y-4">
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-2xl border border-white/[0.08] bg-[#111E35]/80 p-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 font-bold text-primary">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F0F4FF] mb-1">{item.title}</h3>
                    <p className="text-[#94A3B8] text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center rounded-2xl border border-primary/20 bg-primary/5 p-10"
          >
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">انضم لبرنامج الإحالة</h2>
            <p className="text-[#94A3B8] mb-6 max-w-md mx-auto">
              سجّل دخولك ثم ادخل إلى لوحة الإحالة من القائمة لإنشاء رابطك وكوبوناتك ومراقبة أرباحك.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold"
              >
                إنشاء حساب
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 font-semibold"
              >
                لدي حساب — دخول
              </Link>
            </div>
            <p className="text-[#475569] text-sm mt-4">
              بعد الدخول: من القائمة الجانبية اختر &quot;برنامج الإحالة&quot; للوصول للوحة الشريك.
            </p>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
