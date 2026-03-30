/**
 * Health Check Endpoint — system diagnostics
 *
 * Checks connectivity to all critical external services:
 *   - Redis     (BullMQ message queue)
 *   - Supabase  (database + auth)
 *   - OpenAI    (AI engine)
 *   - WAHA (WhatsApp HTTP API)
 *
 * URL: GET /api/system/health
 *
 * Returns:
 *   { status: "ok"|"degraded"|"down", redis, database, openai, whatsapp, uptime }
 */

import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

const MODULE = "HealthCheck";

interface ServiceStatus {
  status: "connected" | "reachable" | "unreachable" | "error";
  latency?: number;
  error?: string;
}

async function checkRedis(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Use dynamic import to avoid loading bullmq at build time
    const { Queue } = await import("bullmq");
    const { getRedisConnectionOptions } = await import("@/lib/redis");
    const testQueue = new Queue("health-check", {
      connection: getRedisConnectionOptions(),
    });
    await testQueue.getJobCounts();
    await testQueue.close();
    return { status: "connected", latency: Date.now() - start };
  } catch (err) {
    return {
      status: "error",
      latency: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    const { data, error } = await supabaseAdmin
      .from("system_metrics")
      .select("id")
      .limit(1);
    if (error && !error.message.includes("does not exist")) {
      // Table not existing is ok (migration pending), other errors are not
      return {
        status: "error",
        latency: Date.now() - start,
        error: error.message,
      };
    }
    return { status: "connected", latency: Date.now() - start };
  } catch (err) {
    return {
      status: "error",
      latency: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function checkOpenAI(): Promise<ServiceStatus> {
  const start = Date.now();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { status: "error", error: "OPENAI_API_KEY not configured" };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    });
    return {
      status: res.ok ? "reachable" : "error",
      latency: Date.now() - start,
      error: res.ok ? undefined : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      status: "unreachable",
      latency: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function checkWhatsApp(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const { wahaPing } = await import("@/lib/waha-client");
    const { ok, status } = await wahaPing();
    return {
      status: ok ? "reachable" : "error",
      latency: Date.now() - start,
      error: ok ? undefined : `HTTP ${status}`,
    };
  } catch (err) {
    return {
      status: "unreachable",
      latency: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function GET() {
  const startTime = Date.now();

  try {
    const [redis, database, openai, whatsapp] = await Promise.all([
      checkRedis(),
      checkDatabase(),
      checkOpenAI(),
      checkWhatsApp(),
    ]);

    const allConnected =
      (redis.status === "connected" || redis.status === "reachable") &&
      (database.status === "connected" || database.status === "reachable") &&
      (openai.status === "connected" || openai.status === "reachable") &&
      (whatsapp.status === "connected" || whatsapp.status === "reachable");

    const anyDown = redis.status === "error" || database.status === "error";

    const overallStatus = allConnected ? "ok" : anyDown ? "down" : "degraded";

    const result = {
      status: overallStatus,
      redis: redis.status,
      database: database.status,
      openai: openai.status,
      whatsapp: whatsapp.status,
      details: { redis, database, openai, whatsapp },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    };

    logger.info(MODULE, "Health check completed", {
      status: overallStatus,
      responseTime: result.responseTime,
    });

    return NextResponse.json(result, {
      status: overallStatus === "down" ? 503 : 200,
    });
  } catch (error) {
    logger.error(MODULE, "Health check failed", error);
    return NextResponse.json(
      {
        status: "down",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
