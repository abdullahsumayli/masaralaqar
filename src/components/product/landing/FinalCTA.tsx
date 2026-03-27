"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";

const REGISTER_URL = "/auth/signup";
const PRICING_URL = "/pricing";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0D1526] to-[#070B14]" />
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.08] rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F0F4FF] mb-4">
            ابدأ استخدام MQ اليوم
          </h2>
          <p className="text-[#94A3B8] text-lg mb-8">
            انضم لمئات المكاتب العقارية التي توفر وقتها وتزيد مبيعاتها بـ MQ.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={REGISTER_URL}
              className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              ابدأ التجربة المجانية
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href={PRICING_URL}
              className="btn-outline text-base px-8 py-4 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              عرض الأسعار
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-[#475569] text-sm mt-6 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              بدون بطاقة ائتمان
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              إعداد خلال دقائق
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
