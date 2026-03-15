"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  available?: boolean;
  className?: string;
}

export function ProductCard({
  title,
  description,
  href,
  icon: Icon,
  available = true,
  className,
}: ProductCardProps) {
  const content = (
    <>
      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-4 group-hover:border-primary/40 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-[#F0F4FF] mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-[#94A3B8] text-sm flex-1">{description}</p>
      {available ? (
        <span className="inline-flex items-center gap-2 mt-4 text-primary font-medium text-sm">
          اكتشف المزيد
          <span className="group-hover:translate-x-1 transition-transform">←</span>
        </span>
      ) : (
        <span className="inline-flex items-center mt-4 text-[#475569] text-sm font-medium">
          قريباً
        </span>
      )}
    </>
  );

  const sharedClasses = cn(
    "rounded-2xl border p-6 flex flex-col transition-all group",
    available
      ? "border-primary/30 bg-[#111E35]/80 hover:border-primary/50 hover:bg-[#162444]/80"
      : "border-white/10 bg-[#0D1526]/60 opacity-90 cursor-default",
    className
  );

  if (available) {
    return (
      <Link href={href} className={sharedClasses}>
        {content}
      </Link>
    );
  }

  return <div className={sharedClasses}>{content}</div>;
}
