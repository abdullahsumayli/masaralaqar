"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const SHOW_AFTER_PX = 400;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
      className={`fixed bottom-6 left-6 z-40 w-11 h-11 rounded-xl border border-white/10 bg-card shadow-card flex items-center justify-center text-[#94A3B8] hover:text-[#F0F4FF] hover:border-primary/30 hover:bg-card-hover transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
