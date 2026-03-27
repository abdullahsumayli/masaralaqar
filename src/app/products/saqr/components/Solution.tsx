"use client";

import { motion } from "framer-motion";
import {
    ClipboardList,
    HelpCircle,
    MessageCircle,
    UserCheck,
    Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "العميل يرسل رسالة واتساب",
    description: "أي استفسار عقاري يوصل مباشرة ل MQ",
    color: "bg-blue-50 text-blue-600",
  },
  {
    number: "02",
    icon: Zap,
    title: "MQ يرد فوراً",
    description: "رد تلقائي خلال ثوانٍ — بدون أي تأخير",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    number: "03",
    icon: HelpCircle,
    title: "يسأل أسئلة التأهيل",
    description: "المدينة، نوع العقار، الميزانية، عدد الغرف",
    color: "bg-amber-50 text-amber-600",
  },
  {
    number: "04",
    icon: ClipboardList,
    title: "يجمع بيانات العميل",
    description: "ينظّم المعلومات تلقائياً في ملف العميل",
    color: "bg-violet-50 text-violet-600",
  },
  {
    number: "05",
    icon: UserCheck,
    title: "يحوّل عميل مؤهل للمسوق",
    description: "المسوق يستلم عميل جاهز — يبدأ الإغلاق مباشرة",
    color: "bg-rose-50 text-rose-600",
  },
];

export default function SaqrSolution() {
  return (
    <section className="bg-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-block rounded-full bg-[#0F7B63]/10 px-4 py-1.5 text-sm font-medium text-[#0F7B63]"
          >
            الحل
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-cairo text-3xl md:text-4xl font-bold text-[#2F3E46] mb-4"
          >
            كيف يعمل نظام MQ؟
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[#2F3E46]/60 text-lg max-w-xl mx-auto"
          >
            من الاستفسار إلى العميل المؤهل — تلقائياً
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="relative"
        >
          {/* Vertical connector line */}
          <div className="absolute right-6 md:right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#0F7B63]/20 to-transparent hidden md:block" />

          <div className="space-y-6 md:space-y-0">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-0 ${
                    i > 0 ? "md:mt-8" : ""
                  }`}
                >
                  {/* Left content (even) or spacer */}
                  <div
                    className={`w-full md:w-1/2 ${isEven ? "md:pl-12 md:text-left" : "md:order-3 md:pr-12 md:text-right"}`}
                  >
                    <div
                      className={`rounded-xl border border-gray-100 bg-white p-6 shadow-sm ${isEven ? "md:mr-8" : "md:ml-8"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.color}`}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-bold text-[#0F7B63]/40">
                          الخطوة {step.number}
                        </span>
                      </div>
                      <h3 className="font-cairo text-xl font-bold text-[#2F3E46] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[#2F3E46]/60">{step.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-[3px] border-[#0F7B63] bg-white z-10" />

                  {/* Right spacer (even) or content */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
