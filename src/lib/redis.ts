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
  const redisUrl = process.env.REDIS_URL || "";

  if (redisUrl) {
    try {
      const url = new URL(redisUrl);
      return {
        host: url.hostname,
        port: parseInt(url.port || "6379", 10),
        password: url.password || undefined,
        username: url.username || undefined,
        maxRetriesPerRequest: null, // Required by BullMQ
        enableReadyCheck: false,
      };
    } catch {
      // If URL parsing fails, try passing as-is via host
      return {
        host: redisUrl,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      };
    }
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}
