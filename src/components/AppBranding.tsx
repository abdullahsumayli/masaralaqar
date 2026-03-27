"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";

function skipSplashForPath(pathname: string | null) {
  if (!pathname) return true;
  const prefixes = ["/dashboard", "/admin", "/login", "/auth", "/partner", "/onboarding"];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * شاشة ترحيب MQ مرة واحدة لكل جلسة (تبويب) — للصفحات العامة فقط.
 */
export function AppBranding() {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (skipSplashForPath(pathname)) return;
    if (sessionStorage.getItem("mq-splash-seen") === "1") return;
    setShowSplash(true);
  }, [pathname]);

  if (!showSplash) return null;

  return (
    <SplashScreen
      onFadeComplete={() => {
        sessionStorage.setItem("mq-splash-seen", "1");
        setShowSplash(false);
      }}
    />
  );
}
