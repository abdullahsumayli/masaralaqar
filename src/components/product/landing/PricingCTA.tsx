"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const PRICING_URL = "/pricing";

const plans = [
  {
    name: "المبتدئ",
    price: "499",
    priceLabel: "ر.س/شهر",
    popular: false,
  },
  {
    name: "احترافي",
    price: "999",
    priceLabel: "ر.س/شهر",
    popular: true,
  },
  {
    name: "أعمال",
    price: "1,999",
    priceLabel: "ر.س/شهر",
    popular: false,
  },
];

export function PricingCTA() {
  return (
    <section className="py-16 md:py-24 px-4 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 mb-4"
          >
            الأسعار
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-[#F0F4FF]"
          >
            خطط تناسب كل مكتب
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-4 mb-10"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`rounded-2xl border p-6 text-center ${
                plan.popular
                  ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-white/[0.08] bg-[#111E35]/80"
              }`}
            >
              {plan.popular && (
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  الأكثر شعبية
                </div>
              )}
              <h3 className="font-bold text-[#F0F4FF] mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {plan.price}
                </span>
                <span className="text-[#94A3B8] text-sm">{plan.priceLabel}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center"
        >
          <Link
            href={PRICING_URL}
            className="btn-outline inline-flex items-center gap-2 px-8 py-4"
          >
            عرض الأسعار الكاملة
            <span className="rtl:rotate-180">←</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
