/**
 * WhatsApp Incidents API — connection incident monitoring
 *
 * GET: Returns last 50 incidents (or ?limit=N, ?office_id= for filter)
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { getWhatsAppIncidents } from "@/services/whatsapp-incident.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user)
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (!profile)
      return NextResponse.json({ error: "ملف المستخدم غير موجود" }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const officeIdParam = searchParams.get("office_id");

    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 100) : 50;

    // Office users: only their office. Admin: all or ?office_id= filter
    let officeId: string | null = null;
    if (profile.role === "admin" && officeIdParam) {
      officeId = officeIdParam;
    } else if (profile.office_id) {
      officeId = profile.office_id;
    }

    const incidents = await getWhatsAppIncidents(limit, officeId);

    return NextResponse.json({
      success: true,
      data: incidents,
    });
  } catch (err) {
    console.error("[WhatsApp Incidents] GET error:", err);
    return NextResponse.json(
      { error: "خطأ في جلب الحوادث" },
      { status: 500 },
    );
  }
}
