"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#111E35]/80 p-6 flex flex-col transition-colors hover:border-primary/20 hover:bg-[#162444]/80",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-bold text-[#F0F4FF] mb-2">{title}</h3>
      {description && (
        <p className="text-[#94A3B8] text-sm flex-1">{description}</p>
      )}
    </div>
  );
}
