"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProductHeader } from "@/components/brand/ProductHeader";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const REGISTER_URL = "/auth/signup";
const PRICING_URL = "/pricing";

export function ProductHero() {
  return (
    <section className="relative pt-24 md:pt-28 pb-16 md:pb-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.06] rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          <motion.div variants={fadeUp}>
            <ProductHeader
              productName="MQ"
              subtitle="AI WhatsApp assistant for real estate."
              showPlatform
            />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#F0F4FF] leading-tight"
          >
            الرد الذكي لعملاء العقار عبر واتساب
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed"
          >
            لا تضيع أي عميل بعد اليوم. MQ يرد على استفسارات العقار تلقائيًا ويحوّلها إلى فرص بيع.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={REGISTER_URL}
              className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2"
            >
              ابدأ التجربة المجانية
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href={PRICING_URL}
              className="btn-outline text-base px-8 py-4 inline-flex items-center gap-2"
            >
              عرض الأسعار
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#475569]"
          >
            {["بدون بطاقة ائتمان", "إعداد خلال دقائق", "يعمل 24/7"].map(
              (txt) => (
                <span key={txt} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {txt}
                </span>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
