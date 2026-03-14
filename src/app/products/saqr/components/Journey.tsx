"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Briefcase, User } from "lucide-react";
import { useState } from "react";

const tabs = [
  {
    id: "client",
    label: "العميل",
    icon: User,
    steps: [
      "يرسل استفسار عبر واتساب",
      "يحصل على رد فوري من صقر",
      "يحدد احتياجه بدقة",
    ],
  },
  {
    id: "saqr",
    label: "صقر",
    icon: Bot,
    steps: [
      "يطرح الأسئلة على العميل",
      "يجمع المعلومات الأساسية",
      "يصنّف الطلب حسب الجدية",
    ],
  },
  {
    id: "agent",
    label: "المسوق",
    icon: Briefcase,
    steps: [
      "يستلم عميل جاهز للتواصل",
      "يراجع ملف العميل المؤهل",
      "يبدأ عملية الإغلاق مباشرة",
    ],
  },
];

const fadeContent = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function SaqrJourney() {
  const [activeTab, setActiveTab] = useState("client");
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="bg-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="mb-4 inline-block rounded-full bg-[#0F7B63]/10 px-4 py-1.5 text-sm font-medium text-[#0F7B63]">
            رحلة الاستخدام
          </span>
          <h2 className="font-cairo text-3xl md:text-4xl font-bold text-[#2F3E46]">
            تجربة سلسة لكل طرف
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#0F7B63] text-white shadow-md shadow-[#0F7B63]/20"
                    : "bg-gray-100 text-[#2F3E46]/70 hover:bg-gray-200"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeContent}
            className="mx-auto max-w-lg"
          >
            <div className="space-y-3">
              {active.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl bg-[#f8fafb] p-5 border border-gray-100"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F7B63] text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <span className="text-[#2F3E46] font-medium">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
