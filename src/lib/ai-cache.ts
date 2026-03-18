/**
 * AI Response Cache — dual-layer (Redis + in-memory)
 *
 * Caches AI-generated replies keyed by (officeId, normalizedMessage).
 * Stores up to 50 entries per office with a 1-hour TTL.
 *
 * Uses the shared Redis client from redis.ts (Upstash-compatible, TLS-aware).
 * In-memory layer persists across requests within the same serverless container.
 */

import { getRedisClient } from "./redis";

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

// ── Utilities ────────────────────────────────────────────────

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function makeMemKey(officeId: string, norm: string): string {
  return `${officeId}::${norm}`;
}

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
  static async get(
    officeId: string,
    rawMessage: string,
  ): Promise<CachedAIResponse | null> {
    const norm = normalize(rawMessage);
    const mk = makeMemKey(officeId, norm);
    const now = Date.now();

    // L1: in-memory
    const memEntry = mem.get(mk);
    if (memEntry) {
      if (now - memEntry.ts < TTL_MS) {
        console.log(`[AICache] ✓ cache hit (memory) office=${officeId}`);
        return memEntry;
      }
      mem.delete(mk);
      removeFromTracker(officeId, mk);
    }

    // L2: Redis (shared client from redis.ts)
    try {
      const r = await getRedisClient();
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

    writeMemory(officeId, mk, entry);

    try {
      const r = await getRedisClient();
      if (r) {
        r.setex(
          `${REDIS_PREFIX}${officeId}:${fnv1a(norm)}`,
          TTL_SECS,
          JSON.stringify(entry),
        ).catch(() => {});
      }
    } catch {
      // Redis write failure — memory layer still warm
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
