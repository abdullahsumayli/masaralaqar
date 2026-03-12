/**
 * Rate Limiting — Upstash Redis-backed rate limiter
 * Falls back to in-memory when Upstash is not configured.
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory fallback store (for dev / when Upstash is not configured)
const memoryStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function checkUpstashRateLimit(
  identifier: string,
): Promise<{ success: boolean; remaining: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { success: true, remaining: MAX_REQUESTS };

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url, token });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1 m"),
      analytics: true,
    });

    const result = await ratelimit.limit(identifier);
    return { success: result.success, remaining: result.remaining };
  } catch {
    // If Upstash fails, allow the request
    return { success: true, remaining: MAX_REQUESTS };
  }
}

function checkMemoryRateLimit(identifier: string): {
  success: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, MAX_REQUESTS - entry.count);
  return { success: entry.count <= MAX_REQUESTS, remaining };
}

/**
 * Rate limit middleware for API routes.
 * Returns null if allowed, or a 429 response if rate-limited.
 */
export async function rateLimit(
  request: NextRequest,
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const identifier = `api:${ip}`;

  const hasUpstash =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  const result = hasUpstash
    ? await checkUpstashRateLimit(identifier)
    : checkMemoryRateLimit(identifier);

  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  return null;
}

// Clean memory store periodically (every 5 minutes)
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore) {
      if (now > entry.resetAt) memoryStore.delete(key);
    }
  }, 300_000);
}
