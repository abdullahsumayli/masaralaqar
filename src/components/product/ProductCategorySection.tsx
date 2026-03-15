"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProductCategorySectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ProductCategorySection({
  title,
  description,
  children,
  className,
}: ProductCategorySectionProps) {
  return (
    <section className={cn("mb-12", className)}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#F0F4FF] mb-1">{title}</h2>
        {description && (
          <p className="text-[#94A3B8] text-sm">{description}</p>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </section>
  );
}
