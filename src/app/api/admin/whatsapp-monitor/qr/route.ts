/**
 * Admin: Get QR code for an instance
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { getSessionQR } from "@/integrations/whatsapp";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const instanceName = request.nextUrl.searchParams.get("instance");
    if (!instanceName) {
      return NextResponse.json(
        { error: "معامل instance مطلوب" },
        { status: 400 },
      );
    }

    const { base64, pairingCode } = await getSessionQR(instanceName);
    return NextResponse.json({
      success: true,
      qr: base64,
      pairingCode,
    });
  } catch (err) {
    console.error("[WhatsApp Monitor] QR error:", err);
    return NextResponse.json(
      { error: "فشل في جلب رمز QR" },
      { status: 500 },
    );
  }
}
