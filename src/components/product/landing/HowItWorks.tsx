"use client";

import { motion } from "framer-motion";
import { Link2, MessageSquare, UserCheck } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const steps = [
  {
    step: 1,
    icon: Link2,
    title: "اربط واتساب المكتب",
    description: "ربط رقم واتساب المكتب بالنظام خلال دقائق.",
  },
  {
    step: 2,
    icon: MessageSquare,
    title: "صقر يستقبل الرسائل",
    description: "كل استفسار يصل لصقر الذي يرد فوراً بذكاء اصطناعي.",
  },
  {
    step: 3,
    icon: UserCheck,
    title: "النظام يحول الاستفسارات إلى عملاء محتملين",
    description: "الليدز المؤهلة تظهر في لوحة التحكم جاهزة للمتابعة.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#0D1526]/50 border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto">
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
            كيف يعمل
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-[#F0F4FF]"
          >
            ثلاث خطوات للبدء
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="space-y-6"
        >
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="flex gap-6 items-start rounded-2xl border border-white/[0.08] bg-[#111E35]/80 p-6"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 font-bold text-primary text-xl">
                  {item.step}
                </div>
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F0F4FF] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#94A3B8] text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
