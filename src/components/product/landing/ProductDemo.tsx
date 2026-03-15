"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ProductDemo() {
  return (
    <section className="py-16 md:py-24 px-4 bg-[#0D1526]/50 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 mb-4">
            معاينة
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F0F4FF]">
            لوحة التحكم ومثال المحادثات
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Dashboard placeholder */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111E35] aspect-[4/3] flex items-center justify-center overflow-hidden">
            <div className="text-center p-8">
              <LayoutDashboard className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <p className="text-[#94A3B8] text-sm font-medium">
                لقطة شاشة لوحة التحكم
              </p>
              <p className="text-[#475569] text-xs mt-1">
                إحصائيات، محادثات، عملاء محتملون
              </p>
            </div>
          </div>

          {/* WhatsApp conversation placeholder */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#111E35] aspect-[4/3] flex items-center justify-center overflow-hidden">
            <div className="text-center p-8">
              <MessageSquare className="w-16 h-16 text-[#25D366]/50 mx-auto mb-4" />
              <p className="text-[#94A3B8] text-sm font-medium">
                مثال محادثة واتساب
              </p>
              <p className="text-[#475569] text-xs mt-1">
                رد تلقائي وتأهيل العميل
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
