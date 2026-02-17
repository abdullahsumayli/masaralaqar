'use client'

import { Hero } from '@/components/landing/hero2'
import { FeaturesGrid } from '@/components/landing/features'
import { StatsSection } from '@/components/landing/stats'
import { CTA } from '@/components/landing/cta'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <StatsSection />
      <FeaturesGrid />
      <CTA />
    </main>
  )
}
