"use client";

import Link from "next/link";
import { ArrowLeft, Gift, Share2 } from "lucide-react";

interface AffiliateCTASectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export function AffiliateCTASection({
  title = "انضم لبرنامج الإحالة",
  description = "اربح عمولة عند إحالة مكاتب عقارية لمنصة Masar AlAqar. السنة الأولى 30%، الثانية 20%، الثالثة 10%. إحالة ضمن الإحالة: 5% إضافية.",
  className = "",
}: AffiliateCTASectionProps) {
  return (
    <section
      className={`rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
            <Share2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F0F4FF] mb-1">{title}</h3>
            <p className="text-[#94A3B8] text-sm">{description}</p>
          </div>
        </div>
        <Link
          href="/affiliate"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shrink-0"
        >
          <Gift className="w-4 h-4" />
          اعرف المزيد
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
