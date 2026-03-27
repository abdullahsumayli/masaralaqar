/**
 * Admin: Trigger QR regeneration for an instance (reconnect)
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import {
  checkInstanceStatus,
  getEvolutionQR,
} from "@/integrations/whatsapp";
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
    const instanceName = body?.instanceName as string | undefined;
    if (!instanceName?.trim()) {
      return NextResponse.json(
        { error: "instanceName مطلوب" },
        { status: 400 },
      );
    }

    const status = await checkInstanceStatus(instanceName);
    if (status?.state === "open") {
      return NextResponse.json({
        success: true,
        message: "المثيل متصل بالفعل",
        alreadyConnected: true,
      });
    }

    await getEvolutionQR(instanceName);
    return NextResponse.json({
      success: true,
      message: "تم طلب رمز QR جديد",
    });
  } catch (err) {
    console.error("[WhatsApp Monitor] reconnect error:", err);
    return NextResponse.json(
      { error: "فشل في طلب إعادة الربط" },
      { status: 500 },
    );
  }
}
