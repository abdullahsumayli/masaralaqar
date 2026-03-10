// Cache بسيط في ذاكرة Node.js
// TTL: 10 دقائق لكل مكتب
// TODO: استبدل بـ Redis عند التوسع

interface CacheEntry {
  data: any[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL_MS = 10 * 60 * 1000; // 10 دقائق

export function getCachedProperties(officeId: string): any[] | null {
  const entry = cache.get(officeId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(officeId);
    return null;
  }
  return entry.data;
}

export function setCachedProperties(officeId: string, data: any[]): void {
  cache.set(officeId, {
    data,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function invalidatePropertiesCache(officeId: string): void {
  cache.delete(officeId);
}

