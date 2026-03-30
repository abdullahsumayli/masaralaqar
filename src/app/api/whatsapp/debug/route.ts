/**
 * WhatsApp Debug Endpoint — Diagnose message pipeline issues (multi-tenant)
 * GET /api/whatsapp/debug
 *
 * Checks: WAHA status, webhook config, Redis connectivity,
 *         WhatsApp sessions, and provides actionable recommendations.
 */

import {
  getLiveConnectionPayload,
  getSessionWebhookDebug,
  syncSessionWebhook,
} from "@/integrations/whatsapp";
import { getRedisConnectionOptions } from "@/lib/redis";
import { supabaseAdmin } from "@/lib/supabase";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { instanceNameForOffice } from "@/lib/whatsapp-session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fixSession() {
  try {
    const { data: recentUser } = await supabaseAdmin
      .from("users")
      .select("office_id, email, name")
      .not("office_id", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (!recentUser?.office_id) {
      return NextResponse.json(
        { success: false, error: "No office found" },
        { status: 404 },
      );
    }

    const officeId = recentUser.office_id;
    const instanceName = instanceNameForOffice(officeId);

    const existing = await WhatsAppSessionRepository.getByOfficeId(officeId);

    if (existing) {
      const updated = await WhatsAppSessionRepository.updateStatus(
        existing.id,
        "connected",
      );
      return NextResponse.json({
        success: true,
        action: "updated",
        session: updated,
        instanceName,
      });
    }

    const newSession = await WhatsAppSessionRepository.create({
      officeId,
      phoneNumber: "auto-created",
      instanceId: instanceName,
    });

    return NextResponse.json({
      success: true,
      action: "created",
      session: newSession,
      instanceName,
      office: officeId,
      user: recentUser.email,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const fix = request.nextUrl.searchParams.get("fix");
  const targetOfficeId = request.nextUrl.searchParams.get("officeId");

  if (fix === "session") {
    return fixSession();
  }

  if (fix === "webhook" && targetOfficeId) {
    try {
      const session =
        await WhatsAppSessionRepository.getByOfficeId(targetOfficeId);
      const instanceName =
        session?.instanceId || instanceNameForOffice(targetOfficeId);
      const result = await syncSessionWebhook(instanceName);
      return NextResponse.json({
        success: true,
        message: "Webhook set",
        instanceName,
        result,
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, error: String(err) },
        { status: 500 },
      );
    }
  }

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checks: {} as Record<string, unknown>,
    issues: [] as string[],
    recommendations: [] as string[],
  };

  const checks = results.checks as Record<string, unknown>;
  const issues = results.issues as string[];
  const recommendations = results.recommendations as string[];

  // 1. Check env variables
  checks.env = {
    WAHA_API_URL: process.env.WAHA_API_URL ? "✅ set" : "❌ missing",
    WAHA_API_KEY: process.env.WAHA_API_KEY ? "✅ set" : "❌ missing",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "✅ set" : "❌ missing",
    REDIS_URL: process.env.REDIS_URL ? "✅ set" : "—",
    REDIS_URI: process.env.REDIS_URI ? "✅ set" : "—",
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "❌ missing",
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET ? "✅ set" : "⚠️ missing",
  };

  if (!process.env.WAHA_API_KEY)
    issues.push("WAHA_API_KEY not set");
  if (!process.env.WAHA_API_URL)
    issues.push("WAHA_API_URL not set");
  if (!process.env.OPENAI_API_KEY)
    issues.push("OPENAI_API_KEY not set — AI replies won't work");
  if (!process.env.REDIS_URL && !process.env.REDIS_URI)
    issues.push(
      "No Redis URL — queue will fail, inline fallback will be used",
    );

  // 2. Check WhatsApp sessions in DB + per-session WAHA status
  try {
    const sessions = await WhatsAppSessionRepository.getAll();
    checks.sessions = sessions.map((s) => ({
      officeId: s.officeId,
      instanceId: s.instanceId,
      status: s.sessionStatus,
      phone: s.phoneNumber,
      lastConnected: s.lastConnectedAt,
    }));

    if (!sessions.length) {
      issues.push("No WhatsApp sessions found in database");
      recommendations.push(
        "Connect WhatsApp from /dashboard/whatsapp",
      );
    } else {
      const connected = sessions.filter(
        (s) => s.sessionStatus === "connected",
      );
      if (!connected.length) {
        issues.push(
          "No connected WhatsApp sessions — all are pending/disconnected",
        );
        recommendations.push(
          "Reconnect WhatsApp from /dashboard/whatsapp",
        );
      }

      const instanceChecks: Record<string, unknown>[] = [];
      for (const s of sessions.slice(0, 5)) {
        const instName = s.instanceId || instanceNameForOffice(s.officeId);
        try {
          const live = await getLiveConnectionPayload(instName);
          instanceChecks.push({
            instanceName: instName,
            officeId: s.officeId,
            wahaState: live?.instance?.state || "unknown",
            dbStatus: s.sessionStatus,
          });
        } catch {
          instanceChecks.push({
            instanceName: instName,
            officeId: s.officeId,
            wahaState: "unreachable",
            dbStatus: s.sessionStatus,
          });
        }
      }
      checks.instanceStatus = instanceChecks;
    }
  } catch (err) {
    checks.sessions = { error: String(err) };
  }

  // 3. Check webhook config for a specific office or first available
  if (targetOfficeId) {
    try {
      const session =
        await WhatsAppSessionRepository.getByOfficeId(targetOfficeId);
      const instName =
        session?.instanceId || instanceNameForOffice(targetOfficeId);
      const webhook = await getSessionWebhookDebug(instName);
      checks.webhook = { instanceName: instName, config: webhook };
    } catch (err) {
      checks.webhook = { error: String(err) };
    }
  }

  // 4. Check Redis connectivity
  try {
    const redisOpts = getRedisConnectionOptions();
    checks.redis = {
      host: redisOpts.host,
      port: redisOpts.port,
      hasPassword: !!redisOpts.password,
      hasTLS: !!(redisOpts as Record<string, unknown>).tls,
    };
  } catch (err) {
    checks.redis = { status: "error", error: String(err) };
    issues.push("Redis configuration error");
  }

  // 5. Check recent failed messages
  try {
    const { data: failed } = await supabaseAdmin
      .from("failed_messages")
      .select("id, phone, error_message, route, created_at, office_id")
      .order("created_at", { ascending: false })
      .limit(5);
    checks.recentFailedMessages = failed || [];
  } catch {
    checks.recentFailedMessages = "table may not exist";
  }

  results.summary =
    issues.length === 0
      ? "✅ All checks passed — pipeline should be working"
      : `⚠️ ${issues.length} issue(s) found`;

  return NextResponse.json(results, { status: 200 });
}

/**
 * POST /api/whatsapp/debug?fix=webhook&officeId=xxx or ?fix=session
 */
export async function POST(request: NextRequest) {
  const fix = request.nextUrl.searchParams.get("fix");
  const targetOfficeId = request.nextUrl.searchParams.get("officeId");

  if (fix === "webhook" && targetOfficeId) {
    try {
      const session =
        await WhatsAppSessionRepository.getByOfficeId(targetOfficeId);
      const instanceName =
        session?.instanceId || instanceNameForOffice(targetOfficeId);
      const result = await syncSessionWebhook(instanceName);
      return NextResponse.json({
        success: true,
        message: "Webhook configured successfully",
        instanceName,
        result,
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, error: String(err) },
        { status: 500 },
      );
    }
  }

  if (fix === "session") {
    return fixSession();
  }

  return NextResponse.json(
    {
      error:
        "Use ?fix=webhook&officeId=xxx or ?fix=session",
    },
    { status: 400 },
  );
}
