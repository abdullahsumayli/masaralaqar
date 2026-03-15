/**
 * Referral cookie helpers — store ref code from ?ref=CODE for 30 days
 */

import { REFERRAL_COOKIE_NAME, REFERRAL_COOKIE_MAX_AGE_DAYS } from "@/types/affiliate";

export function setReferralCookie(code: string): void {
  if (typeof document === "undefined") return;
  const value = code.trim().toUpperCase();
  if (!value) return;
  const expires = new Date();
  expires.setDate(expires.getDate() + REFERRAL_COOKIE_MAX_AGE_DAYS);
  document.cookie = `${REFERRAL_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${REFERRAL_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
}

export function getReferralCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${REFERRAL_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearReferralCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${REFERRAL_COOKIE_NAME}=; path=/; max-age=0`;
}
