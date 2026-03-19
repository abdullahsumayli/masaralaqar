/**
 * GET /api/whatsapp/qr?instance_name=... — Return QR for instance (admin only)
 */

import { getEvolutionQR } from "@/integrations/whatsapp";
import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const instanceName =
      request.nextUrl.searchParams.get("instance_name") ??
      request.nextUrl.searchParams.get("instance");
    if (!instanceName) {
      return NextResponse.json(
        { error: "معامل instance_name مطلوب" },
        { status: 400 },
      );
    }

    const { base64, pairingCode } = await getEvolutionQR(instanceName);
    return NextResponse.json({
      success: true,
      qr: base64,
      pairingCode,
    });
  } catch (err) {
    console.error("[WhatsApp QR] error:", err);
    return NextResponse.json(
      { error: "فشل في جلب رمز QR" },
      { status: 500 },
    );
  }
}
