"use client";

import { motion } from "framer-motion";
import { Clock, MessageSquare, Shield, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const badges = [
  {
    icon: Shield,
    label: "متوافق مع أنظمة الوساطة العقارية",
  },
  {
    icon: MessageSquare,
    label: "تكامل مع واتساب",
  },
  {
    icon: Clock,
    label: "نظام استقبال يعمل 24/7",
  },
  {
    icon: Users,
    label: "إدارة ذكية للعملاء",
  },
];

export default function SaqrTrust() {
  return (
    <section className="bg-white px-4 py-20 md:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-block rounded-full bg-[#0F7B63]/10 px-4 py-1.5 text-sm font-medium text-[#0F7B63]"
          >
            الثقة والامتثال
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-cairo text-3xl md:text-4xl font-bold text-[#2F3E46]"
          >
            نظام موثوق ومعتمد
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid gap-4 sm:grid-cols-2"
        >
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-center gap-4 rounded-xl border border-[#0F7B63]/15 bg-[#0F7B63]/[0.03] p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F7B63]/10">
                <badge.icon className="h-6 w-6 text-[#0F7B63]" />
              </div>
              <span className="text-[#2F3E46] text-lg font-semibold">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
