"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Handshake, MessageCircle, UserCheck } from "lucide-react";
import { WHATSAPP_URL, trackWhatsAppClick } from "../lib/tracking";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function SaqrHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white px-4 pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0F7B63]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0F7B63]/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Text column */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0F7B63]/10 px-4 py-1.5 text-sm font-medium text-[#0F7B63]">
              <span className="h-2 w-2 rounded-full bg-[#0F7B63] animate-pulse" />
              نظام MQ — مساعد استقبال ذكي
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-cairo text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.3] text-[#2F3E46] mb-6"
          >
            لا تضيع أي عميل
            <br />
            <span className="text-[#0F7B63]">بسبب تأخر الرد</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg text-lg md:text-xl text-[#2F3E46]/70 leading-relaxed mb-8"
          >
            MQ هو مساعد استقبال ذكي لمكاتب العقار يرد على العملاء فوراً عبر
            واتساب ويحوّل الاستفسارات إلى صفقات جاهزة للإغلاق.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("hero_cta")}
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#0F7B63] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#0F7B63]/25 transition-all hover:bg-[#0a6350] hover:shadow-xl hover:shadow-[#0F7B63]/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              جرّب MQ الآن
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-6 text-sm text-[#2F3E46]/50"
          >
            {[" بدون بطاقة ائتمان", "إعداد خلال دقائق", "يعمل عبر واتساب"].map(
              (txt) => (
                <span key={txt} className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-[#0F7B63]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {txt}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>

        {/* Visual column — WhatsApp conversation mockup */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden md:block"
        >
          <div className="relative mx-auto w-full max-w-sm">
            {/* Phone frame */}
            <div className="rounded-3xl border border-gray-200 bg-[#f0f2f5] p-4 shadow-2xl shadow-gray-200/60">
              {/* Chat header */}
              <div className="flex items-center gap-3 rounded-xl bg-[#0F7B63] px-4 py-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                  ع
                </div>
                <div>
                  <p className="text-white font-bold text-sm">نظام MQ</p>
                  <p className="text-white/70 text-xs">متصل الآن</p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-2.5 text-sm" dir="rtl">
                {/* Client message */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3.5 py-2.5 text-[#2F3E46]">
                    السلام عليكم، أبي شقة للإيجار بالرياض
                  </div>
                </div>
                {/* MQ reply */}
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[#2F3E46] shadow-sm">
                    أهلاً وسهلاً! 👋 أقدر أساعدك. كم ميزانيتك الشهرية؟
                  </div>
                </div>
                {/* Client */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3.5 py-2.5 text-[#2F3E46]">
                    من ٢٠ إلى ٣٠ ألف
                  </div>
                </div>
                {/* MQ */}
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[#2F3E46] shadow-sm">
                    ممتاز! كم غرفة تحتاج؟ وهل تفضل حي معين؟
                  </div>
                </div>
                {/* Bottom label */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-[#0F7B63] px-3.5 py-2.5 text-white shadow-sm text-xs font-medium">
                    ✅ عميل مؤهل — جاهز للتحويل للمسوق
                  </div>
                </div>
              </div>
            </div>

            {/* Flow arrows */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs font-medium text-[#2F3E46]/50">
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-[#0F7B63]" /> استفسار
              </span>
              <ArrowLeft className="h-3.5 w-3.5 text-gray-300" />
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
                <UserCheck className="h-3.5 w-3.5 text-[#0F7B63]" /> تأهيل
              </span>
              <ArrowLeft className="h-3.5 w-3.5 text-gray-300" />
              <span className="flex items-center gap-1 rounded-full bg-[#0F7B63]/10 px-3 py-1.5 text-[#0F7B63]">
                <Handshake className="h-3.5 w-3.5" /> صفقة
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
