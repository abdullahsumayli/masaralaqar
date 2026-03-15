"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { setReferralCookie } from "@/lib/referral";

/**
 * Renders nothing. When URL has ?ref=CODE, stores code in cookie (30 days).
 * Place once in a layout (e.g. root or marketing layout).
 */
export function ReferralCookieHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCookie(ref);
  }, [searchParams]);

  return null;
}
