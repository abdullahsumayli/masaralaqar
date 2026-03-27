"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type MqLogoProps = {
  className?: string;
  /** خلفية بطاقة داكنة (#0F2A2E) */
  variant?: "mark" | "card";
  /** خط أبيض فوق خلفية خضراء/متدرجة */
  onPrimary?: boolean;
};

/**
 * شعار MQ — فقاعة محادثة (Q) + حرف M متصل + ذيل بنقطة نهاية.
 */
export function MqLogo({
  className,
  variant = "mark",
  onPrimary = false,
}: MqLogoProps) {
  const uid = useId().replace(/:/g, "");
  const gid = `mq-logo-grad-${uid}`;
  const fid = `mq-logo-glow-${uid}`;
  const stroke = onPrimary ? "#ffffff" : `url(#${gid})`;
  const dotFill = onPrimary ? "#ffffff" : `url(#${gid})`;
  const blur = onPrimary ? "1.2" : "3.2";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 288"
      fill="none"
      className={cn(className)}
      aria-hidden
    >
      <defs>
        {!onPrimary && (
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25D366" />
            <stop offset="100%" stopColor="#128C7E" />
          </linearGradient>
        )}
        <filter
          id={fid}
          x="-45%"
          y="-45%"
          width="190%"
          height="190%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={blur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {variant === "card" && (
        <rect width="256" height="288" rx="28" fill="#0F2A2E" />
      )}
      <path
        d="M 88 48 H 168 C 192 48 208 64 208 88 V 120 C 208 144 192 160 168 160 H 88 C 64 160 48 144 48 120 V 88 C 48 64 64 48 88 48 Z"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${fid})`}
      />
      <path
        d="M 184 152 L 228 224"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
        filter={`url(#${fid})`}
      />
      <circle cx={234} cy={232} r={8} fill={dotFill} filter={`url(#${fid})`} />
      <path
        d="M 92 138 C 92 138 92 76 92 70 C 92 62 100 58 108 66 C 124 84 124 84 132 94 C 140 84 140 84 156 66 C 164 58 172 62 172 70 C 172 76 172 138 172 138"
        stroke={stroke}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${fid})`}
      />
    </svg>
  );
}
