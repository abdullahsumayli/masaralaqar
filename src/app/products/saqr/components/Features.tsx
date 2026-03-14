"use client";

import { motion } from "framer-motion";
import { Filter, TrendingUp, UserCheck, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Zap,
    title: "رد فوري",
    description: "صقر يرد على العملاء فوراً عبر واتساب.",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: UserCheck,
    title: "تأهيل العميل",
    description: "يجمع بيانات العميل مثل المدينة ونوع العقار والميزانية.",
    gradient: "from-blue-500/10 to-blue-500/5",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Filter,
    title: "تصفية العملاء",
    description: "يفصل العملاء الجادين عن الاستفسارات العامة.",
    gradient: "from-violet-500/10 to-violet-500/5",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: TrendingUp,
    title: "تحويل الصفقات",
    description: "يحوّل الاستفسارات إلى فرص بيع جاهزة للمسوق.",
    gradient: "from-amber-500/10 to-amber-500/5",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function SaqrFeatures() {
  return (
    <section className="bg-[#f8fafb] px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-block rounded-full bg-[#0F7B63]/10 px-4 py-1.5 text-sm font-medium text-[#0F7B63]"
          >
            المميزات
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-cairo text-3xl md:text-4xl font-bold text-[#2F3E46]"
          >
            كل ما تحتاجه في نظام واحد
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br ${feature.gradient} p-8 transition-shadow hover:shadow-md`}
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${feature.iconBg}`}
              >
                <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
              </div>
              <h3 className="font-cairo text-xl font-bold text-[#2F3E46] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#2F3E46]/65 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
