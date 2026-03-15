"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  /** Section id for anchor links */
  id?: string;
  /** Vertical padding: default py-16 md:py-24 */
  className?: string;
  /** Optional: alternate background (e.g. surface) */
  variant?: "default" | "surface" | "muted";
}

/**
 * Unified section wrapper for consistent vertical spacing and optional background.
 * Use for major page sections (hero, features, CTA, etc.).
 */
export function SectionContainer({
  children,
  id,
  className = "",
  variant = "default",
}: SectionContainerProps) {
  const bgClass =
    variant === "surface"
      ? "bg-surface"
      : variant === "muted"
        ? "bg-white/[0.02]"
        : "";

  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        bgClass,
        variant === "default" && "border-t border-white/[0.06]",
        className
      )}
    >
      {children}
    </section>
  );
}
