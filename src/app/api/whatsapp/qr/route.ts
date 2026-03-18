/**
 * GET /api/whatsapp/qr — Get QR code for user's office instance (multi-tenant)
 */

import { getQRCode } from "@/lib/getQR";
import { instanceNameForOffice } from "@/lib/evolution";
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
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );
    }

    // Resolve instance name from session or derive it
    const session = await WhatsAppSessionRepository.getByOfficeId(
      profile.office_id,
    );
    const instanceName =
      session?.instanceId || instanceNameForOffice(profile.office_id);

    const result = await getQRCode(instanceName);
    console.log("[whatsapp/qr] QR fetched for instance:", instanceName);

    return NextResponse.json({ success: true, data: result, instanceName });
  } catch (err: unknown) {
    console.error("[whatsapp/qr] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطأ في جلب QR" },
      { status: 500 },
    );
  }
}
