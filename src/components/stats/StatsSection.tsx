"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatItem {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface StatsSectionProps {
  title?: string;
  stats: StatItem[];
  className?: string;
}

export function StatsSection({ title, stats, className }: StatsSectionProps) {
  return (
    <section
      className={cn(
        "relative py-16 px-4 overflow-hidden border-y border-white/[0.06]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[#0D1526]/60" />
      <div className="relative max-w-5xl mx-auto">
        {title && (
          <h2 className="text-center text-xl font-bold text-[#F0F4FF] mb-10">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center"
              >
                {Icon && (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="text-3xl md:text-4xl font-bold text-[#F0F4FF] mb-1">
                  {stat.value}
                </div>
                <div className="text-[#94A3B8] text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
