"use client";

import { useEffect, useId, useState } from "react";

export function SplashScreen({ onFadeComplete }: { onFadeComplete?: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const fade = window.setTimeout(() => setFadeOut(true), 2000);
    const done = window.setTimeout(() => onFadeComplete?.(), 2900);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [onFadeComplete]);

  const gid = `mq-splash-grad-${uid}`;
  const fid = `mq-splash-glow-${uid}`;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0F2A2E] transition-opacity duration-700 ease-out ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-busy={!fadeOut}
      aria-hidden={fadeOut}
    >
      <div className="animate-mq-logo-pulse w-[min(42vw,200px)] max-w-[200px] drop-shadow-[0_0_28px_rgba(37,211,102,0.4)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 288"
          fill="none"
          className="h-auto w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25D366" />
              <stop offset="100%" stopColor="#128C7E" />
            </linearGradient>
            <filter
              id={fid}
              x="-45%"
              y="-45%"
              width="190%"
              height="190%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M 88 48 H 168 C 192 48 208 64 208 88 V 120 C 208 144 192 160 168 160 H 88 C 64 160 48 144 48 120 V 88 C 48 64 64 48 88 48 Z"
            stroke={`url(#${gid})`}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${fid})`}
          />
          <path
            d="M 184 152 L 228 224"
            stroke={`url(#${gid})`}
            strokeWidth={6}
            strokeLinecap="round"
            filter={`url(#${fid})`}
          />
          <circle
            cx={234}
            cy={232}
            r={8}
            fill={`url(#${gid})`}
            filter={`url(#${fid})`}
          />
          <path
            d="M 92 138 C 92 138 92 76 92 70 C 92 62 100 58 108 66 C 124 84 124 84 132 94 C 140 84 140 84 156 66 C 164 58 172 62 172 70 C 172 76 172 138 172 138"
            stroke={`url(#${gid})`}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${fid})`}
          />
        </svg>
      </div>
      <p className="mt-10 text-center text-sm font-medium tracking-wide text-[#DCF8C6]">
        Connecting conversations...
      </p>
    </div>
  );
}
