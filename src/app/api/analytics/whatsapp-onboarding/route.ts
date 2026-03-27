/**
 * WhatsApp Onboarding Analytics API
 *
 * GET: Returns conversion stats (conversion rate, average time to connect)
 * - Office users: stats for their office only
 * - Admin: platform-wide stats (or ?office_id= for specific office)
 *
 * POST: Track event from client (e.g. whatsapp_failed when API returns error)
 * Body: { event: 'whatsapp_failed', error?: string }
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { OfficeService } from "@/services/office.service";
import {
  getWhatsAppOnboardingStats,
  trackWhatsAppOnboarding,
  WhatsAppOnboardingEvent,
} from "@/services/whatsapp-onboarding-tracking.service";
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ALLOWED_EVENTS: WhatsAppOnboardingEvent[] = [
  "whatsapp_failed",
];

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user)
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const event = body?.event as string | undefined;
    const error = body?.error as string | undefined;

    if (
      !event ||
      !CLIENT_ALLOWED_EVENTS.includes(event as WhatsAppOnboardingEvent)
    ) {
      return NextResponse.json(
        { error: "حدث غير مدعوم" },
        { status: 400 }
      );
    }

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json({ error: "لا يوجد مكتب" }, { status: 404 });

    trackWhatsAppOnboarding(office.id, event as WhatsAppOnboardingEvent, {
      source: "client",
      ...(error && { error }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "خطأ في تسجيل الحدث" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user)
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (!profile)
      return NextResponse.json({ error: "ملف المستخدم غير موجود" }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const officeIdParam = searchParams.get("office_id");

    let officeId: string | null = null;

    if (profile.role === "admin" && officeIdParam) {
      officeId = officeIdParam;
    } else if (profile.office_id) {
      officeId = profile.office_id;
    }

    const stats: WhatsAppOnboardingStats =
      await getWhatsAppOnboardingStats(officeId);

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        conversionRatePercent: stats.conversionRate,
        averageTimeToConnectSeconds: stats.averageTimeToConnectSeconds,
      },
    });
  } catch (err) {
    console.error("[WhatsAppOnboarding] GET error:", err);
    return NextResponse.json(
      { error: "خطأ في جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
