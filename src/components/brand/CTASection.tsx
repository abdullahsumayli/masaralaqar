"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  /** Section headline */
  title: string;
  /** Optional short description */
  description?: string;
  /** CTA buttons or links */
  children: ReactNode;
  /** Optional background variant */
  variant?: "default" | "gradient" | "surface";
  className?: string;
}

/**
 * Reusable call-to-action block with title, description, and action area.
 * Use for final CTA, affiliate invite, or pricing upsell.
 */
export function CTASection({
  title,
  description,
  children,
  variant = "default",
  className = "",
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "py-20 md:py-28 px-4 relative overflow-hidden",
        variant === "gradient" &&
          "bg-gradient-to-b from-[#0A1628] via-surface to-background",
        variant === "surface" && "bg-surface/50",
        className
      )}
    >
      {variant === "gradient" && (
        <>
          <div className="absolute inset-0 bg-dot-pattern opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.08] rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="relative max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#F0F4FF] mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-[#94A3B8] text-lg mb-8">{description}</p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {children}
        </div>
      </div>
    </section>
  );
}
