"use client";

import { motion } from "framer-motion";
import { Wallet, Zap, TrendingUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const benefits = [
  {
    icon: Wallet,
    title: "وفر تكلفة 3 موظفين",
    description: "MQ ينوب عن فريق استقبال كامل بتكلفة اشتراك واحدة.",
  },
  {
    icon: Zap,
    title: "رد فوري لجميع العملاء",
    description: "لا عميل ينتظر — كل استفسار يحصل على رد خلال ثوانٍ.",
  },
  {
    icon: TrendingUp,
    title: "زيادة تحويل استفسارات العقار",
    description: "تأهيل ذكي ومتابعة تلقائية ترفع نسبة التحويل إلى صفقات.",
  },
];

export function BenefitsSection() {
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
            className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium px-4 py-1.5 mb-4"
          >
            الفائدة
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-[#F0F4FF]"
          >
            لماذا تختار MQ؟
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="rounded-2xl border border-amber-500/20 bg-[#111E35]/80 p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-bold text-[#F0F4FF] mb-2">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
