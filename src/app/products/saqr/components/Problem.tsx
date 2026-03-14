"use client";

import { motion } from "framer-motion";
import { Clock, MessageSquareOff, RotateCcw, UserX } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const problems = [
  {
    icon: MessageSquareOff,
    text: "مكاتب العقار تستقبل عشرات الاستفسارات يومياً عبر واتساب",
  },
  {
    icon: Clock,
    text: "المسوقون لا يقدرون يردون على كل رسالة فوراً",
  },
  {
    icon: UserX,
    text: "العملاء يتوجهون لمكاتب ثانية إذا ما حصلوا رد سريع",
  },
  {
    icon: RotateCcw,
    text: "المسوقون يضيعون ساعات في الرد على أسئلة متكررة",
  },
];

export default function SaqrProblem() {
  return (
    <section className="bg-[#f8fafb] px-4 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-block rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600"
          >
            المشكلة
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-cairo text-3xl md:text-4xl font-bold text-[#2F3E46] mb-12"
          >
            لماذا تخسر مكاتب العقار عملاءها؟
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="space-y-4 mb-14"
        >
          {problems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <item.icon className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-[#2F3E46] text-base md:text-lg font-medium">
                {item.text}
              </p>
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
          <div className="relative inline-block rounded-2xl bg-[#2F3E46] px-8 py-6 md:px-12 md:py-8 text-white">
            <p className="text-xl md:text-2xl font-bold leading-relaxed font-cairo">
              الصفقات تضيع
              <br />
              <span className="text-[#0F7B63]">بسبب تأخر الرد.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
