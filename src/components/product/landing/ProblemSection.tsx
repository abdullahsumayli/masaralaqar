"use client";

import { motion } from "framer-motion";
import { MessageSquare, UserX, Clock, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const problems = [
  {
    icon: MessageSquare,
    title: "كثرة رسائل واتساب",
    description: "المكاتب تستقبل عشرات الاستفسارات يومياً ولا تستطيع الرد على الكل.",
  },
  {
    icon: UserX,
    title: "ضياع العملاء",
    description: "العملاء يتحولون للمنافسين عند عدم الحصول على رد سريع.",
  },
  {
    icon: Clock,
    title: "الرد المتأخر",
    description: "المسوقون مشغولون ولا يقدرون متابعة كل محادثة في الوقت المناسب.",
  },
  {
    icon: Users,
    title: "ضغط العمل على المسوقين",
    description: "ساعات مهدرة في الرد على أسئلة متكررة بدلاً من إغلاق الصفقات.",
  },
];

export function ProblemSection() {
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
            className="inline-block rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium px-4 py-1.5 mb-4"
          >
            المشكلة
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-[#F0F4FF]"
          >
            التحديات التي تواجه المكاتب العقارية
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 gap-4"
        >
          {problems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="rounded-2xl border border-white/[0.08] bg-[#111E35]/80 p-6 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F0F4FF] mb-1">{item.title}</h3>
                  <p className="text-[#94A3B8] text-sm">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
