/**
 * كاش قائمة العقارات لكل مكتب (تقليل ضغط Supabase على محرك التوصيات).
 * - الطبقة 1: ذاكرة العملية (Node)
 * - الطبقة 2: Redis عند توفر REDIS_URL (مشاركة بين عُقد Vercel/worker)
 */

import { getRedisClient } from "@/lib/redis";

const REDIS_KEY_PREFIX = "mq:props:";
const TTL_MS = 10 * 60 * 1000;
const TTL_SEC = Math.floor(TTL_MS / 1000);

interface CacheEntry {
  data: unknown[];
  expiresAt: number;
}

const memory = new Map<string, CacheEntry>();

async function redisGet(
  officeId: string,
): Promise<{ data: unknown[]; expiresAt: number } | null> {
  const redis = await getRedisClient();
  if (!redis) return null;
  try {
    const raw = await redis.get(`${REDIS_KEY_PREFIX}${officeId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: unknown[]; expiresAt: number };
    if (parsed.expiresAt <= Date.now()) {
      await redis.del(`${REDIS_KEY_PREFIX}${officeId}`).catch(() => {});
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function redisSet(officeId: string, data: unknown[], expiresAt: number): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;
  try {
    await redis.setex(
      `${REDIS_KEY_PREFIX}${officeId}`,
      TTL_SEC,
      JSON.stringify({ data, expiresAt }),
    );
  } catch {
    /* غير حرج */
  }
}

async function redisDel(officeId: string): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;
  try {
    await redis.del(`${REDIS_KEY_PREFIX}${officeId}`);
  } catch {
    /* غير حرج */
  }
}

export async function getCachedProperties(
  officeId: string,
): Promise<unknown[] | null> {
  const mem = memory.get(officeId);
  if (mem) {
    if (Date.now() <= mem.expiresAt) return mem.data;
    memory.delete(officeId);
  }

  const fromRedis = await redisGet(officeId);
  if (fromRedis) {
    memory.set(officeId, {
      data: fromRedis.data,
      expiresAt: fromRedis.expiresAt,
    });
    return fromRedis.data;
  }

  return null;
}

export async function setCachedProperties(
  officeId: string,
  data: unknown[],
): Promise<void> {
  const expiresAt = Date.now() + TTL_MS;
  memory.set(officeId, { data, expiresAt });
  await redisSet(officeId, data, expiresAt);
}

export async function invalidatePropertiesCache(officeId: string): Promise<void> {
  memory.delete(officeId);
  await redisDel(officeId);
}
