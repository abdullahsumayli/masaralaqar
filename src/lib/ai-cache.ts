/**
 * AI Response Cache — dual-layer (Redis L1 + in-memory L2)
 *
 * Caches AI-generated replies keyed by (officeId, normalizedMessage).
 * Stores up to 50 entries per office with a 1-hour TTL.
 *
 * Redis is attempted lazily on first access. If unreachable
 * (e.g. Vercel → Docker-internal hostname), falls back to
 * in-memory cache which persists across requests within the
 * same serverless container.
 */

import IORedis from "ioredis";

// ── Types ────────────────────────────────────────────────────

export interface CachedAIResponse {
  reply: string;
  properties: Array<Record<string, unknown>>;
  suggestions: string[];
  officeId: string;
  ts: number;
}

// ── Config ───────────────────────────────────────────────────

const TTL_MS = 3_600_000; // 1 hour
const TTL_SECS = 3600;
const MAX_PER_OFFICE = 50;
const REDIS_PREFIX = "ai_reply:";

// ── In-memory store (module-level singleton) ─────────────────

const mem = new Map<string, CachedAIResponse>();
const officeKeyList = new Map<string, string[]>();

// ── Redis client (lazy, connects once) ───────────────────────

let _redis: IORedis | null = null;
let _redisResolved = false;

async function getRedis(): Promise<IORedis | null> {
  if (_redisResolved) return _redis;
  _redisResolved = true;

  const url = process.env.REDIS_URL || process.env.REDIS_URI;
  if (!url) {
    console.log("[AICache] No REDIS_URL — memory-only mode");
    return null;
  }

  try {
    const client = new IORedis(url, {
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableReadyCheck: false,
    });

    await Promise.race([
      client.connect(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 2000),
      ),
    ]);

    _redis = client;
    console.log("[AICache] Redis connected for caching");
    return client;
  } catch {
    console.log("[AICache] Redis unreachable — memory-only mode");
    return null;
  }
}

// ── Utilities ────────────────────────────────────────────────

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function makeMemKey(officeId: string, norm: string): string {
  return `${officeId}::${norm}`;
}

/** FNV-1a hash for compact Redis keys (avoids storing full Arabic text) */
function fnv1a(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

// ── Cache API ────────────────────────────────────────────────

export class AIResponseCache {
  /**
   * Look up a cached AI response for the given office + message.
   * Checks in-memory first (L1), then Redis (L2).
   */
  static async get(
    officeId: string,
    rawMessage: string,
  ): Promise<CachedAIResponse | null> {
    const norm = normalize(rawMessage);
    const mk = makeMemKey(officeId, norm);
    const now = Date.now();

    // ── L1: in-memory ──
    const memEntry = mem.get(mk);
    if (memEntry) {
      if (now - memEntry.ts < TTL_MS) {
        console.log(`[AICache] ✓ cache hit (memory) office=${officeId}`);
        return memEntry;
      }
      mem.delete(mk);
      removeFromTracker(officeId, mk);
    }

    // ── L2: Redis ──
    try {
      const r = await getRedis();
      if (r) {
        const raw = await r.get(
          `${REDIS_PREFIX}${officeId}:${fnv1a(norm)}`,
        );
        if (raw) {
          const entry = JSON.parse(raw) as CachedAIResponse;
          if (now - entry.ts < TTL_MS) {
            writeMemory(officeId, mk, entry);
            console.log(`[AICache] ✓ cache hit (Redis) office=${officeId}`);
            return entry;
          }
        }
      }
    } catch {
      // Redis read failure — proceed as miss
    }

    console.log(`[AICache] ✗ cache miss office=${officeId}`);
    return null;
  }

  /**
   * Store an AI response in both cache layers.
   * In-memory write is synchronous; Redis is fire-and-forget.
   */
  static async set(
    officeId: string,
    rawMessage: string,
    data: {
      reply: string;
      properties: Array<Record<string, unknown>>;
      suggestions: string[];
    },
  ): Promise<void> {
    const norm = normalize(rawMessage);
    const mk = makeMemKey(officeId, norm);

    const entry: CachedAIResponse = {
      ...data,
      officeId,
      ts: Date.now(),
    };

    // L1: memory (always)
    writeMemory(officeId, mk, entry);

    // L2: Redis (fire-and-forget)
    try {
      const r = await getRedis();
      if (r) {
        r.setex(
          `${REDIS_PREFIX}${officeId}:${fnv1a(norm)}`,
          TTL_SECS,
          JSON.stringify(entry),
        ).catch(() => {});
      }
    } catch {
      // Redis write failure — memory cache is still warm
    }
  }
}

// ── Internal helpers ─────────────────────────────────────────

function writeMemory(
  officeId: string,
  key: string,
  entry: CachedAIResponse,
): void {
  mem.set(key, entry);

  const keys = officeKeyList.get(officeId) || [];
  const idx = keys.indexOf(key);
  if (idx !== -1) keys.splice(idx, 1);
  keys.push(key);

  while (keys.length > MAX_PER_OFFICE) {
    const evicted = keys.shift()!;
    mem.delete(evicted);
  }
  officeKeyList.set(officeId, keys);
}

function removeFromTracker(officeId: string, key: string): void {
  const keys = officeKeyList.get(officeId);
  if (!keys) return;
  const idx = keys.indexOf(key);
  if (idx !== -1) keys.splice(idx, 1);
}
