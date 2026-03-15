"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingFeatureListProps {
  features: string[];
  className?: string;
}

export function PricingFeatureList({ features, className }: PricingFeatureListProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
