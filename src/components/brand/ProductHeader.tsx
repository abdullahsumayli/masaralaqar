"use client";

import { cn } from "@/lib/utils";

interface ProductHeaderProps {
  /** Product name (e.g. "Saqr") */
  productName: string;
  /** Product tagline or subtitle */
  subtitle: string;
  /** Optional: show platform badge above product name */
  showPlatform?: boolean;
  className?: string;
}

const PLATFORM_NAME = "MQ";

/**
 * Product page header that shows platform + product hierarchy.
 * Display pattern: Masar Platform → Product name → Subtitle
 */
export function ProductHeader({
  productName,
  subtitle,
  showPlatform = true,
  className = "",
}: ProductHeaderProps) {
  return (
    <header className={cn("text-center", className)}>
      {showPlatform && (
        <p className="text-sm text-[#6B7280] mb-1">
          {PLATFORM_NAME}
        </p>
      )}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F0F4FF] mb-2">
        {productName}
      </h1>
      <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
        {subtitle}
      </p>
    </header>
  );
}
