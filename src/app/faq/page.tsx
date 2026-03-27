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
    a: "من لوحة التحكم تذهب إلى قسم واتساب، تمسح QR code يظهر على الشاشة من تطبيق واتساب على جوالك (واتساب > إعدادات الأجهزة المرتبطة > ربط جهاز). بعد الربط يبدأ MQ بالرد تلقائياً على الرسائل الواردة.",
  },
  {
    q: "هل يدعم النظام أكثر من رقم واتساب؟",
    a: "نعم. خطة المبتدئ تشمل رقم واحد، الاحترافي حتى 5 أرقام، وخطة الأعمال حتى 10 أرقام. كل رقم يربط بشكل مستقل ويدير محادثاته وعملاءه المحتملين.",
  },
  {
    q: "ما مدة التجربة المجانية؟",
    a: "14 يوماً. يمكنك تجربة MQ كاملاً بدون إدخال بطاقة ائتمان. بعد انتهاء المدة يمكنك الاشتراك في الخطة المناسبة.",
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
    q: "ما هي خدمات MQ؟",
    a: "نقدم حلول الذكاء الاصطناعي والأتمتة (نظام MQ)، إدارة العملاء والعقارات، والتدريب عبر أكاديمية MQ.",
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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right transition-colors hover:bg-card-hover"
      >
        <span className="font-cairo font-semibold text-text-primary">{question}</span>
        <ChevronDown
          className={cn("h-5 w-5 flex-shrink-0 text-text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border px-5 pb-4 pt-3 font-ibm-arabic text-sm leading-relaxed text-text-secondary">
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
    <div className="min-h-screen bg-background text-text-primary">
      <FaqSchema />
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-center mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5">
              MQ
            </span>
          </p>
          <h1 className="mb-4 text-center font-cairo text-4xl font-bold md:text-5xl">
            الأسئلة الشائعة
          </h1>
          <p className="mb-12 text-center font-ibm-arabic text-lg text-text-secondary">
            إجابات على الأسئلة الأكثر تكراراً عن منصة MQ
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
