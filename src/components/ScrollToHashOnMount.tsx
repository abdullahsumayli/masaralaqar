"use client";

import { useEffect } from "react";

/**
 * يمرّر إلى العنصر المطابق لـ location.hash بعد الرسم (مفيد مع App Router + محتوى يظهر بعد hydration).
 */
export function ScrollToHashOnMount() {
  useEffect(() => {
    const raw = window.location.hash;
    if (!raw || raw.length <= 1) return;
    const id = raw.slice(1);
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
