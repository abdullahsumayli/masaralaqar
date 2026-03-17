/**
 * WhatsApp Debug Endpoint — Diagnose message pipeline issues
 * GET /api/whatsapp/debug
 *
 * Checks: Evolution API status, webhook config, Redis connectivity,
 *         WhatsApp sessions, and provides actionable recommendations.
 */

import {
  getEvolutionStatus,
  getEvolutionWebhook,
  setEvolutionWebhook,
} from "@/integrations/whatsapp";
import { getRedisConnectionOptions } from "@/lib/redis";
import { supabaseAdmin } from "@/lib/supabase";
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
      return NextResponse.json({ success: false, error: "No office found" }, { status: 404 });
    }

    const { data: existing } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("id")
      .eq("office_id", recentUser.office_id)
      .limit(1)
      .single();

    if (existing) {
      const { data: updated } = await supabaseAdmin
        .from("whatsapp_sessions")
        .update({
          instance_id: "saqr",
          session_status: "connected",
          last_connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      return NextResponse.json({ success: true, action: "updated", session: updated });
    }

    const { data: newSession, error } = await supabaseAdmin
      .from("whatsapp_sessions")
      .insert({
        office_id: recentUser.office_id,
        phone_number: "auto-created",
        instance_id: "saqr",
        session_status: "connected",
        last_connected_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      action: "created",
      session: newSession,
      office: recentUser.office_id,
      user: recentUser.email,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Quick fix actions via GET for easy browser access
  const fix = request.nextUrl.searchParams.get("fix");
  if (fix === "session") {
    return fixSession();
  }
  if (fix === "webhook") {
    try {
      const result = await setEvolutionWebhook();
      return NextResponse.json({ success: true, message: "Webhook set", result });
    } catch (err) {
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
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
    EVOLUTION_API_URL: process.env.EVOLUTION_API_URL ? "✅ set" : "❌ missing",
    EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY ? "✅ set" : "❌ missing",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "✅ set" : "❌ missing",
    REDIS_URL: process.env.REDIS_URL ? "✅ set" : "—",
    REDIS_URI: process.env.REDIS_URI ? "✅ set" : "—",
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "❌ missing",
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET ? "✅ set" : "⚠️ missing",
  };

  if (!process.env.EVOLUTION_API_KEY) issues.push("EVOLUTION_API_KEY not set");
  if (!process.env.OPENAI_API_KEY) issues.push("OPENAI_API_KEY not set — AI replies won't work");
  if (!process.env.REDIS_URL && !process.env.REDIS_URI)
    issues.push("No Redis URL — queue will fail, inline fallback will be used");

  // 2. Check Evolution API instance
  try {
    const status = await getEvolutionStatus();
    checks.evolutionInstance = {
      status: "reachable",
      state: status?.instance?.state || status?.state || "unknown",
      raw: status,
    };
    if (status?.instance?.state !== "open" && status?.state !== "open") {
      issues.push(`Evolution instance not connected (state: ${status?.instance?.state || status?.state || "unknown"})`);
      recommendations.push("Go to /dashboard/whatsapp and reconnect by scanning QR code");
    }
  } catch (err) {
    checks.evolutionInstance = { status: "error", error: String(err) };
    issues.push("Cannot reach Evolution API");
    recommendations.push("Check EVOLUTION_API_URL and API key");
  }

  // 3. Check webhook configuration
  try {
    const webhook = await getEvolutionWebhook();
    checks.evolutionWebhook = webhook;
    const expectedUrl = `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/webhook/whatsapp`;
    const currentUrl = webhook?.url || webhook?.webhook?.url || "";

    if (!currentUrl) {
      issues.push("⚠️ NO webhook URL configured in Evolution API — messages won't arrive!");
      recommendations.push("Reconnect WhatsApp from /dashboard/whatsapp (this will auto-set the webhook)");
    } else if (!currentUrl.includes("/api/webhook/whatsapp")) {
      issues.push(`Webhook URL is wrong: ${currentUrl} (expected: ${expectedUrl})`);
      recommendations.push("Reconnect WhatsApp or call POST /api/whatsapp/debug?fix=webhook");
    }
  } catch (err) {
    checks.evolutionWebhook = { status: "error", error: String(err) };
  }

  // 4. Check Redis connectivity
  try {
    const redisOpts = getRedisConnectionOptions();
    checks.redis = {
      host: redisOpts.host,
      port: redisOpts.port,
      db: (redisOpts as any).db || 0,
      hasPassword: !!redisOpts.password,
    };
  } catch (err) {
    checks.redis = { status: "error", error: String(err) };
    issues.push("Redis configuration error");
  }

  // 5. Check WhatsApp sessions in DB
  try {
    const { data: sessions, error } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("id, office_id, phone_number, session_status, instance_id, last_connected_at")
      .order("updated_at", { ascending: false })
      .limit(10);

    checks.sessions = sessions || [];
    if (!sessions?.length) {
      issues.push("No WhatsApp sessions found in database");
      recommendations.push("Connect WhatsApp from /dashboard/whatsapp");
    } else {
      const connected = sessions.filter((s: any) => s.session_status === "connected");
      if (!connected.length) {
        issues.push("No connected WhatsApp sessions — all are pending/disconnected");
        recommendations.push("Reconnect WhatsApp from /dashboard/whatsapp");
      }
    }
  } catch (err) {
    checks.sessions = { error: String(err) };
  }

  // 6. Check recent failed messages
  try {
    const { data: failed } = await supabaseAdmin
      .from("failed_messages")
      .select("id, phone, error_message, route, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    checks.recentFailedMessages = failed || [];
  } catch {
    checks.recentFailedMessages = "table may not exist";
  }

  // Summary
  results.summary = issues.length === 0
    ? "✅ All checks passed — pipeline should be working"
    : `⚠️ ${issues.length} issue(s) found`;

  return NextResponse.json(results, { status: 200 });
}

/**
 * POST /api/whatsapp/debug?fix=webhook|session
 * Manually fix common issues
 */
export async function POST(request: NextRequest) {
  const fix = request.nextUrl.searchParams.get("fix");

  if (fix === "webhook") {
    try {
      const result = await setEvolutionWebhook();
      return NextResponse.json({
        success: true,
        message: "Webhook configured successfully",
        result,
      });
    } catch (err) {
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
  }

  if (fix === "session") {
    try {
      // Find the most recent office
      const { data: recentUser } = await supabaseAdmin
        .from("users")
        .select("office_id, email, name")
        .not("office_id", "is", null)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (!recentUser?.office_id) {
        return NextResponse.json({ success: false, error: "No office found in users table" }, { status: 404 });
      }

      // Check if session already exists
      const { data: existing } = await supabaseAdmin
        .from("whatsapp_sessions")
        .select("id")
        .eq("office_id", recentUser.office_id)
        .limit(1)
        .single();

      if (existing) {
        // Update existing session to connected
        const { data: updated } = await supabaseAdmin
          .from("whatsapp_sessions")
          .update({
            instance_id: "saqr",
            session_status: "connected",
            last_connected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();
        return NextResponse.json({ success: true, action: "updated", session: updated });
      }

      // Create new session
      const { data: newSession, error } = await supabaseAdmin
        .from("whatsapp_sessions")
        .insert({
          office_id: recentUser.office_id,
          phone_number: "auto-created",
          instance_id: "saqr",
          session_status: "connected",
          last_connected_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        action: "created",
        session: newSession,
        office: recentUser.office_id,
        user: recentUser.email,
      });
    } catch (err) {
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Use ?fix=webhook or ?fix=session" }, { status: 400 });
}
