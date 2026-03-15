"use client";

import { cn } from "@/lib/utils";

interface PricingBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function PricingBadge({ children, className }: PricingBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/25",
        className
      )}
    >
      {children}
    </span>
  );
}
