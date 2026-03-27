"use client";

import { motion } from "framer-motion";
import { Zap, MessageSquare, UserCheck, Calendar } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const solutions = [
  {
    icon: Zap,
    title: "رد فوري على العملاء",
    description: "MQ يرد تلقائياً خلال ثوانٍ على أي استفسار واتساب.",
  },
  {
    icon: MessageSquare,
    title: "تنظيم المحادثات",
    description: "كل المحادثات في مكان واحد مع تصنيف وتأهيل تلقائي.",
  },
  {
    icon: UserCheck,
    title: "تحويل الرسائل إلى ليد",
    description: "الاستفسارات تتحول إلى عملاء محتملين مؤهلين جاهزين للمتابعة.",
  },
  {
    icon: Calendar,
    title: "متابعة العملاء تلقائيًا",
    description: "تذكيرات ومتابعة ذكية حتى لا تضيع أي فرصة.",
  },
];

export function SolutionSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#0D1526]/50 border-t border-white/[0.06]">
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
            الحل
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold text-[#F0F4FF]"
          >
            كيف يحل MQ المشكلة؟
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 gap-4"
        >
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="rounded-2xl border border-primary/20 bg-[#111E35]/80 p-6 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
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
