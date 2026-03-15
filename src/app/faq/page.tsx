"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    q: "ما الفرق بين خطة المبتدئ والاحترافي؟",
    a: "المبتدئ يشمل مستخدم واحد ورقم واتساب واحد مع رد آلي أساسي وإدارة عملاء محتملين. الاحترافي يصل حتى 5 مستخدمين و5 أرقام واتساب، مع كتالوج عقارات، سير عمل أتمتة، وتحليلات متقدمة.",
  },
  {
    q: "كيف أربط واتساب بالنظام؟",
    a: "من لوحة التحكم تذهب إلى قسم واتساب، تمسح QR code يظهر على الشاشة من تطبيق واتساب على جوالك (واتساب > إعدادات الأجهزة المرتبطة > ربط جهاز). بعد الربط يبدأ صقر بالرد تلقائياً على الرسائل الواردة.",
  },
  {
    q: "هل يدعم النظام أكثر من رقم واتساب؟",
    a: "نعم. خطة المبتدئ تشمل رقم واحد، الاحترافي حتى 5 أرقام، وخطة الأعمال حتى 10 أرقام. كل رقم يربط بشكل مستقل ويدير محادثاته وعملاءه المحتملين.",
  },
  {
    q: "ما مدة التجربة المجانية؟",
    a: "14 يوماً. يمكنك تجربة صقر كاملاً بدون إدخال بطاقة ائتمان. بعد انتهاء المدة يمكنك الاشتراك في الخطة المناسبة.",
  },
  {
    q: "كيف يتم الدفع؟",
    a: "الدفع آمن عبر بوابة Moyasar (بطاقات مدى/فيزا/ماستركارد) أو تحويل بنكي. يتم خصم الاشتراك شهرياً حسب خطتك. يمكنك الإلغاء في أي وقت من لوحة التحكم.",
  },
  {
    q: "هل بياناتي آمنة؟",
    a: "نعم. نستخدم بنية تحتية آمنة، تشفير للاتصالات، ونسخ احتياطي للبيانات. لا نشارك بياناتك مع أطراف ثالثة وفق سياسة الخصوصية.",
  },
  {
    q: "ما هي خدمات مسار العقار؟",
    a: "نقدم حلول الذكاء الاصطناعي والأتمتة (نظام صقر)، إدارة العملاء والعقارات، والتدريب عبر أكاديمية مسار العقار.",
  },
  {
    q: "هل يمكنني حجز استشارة مجانية؟",
    a: "نعم، نقدم استشارات مجانية لمناقشة احتياجاتك واختيار الحل المناسب. تواصل معنا عبر نموذج التواصل أو واتساب.",
  },
];

function FaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function AccordionItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/[0.08] rounded-xl bg-[#111E35]/80 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-4 px-5 text-right hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-semibold text-[#F0F4FF]">{question}</span>
        <ChevronDown
          className={cn("w-5 h-5 text-[#94A3B8] flex-shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-4 px-5 text-[#94A3B8] text-sm leading-relaxed border-t border-white/[0.06] pt-3">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-[#F0F4FF]">
      <FaqSchema />
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-center mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5">
              Masar AlAqar
            </span>
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            الأسئلة الشائعة
          </h1>
          <p className="text-[#94A3B8] text-lg text-center mb-12">
            إجابات على الأسئلة الأكثر تكراراً عن المنصة ونظام صقر
          </p>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                question={item.q}
                answer={item.a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
