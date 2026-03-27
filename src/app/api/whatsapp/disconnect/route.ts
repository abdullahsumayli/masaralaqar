/**
 * POST /api/whatsapp/disconnect — Force disconnect instance (admin only)
 * Logs: manual_disconnect
 */

import { logoutEvolutionInstance } from "@/integrations/whatsapp";
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

    await logoutEvolutionInstance(instanceName);
    trackWhatsAppIncident(officeId, instanceName, "manual_disconnect");

    console.log(
      `[WhatsApp] office_id=${officeId} instance_name=${instanceName} manual_disconnect`,
    );

    return NextResponse.json({
      success: true,
      message: "تم فصل الاتصال",
    });
  } catch (err) {
    console.error("[WhatsApp Disconnect] error:", err);
    return NextResponse.json(
      { error: "فشل في فصل الاتصال" },
      { status: 500 },
    );
  }
}
