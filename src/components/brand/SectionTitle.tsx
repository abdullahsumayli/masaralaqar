"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  /** Small label above the title (e.g. "المشكلة", "المميزات") */
  label?: string;
  /** Main section heading */
  title: ReactNode;
  /** Optional description below title */
  description?: string;
  /** Alignment */
  align?: "left" | "center";
  className?: string;
  /** Label style: blue badge or accent/gold */
  labelVariant?: "primary" | "accent";
}

/**
 * Reusable section title with optional badge and description.
 * Consistent typography and spacing across platform.
 */
export function SectionTitle({
  label,
  title,
  description,
  align = "center",
  className = "",
  labelVariant = "primary",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-12",
        align === "center" && "text-center",
        align === "left" && "text-right",
        className
      )}
    >
      {label && (
        <span
          className={cn(
            "inline-block rounded-full border text-sm font-medium px-4 py-1.5 mb-4",
            labelVariant === "primary" &&
              "bg-primary/10 border-primary/20 text-primary",
            labelVariant === "accent" &&
              "bg-accent/10 border-accent/20 text-accent"
          )}
        >
          {label}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-[#F0F4FF]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[#94A3B8] text-base md:text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
