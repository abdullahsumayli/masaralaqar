"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { WHATSAPP_URL, trackWhatsAppClick } from "../lib/tracking";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function SaqrCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0F7B63] px-4 py-20 md:py-28">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="font-cairo text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
        >
          ابدأ تحويل استفسارات العملاء إلى صفقات
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          تواصل معنا عبر واتساب وخلنا نفعّل MQ لمكتبك خلال دقائق
        </motion.p>
        <motion.div variants={fadeUp}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("final_cta")}
            className="group inline-flex items-center gap-3 rounded-xl bg-white px-10 py-4 text-lg font-bold text-[#0F7B63] shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* WhatsApp icon */}
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            تحدث مع MQ الآن
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
