/**
 * WhatsApp Connect API — ربط واتساب بالمكتب عبر Evolution API
 */

import {
    createEvolutionInstance,
    deleteEvolutionInstance,
    getEvolutionQR,
    getEvolutionStatus,
} from "@/integrations/whatsapp";
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

    // Check live status from Evolution API
    let evolutionStatus: string | null = null;
    try {
      const instanceData = await getEvolutionStatus(office.id);
      if (instanceData?.instance?.state === "open") {
        evolutionStatus = "connected";
      } else if (instanceData) {
        evolutionStatus = "disconnected";
      }
    } catch {
      // Evolution API not reachable — rely on DB status
    }

    return NextResponse.json({ session, evolutionStatus });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: Connect WhatsApp — create Evolution instance and return QR */
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

    const body = await request.json().catch(() => ({}));
    const { phoneNumber } = body;

    // Create Evolution instance (idempotent — ignores if already exists)
    try {
      await createEvolutionInstance(office.id);
    } catch (err) {
      console.error("Evolution instance creation error:", err);
      // May already exist — continue to QR
    }

    // Get QR code
    let qrData: any = null;
    try {
      qrData = await getEvolutionQR(office.id);
    } catch (err) {
      console.error("Evolution QR error:", err);
      return NextResponse.json(
        { error: "فشل في الحصول على QR Code" },
        { status: 500 },
      );
    }

    // Normalize phone if provided
    let normalized = "";
    if (phoneNumber) {
      normalized = phoneNumber.replace(/[^0-9]/g, "");
      if (normalized.startsWith("0")) normalized = "966" + normalized.slice(1);
      if (!normalized.startsWith("966")) normalized = "966" + normalized;
    }

    // Upsert session in DB
    if (normalized) {
      await WhatsAppSessionService.connectPhone({
        officeId: office.id,
        phoneNumber: normalized,
        instanceId: `office_${office.id}`,
      });
    }

    // Return QR (base64 image)
    return NextResponse.json({
      qr: qrData?.base64 || null,
      pairingCode: qrData?.pairingCode || null,
      session: normalized
        ? {
            officeId: office.id,
            phoneNumber: normalized,
            sessionStatus: "pending",
            instanceId: `office_${office.id}`,
          }
        : null,
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE: Disconnect WhatsApp — delete Evolution instance */
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

    // Delete Evolution instance
    try {
      await deleteEvolutionInstance(office.id);
    } catch {
      // Instance may not exist
    }

    // Remove DB session
    const session = await WhatsAppSessionService.getSessionByOffice(office.id);
    if (session) {
      await WhatsAppSessionService.disconnect(session.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
