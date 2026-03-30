/**
 * GET /api/whatsapp/status — WhatsApp connection status (multi-tenant)
 *
 * Returns:
 *   { status: "connecting" | "connected" | "disconnected", phoneNumber?: string }
 */

import { getLiveConnectionPayload } from "@/integrations/whatsapp";
import { instanceNameForOffice } from "@/lib/whatsapp-session";
import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    const userId = user?.id || request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Resolve the user's office
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("office_id")
      .eq("id", userId)
      .single();

    if (!profile?.office_id) {
      return NextResponse.json({
        status: "disconnected" as const,
        phoneNumber: null,
      });
    }

    // Check DB session
    const session = await WhatsAppSessionRepository.getByOfficeId(
      profile.office_id,
    );

    if (!session) {
      return NextResponse.json({
        status: "disconnected" as const,
        phoneNumber: null,
      });
    }

    // Resolve instance name from session or derive it
    const instanceName =
      session.instanceId || instanceNameForOffice(profile.office_id);

    let liveState: string = "unknown";
    try {
      const result = await getLiveConnectionPayload(instanceName);
      liveState = result?.instance?.state || "unknown";
    } catch {
      // WAHA unreachable — rely on DB status
    }

    const phone =
      session.phoneNumber !== "pending" &&
      session.phoneNumber !== "auto-detected"
        ? session.phoneNumber
        : null;

    if (liveState === "open" || session.sessionStatus === "connected") {
      return NextResponse.json({
        status: "connected" as const,
        phoneNumber: phone,
        instanceName,
      });
    }

    if (session.sessionStatus === "pending") {
      return NextResponse.json({
        status: "connecting" as const,
        phoneNumber: phone,
        instanceName,
      });
    }

    return NextResponse.json({
      status: "disconnected" as const,
      phoneNumber: phone,
      instanceName,
    });
  } catch (err: unknown) {
    console.error("[whatsapp/status] error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "خطأ في جلب الحالة",
      },
      { status: 500 },
    );
  }
}
