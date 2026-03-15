"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Brain,
  Users,
  MessageCircle,
  Home,
  Clock,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: MessageSquare,
    title: "أتمتة واتساب",
    description: "ربط واتساب المكتب ورد تلقائي على كل الرسائل.",
  },
  {
    icon: Brain,
    title: "ردود ذكية بالذكاء الاصطناعي",
    description: "يفهم استفسارات العقار ويجيب بدقة وبلهجة احترافية.",
  },
  {
    icon: Users,
    title: "إدارة العملاء المحتملين",
    description: "تصنيف وتأهيل الليدز وتوزيعها على المسوقين.",
  },
  {
    icon: MessageCircle,
    title: "تتبع المحادثات",
    description: "سجل كامل للمحادثات وحالة كل عميل محتمل.",
  },
  {
    icon: Home,
    title: "ردود مبنية على العقارات",
    description: "يقترح عقارات من قائمتك وفق طلب العميل.",
  },
  {
    icon: Clock,
    title: "خدمة آلية 24/7",
    description: "يعمل ليل نهار دون توقف لاستقبال العملاء.",
  },
];

export function FeaturesSection() {
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
            المميزات
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-[#F0F4FF]"
          >
            كل ما تحتاجه في أداة واحدة
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}>
              <FeatureCard
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
