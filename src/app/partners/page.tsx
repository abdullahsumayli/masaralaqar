"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PartnerCTASection } from "@/components/partners/PartnerCTASection";
import { Handshake, Users, Gift } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const benefits = [
  {
    icon: Gift,
    title: "عمولات وتسهيلات",
    description: "مزايا مالية وحزم خاصة للشركاء حسب حجم التعاون.",
  },
  {
    icon: Users,
    title: "دعم مخصص",
    description: "فريق علاقات شركاء لتسريع النمو وحل الاستفسارات.",
  },
  {
    icon: Handshake,
    title: "مواد تسويقية",
    description: "عروض تقديمية، فيديوهات ومواد جاهزة للتسويق المشترك.",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background text-[#F0F4FF]">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Handshake className="w-4 h-4" />
              برنامج الشركاء
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4">
              ما هو برنامج <span className="text-primary">الشركاء</span>؟
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              نستهدف شركات التقنية، وكالات التسويق، والمكاتب العقارية الكبرى لتعزيز انتشار منصة{" "}
              <span className="font-cairo font-semibold text-primary">MQ</span>. 
              كشريك يمكنك الترويج أو إعادة البيع أو دمج الحلول مع عملائك مقابل مزايا وعمولات.
            </motion.p>
          </motion.section>

          {/* Who should join */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-6">
              من يمكنه الانضمام؟
            </motion.h2>
            <ul className="space-y-3 text-[#94A3B8]">
              {[
                "شركات تقنية وبرمجيات تخدم قطاع العقار",
                "وكالات تسويق رقمي ورعاية عقارية",
                "مكاتب عقارية كبيرة ترغب في تقديم الحل لشبكة معارفها",
                "مدربون ومستشارون في المجال العقاري",
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Benefits */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-6">
              مزايا الشراكة
            </motion.h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.title}
                    variants={fadeUp}
                    className="rounded-2xl border border-white/[0.08] bg-[#111E35]/60 p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-[#F0F4FF] mb-2">{b.title}</h3>
                    <p className="text-[#94A3B8] text-sm">{b.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <PartnerCTASection
              title="تقديم طلب شراكة"
              description="أخبرنا عن شركتك أو وكالتك ونرجع إليك خلال 48 ساعة."
              buttonText="تواصل معنا"
              buttonHref="/contact?subject=partnership"
            />
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
