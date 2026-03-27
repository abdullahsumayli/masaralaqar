"use client";

import { ScrollToHashOnMount } from "@/components/ScrollToHashOnMount";
import { ProductPageLayout } from "@/components/product/ProductPageLayout";
import { ProductHero } from "@/components/product/landing/ProductHero";
import { ProblemSection } from "@/components/product/landing/ProblemSection";
import { SolutionSection } from "@/components/product/landing/SolutionSection";
import { FeaturesSection } from "@/components/product/landing/FeaturesSection";
import { HowItWorks } from "@/components/product/landing/HowItWorks";
import { BenefitsSection } from "@/components/product/landing/BenefitsSection";
import { ProductDemo } from "@/components/product/landing/ProductDemo";
import { PricingCTA } from "@/components/product/landing/PricingCTA";
import { FinalCTA } from "@/components/product/landing/FinalCTA";

export default function SaqrLanding() {
  return (
    <ProductPageLayout>
      <ScrollToHashOnMount />
      <ProductHero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
      <ProductDemo />
      <PricingCTA />
      <FinalCTA />
    </ProductPageLayout>
  );
}
