"use client";

import { cn } from "@/lib/utils";
import { PricingBadge } from "./PricingBadge";
import { PricingFeatureList } from "./PricingFeatureList";
import { PricingCTAButton } from "./PricingCTAButton";

export interface PricingPlan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  priceOriginal?: number;
  description?: string;
  features: string[];
  cta: string;
  ctaHref: string;
  ctaExternal?: boolean;
  popular?: boolean;
  badge?: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
  highlighted?: boolean;
}

export function PricingCard({ plan, className, highlighted }: PricingCardProps) {
  const displayPrice = plan.priceOriginal ?? plan.price;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 transition-all",
        highlighted
          ? "border-primary ring-2 ring-primary/25 scale-[1.02] md:scale-105"
          : "border-border hover:border-primary/30",
        className
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 right-1/2 translate-x-1/2">
          <PricingBadge>{plan.badge}</PricingBadge>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-bold text-text-primary">{plan.nameAr}</h3>
        {plan.description && (
          <p className="text-sm text-text-muted mt-1">{plan.description}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-text-primary">
            {plan.price.toLocaleString("ar-SA")}
          </span>
          <span className="text-text-muted">ر.س/شهر</span>
        </div>
        {plan.priceOriginal != null && plan.priceOriginal !== plan.price && (
          <p className="text-xs text-text-muted mt-1">
            <span className="line-through">{plan.priceOriginal.toLocaleString("ar-SA")} ر.س</span>
            {" "}(شهرك الأول بعد الخصم)
          </p>
        )}
      </div>

      <PricingFeatureList features={plan.features} className="flex-1 mb-8" />

      <PricingCTAButton
        href={plan.ctaHref}
        variant={highlighted ? "primary" : "secondary"}
        external={plan.ctaExternal}
      >
        {plan.cta}
      </PricingCTAButton>
    </div>
  );
}
