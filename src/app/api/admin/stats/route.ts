/**
 * Admin Stats API — إحصائيات لوحة إدارة المنصة
 */

import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { OfficeService } from "@/services/office.service";
import { NextResponse } from "next/server";

/** GET: Platform statistics */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const stats = await OfficeService.getPlatformStats();

    // Get AI usage stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayAiMessages } = await supabaseAdmin
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("type", "ai_message")
      .gte("created_at", today.toISOString());

    const { count: todayWhatsappMessages } = await supabaseAdmin
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("type", "whatsapp_message")
      .gte("created_at", today.toISOString());

    // Recent offices
    const { data: recentOffices } = await supabaseAdmin
      .from("offices")
      .select("id, office_name, city, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        ...stats,
        todayAiMessages: todayAiMessages ?? 0,
        todayWhatsappMessages: todayWhatsappMessages ?? 0,
      },
      recentOffices: recentOffices || [],
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
