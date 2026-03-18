/**
 * Redis Connection Config for BullMQ
 *
 * BullMQ accepts plain connection options (no need to instantiate IORedis).
 * This avoids version conflicts between standalone ioredis and BullMQ's bundled copy.
 *
 * Configuration:
 *   REDIS_URL — full Redis connection string (redis://...)
 *   Falls back to REDIS_HOST + REDIS_PORT for split config.
 *
 * BullMQ needs a standard Redis instance (not Upstash REST API).
 * Use Redis 7+ or any managed Redis (Railway, Render, Aiven, etc.)
 */

import type { ConnectionOptions } from "bullmq";

/**
 * Parse REDIS_URL into host/port/password components for BullMQ.
 * BullMQ's ConnectionOptions accepts either an IORedis instance
 * or a plain { host, port, password, ... } object.
 */
export function getRedisConnectionOptions(): ConnectionOptions {
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_URI || "";

  if (redisUrl) {
    try {
      const url = new URL(redisUrl);
      // Extract DB number from pathname (e.g. redis://host:6379/6 → db=6)
      const dbMatch = url.pathname.match(/^\/(\d+)$/);
      const db = dbMatch ? parseInt(dbMatch[1], 10) : undefined;

      return {
        host: url.hostname,
        port: parseInt(url.port || "6379", 10),
        password: url.password || undefined,
        username: url.username || undefined,
        db,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        connectTimeout: 5000,
        retryStrategy: (times: number) => (times > 2 ? null : Math.min(times * 500, 2000)),
      };
    } catch {
      console.error("[Redis] Failed to parse URL, using as host:", redisUrl);
      return {
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        connectTimeout: 5000,
        retryStrategy: (times: number) => (times > 2 ? null : Math.min(times * 500, 2000)),
      };
    }
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 5000,
    retryStrategy: (times: number) => (times > 2 ? null : Math.min(times * 500, 2000)),
  };
}
