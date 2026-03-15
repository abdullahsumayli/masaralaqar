"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  /** Max width: default max-w-7xl */
  className?: string;
  /** Optional: use narrow width for reading (e.g. blog) */
  narrow?: boolean;
}

/**
 * Unified page container for consistent horizontal padding and max-width.
 * Use on all marketing and product pages.
 */
export function PageContainer({
  children,
  className = "",
  narrow = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}
