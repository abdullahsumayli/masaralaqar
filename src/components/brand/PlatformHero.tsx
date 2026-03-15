"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface PlatformHeroProps {
  /** Badge text above headline */
  badge?: string;
  /** Main headline */
  headline: ReactNode;
  /** Subheadline / description */
  subline?: string;
  /** CTA buttons or links */
  actions?: ReactNode;
  /** Optional trust line or badges below CTAs */
  trust?: ReactNode;
  className?: string;
}

/**
 * Platform-level hero for homepage and key landing pages.
 * Emphasizes Masar AlAqar as the platform brand.
 */
export function PlatformHero({
  badge,
  headline,
  subline,
  actions,
  trust,
  className,
}: PlatformHeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-[85vh] flex items-center pt-24 md:pt-28 pb-16 md:pb-24 px-4 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-dot-pattern opacity-100" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/[0.07] via-transparent to-transparent" />

      <div className="relative max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col items-center"
        >
          {badge && (
            <motion.div variants={fadeUp} className="mb-6">
              <span className="badge-blue text-xs md:text-sm">{badge}</span>
            </motion.div>
          )}
          <motion.div variants={fadeUp} className="mb-6">
            {headline}
          </motion.div>
          {subline && (
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-[#94A3B8] max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              {subline}
            </motion.p>
          )}
          {actions && (
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              {actions}
            </motion.div>
          )}
          {trust && <motion.div variants={fadeUp}>{trust}</motion.div>}
        </motion.div>
      </div>
    </section>
  );
}
