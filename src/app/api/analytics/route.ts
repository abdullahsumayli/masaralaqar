/**
 * Dashboard Analytics API — إحصائيات المكتب
 */

import { getServerUser } from "@/lib/supabase-server";
import { AnalyticsService } from "@/services/analytics.service";
import { OfficeService } from "@/services/office.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office) {
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );
    }

    const analytics = await AnalyticsService.getOfficeAnalytics(office.id);

    return NextResponse.json({ success: true, data: analytics });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
