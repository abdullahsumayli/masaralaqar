/**
 * POST /api/whatsapp/reconnect — Trigger QR regeneration (admin only)
 * Logs: manual_reconnect_triggered
 */

import { getSessionQR } from "@/integrations/whatsapp";
import { resetCircuit } from "@/lib/circuit-breaker";
import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { trackWhatsAppIncident } from "@/services/whatsapp-incident.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const instanceName = (body?.instance_name ?? body?.instanceName) as string | undefined;
    if (!instanceName?.trim()) {
      return NextResponse.json(
        { error: "instance_name مطلوب" },
        { status: 400 },
      );
    }

    const session = await WhatsAppSessionRepository.getByInstanceId(instanceName);
    const officeId = session?.officeId ?? instanceName.replace(/^office_/, "");

    resetCircuit(instanceName);
    await getSessionQR(instanceName);
    trackWhatsAppIncident(officeId, instanceName, "manual_reconnect_triggered");

    console.log(
      `[WhatsApp] office_id=${officeId} instance_name=${instanceName} manual_reconnect_triggered`,
    );

    return NextResponse.json({
      success: true,
      message: "تم طلب رمز QR جديد",
    });
  } catch (err) {
    console.error("[WhatsApp Reconnect] error:", err);
    return NextResponse.json(
      { error: "فشل في طلب إعادة الربط" },
      { status: 500 },
    );
  }
}
