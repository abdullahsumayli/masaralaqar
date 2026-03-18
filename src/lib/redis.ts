/**
 * Redis Connection Layer
 *
 * Supports standard Redis (redis://) and Upstash/TLS (rediss://).
 * Exports:
 *   getRedisConnectionOptions() — plain object for BullMQ Queue/Worker
 *   getRedisClient()            — lazy ioredis singleton for direct use (cache, etc.)
 *
 * Priority: REDIS_URL > REDIS_URI > UPSTASH_REDIS_URL > REDIS_HOST+PORT
 */

import IORedis from "ioredis";
import type { ConnectionOptions } from "bullmq";

// ── URL Resolution ───────────────────────────────────────────

function resolveRedisUrl(): string {
  return (
    process.env.REDIS_URL ||
    process.env.REDIS_URI ||
    process.env.UPSTASH_REDIS_URL ||
    ""
  );
}

interface ParsedRedis {
  host: string;
  port: number;
  password: string | undefined;
  username: string | undefined;
  db: number | undefined;
  tls: Record<string, never> | undefined;
}

function parseRedisUrl(raw: string): ParsedRedis | null {
  try {
    const url = new URL(raw);
    const isTLS = url.protocol === "rediss:";
    const dbMatch = url.pathname.match(/^\/(\d+)$/);

    return {
      host: url.hostname,
      port: parseInt(url.port || "6379", 10),
      password: url.password || undefined,
      username: url.username || undefined,
      db: dbMatch ? parseInt(dbMatch[1], 10) : undefined,
      tls: isTLS ? {} : undefined,
    };
  } catch {
    return null;
  }
}

// ── BullMQ Connection Options ────────────────────────────────

export function getRedisConnectionOptions(): ConnectionOptions {
  const raw = resolveRedisUrl();

  if (raw) {
    const parsed = parseRedisUrl(raw);
    if (parsed) {
      return {
        ...parsed,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        connectTimeout: 5000,
      };
    }
    console.error("[Redis] Failed to parse URL:", raw);
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 5000,
  };
}

// ── Shared Redis Client (singleton) ──────────────────────────

let _client: IORedis | null = null;
let _clientChecked = false;

/**
 * Lazy singleton ioredis client for direct Redis operations (cache, etc.).
 * Connects once on first call; returns null if unreachable.
 * Safe to call from serverless — does not block if Redis is down.
 */
export async function getRedisClient(): Promise<IORedis | null> {
  if (_clientChecked) return _client;
  _clientChecked = true;

  const raw = resolveRedisUrl();
  if (!raw) {
    console.log("[Redis] No URL configured — client unavailable");
    return null;
  }

  const parsed = parseRedisUrl(raw);
  if (!parsed) {
    console.log("[Redis] URL parse failed — client unavailable");
    return null;
  }

  try {
    const client = new IORedis({
      ...parsed,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
      enableReadyCheck: false,
    });

    await Promise.race([
      client.connect(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("connect timeout")), 3000),
      ),
    ]);

    _client = client;
    const label = parsed.tls ? `${parsed.host} (TLS)` : parsed.host;
    console.log(`[Redis] Client connected → ${label}`);
    return client;
  } catch (err) {
    console.log(
      "[Redis] Client connect failed:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}
