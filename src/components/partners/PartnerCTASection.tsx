"use client";

import Link from "next/link";
import { ArrowLeft, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerCTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export function PartnerCTASection({
  title = "انضم كشريك",
  description = "شركات ووكالات تسويق وعقارات — ادعم منصة MQ واربح معنا.",
  buttonText = "تقديم طلب شراكة",
  buttonHref = "/contact?subject=partnership",
  className,
}: PartnerCTASectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
            <Handshake className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F0F4FF] mb-1">{title}</h3>
            <p className="text-[#94A3B8] text-sm">{description}</p>
          </div>
        </div>
        <Link
          href={buttonHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shrink-0"
        >
          {buttonText}
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
