"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingCTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  external?: boolean;
}

export function PricingCTAButton({
  href,
  children,
  variant = "primary",
  className,
  external,
}: PricingCTAButtonProps) {
  const base =
    "inline-flex items-center justify-center w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all";
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20",
    secondary: "bg-card hover:bg-card-hover border border-border text-text-primary",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, variants[variant], className)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
