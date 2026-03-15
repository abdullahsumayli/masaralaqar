"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "masaralaqar_announcement_closed";

export function AnnouncementBar() {
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setClosed(saved === "1");
    } catch {
      setClosed(false);
    }
  }, []);

  const handleClose = () => {
    setClosed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  if (closed) return null;

  return (
    <div className="relative bg-primary text-white text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-3 min-h-[44px]">
      <span>
        🎉 جرب صقر مجاناً 14 يوماً — بدون بطاقة ائتمان
      </span>
      <Link
        href="/auth/signup"
        className="inline-flex items-center rounded-lg bg-white text-primary font-bold px-3 py-1.5 text-xs hover:bg-white/90 transition-colors"
      >
        ابدأ الآن
      </Link>
      <button
        type="button"
        onClick={handleClose}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/20 transition-colors"
        aria-label="إغلاق"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
