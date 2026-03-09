/**
 * WhatsApp Connect API — ربط واتساب بالمكتب
 */

import { getCurrentUser } from "@/lib/auth";
import { OfficeService } from "@/services/office.service";
import { WhatsAppSessionService } from "@/services/whatsapp-session.service";
import { NextRequest, NextResponse } from "next/server";

/** GET: Get WhatsApp session status for current office */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );

    const session = await WhatsAppSessionService.getSessionByOffice(office.id);
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: Connect WhatsApp number to office */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );

    const body = await request.json();
    const { phoneNumber, instanceId, apiToken } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: "رقم الهاتف مطلوب" }, { status: 400 });
    }

    // Normalize Saudi phone number
    let normalized = phoneNumber.replace(/[^0-9]/g, "");
    if (normalized.startsWith("0")) normalized = "966" + normalized.slice(1);
    if (!normalized.startsWith("966")) normalized = "966" + normalized;

    const session = await WhatsAppSessionService.connectPhone({
      officeId: office.id,
      phoneNumber: normalized,
      instanceId,
      apiToken,
    });

    if (!session) {
      return NextResponse.json(
        { error: "فشل في ربط الواتساب" },
        { status: 500 },
      );
    }

    return NextResponse.json({ session }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE: Disconnect WhatsApp */
export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );

    const session = await WhatsAppSessionService.getSessionByOffice(office.id);
    if (!session)
      return NextResponse.json({ error: "لا توجد جلسة" }, { status: 404 });

    await WhatsAppSessionService.disconnect(session.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
