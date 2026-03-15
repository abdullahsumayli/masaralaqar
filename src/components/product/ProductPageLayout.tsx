"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface ProductPageLayoutProps {
  children: ReactNode;
  /** Optional: custom wrapper class */
  className?: string;
}

/**
 * Reusable layout for product pages (e.g. Saqr).
 * Includes: Navbar, main content area, Footer.
 * Product pages should include: Hero, Problem, Solution, Features, Pricing CTA, FAQ.
 */
export function ProductPageLayout({ children, className = "" }: ProductPageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background text-[#F0F4FF] ${className}`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
