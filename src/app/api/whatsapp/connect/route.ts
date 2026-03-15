/**
 * WhatsApp Connect API — ربط واتساب بالمكتب عبر Evolution API
 */

import {
    createEvolutionInstance,
    deleteEvolutionInstance,
    getEvolutionQR,
    getEvolutionStatus,
} from "@/integrations/whatsapp";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { OfficeService } from "@/services/office.service";
import { WhatsAppSessionService } from "@/services/whatsapp-session.service";
import { NextRequest, NextResponse } from "next/server";

async function createSupabaseRouteClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try { cookieStore.set(name, value, options); } catch {}
          });
        },
      },
    }
  );
}

/** GET: Get WhatsApp session status for current office */
export async function GET() {
  try {
    const supabase = await createSupabaseRouteClient();
    const { data: { user } } = await supabase.auth.getUser();
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
  } catch (err) {
    console.error("WhatsApp GET error:", err);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: Connect WhatsApp — create Evolution instance and return QR */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );

    const body = await request.json().catch(() => ({}));
    const { phoneNumber } = body;

    if (!process.env.EVOLUTION_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "إعدادات Evolution API غير مكتملة (EVOLUTION_API_KEY)" },
        { status: 503 },
      );
    }

    // Create Evolution instance (idempotent — ignores if already exists)
    try {
      await createEvolutionInstance(office.id);
    } catch (err) {
      console.error("Evolution instance creation error:", err);
      // May already exist — continue to QR
    }

    // Normalize phone if provided (for DB and optional Evolution query)
    let normalized = "";
    if (phoneNumber) {
      normalized = phoneNumber.replace(/[^0-9]/g, "");
      if (normalized.startsWith("0")) normalized = "966" + normalized.slice(1);
      if (!normalized.startsWith("966")) normalized = "966" + normalized;
    }

    // Get QR (with retry); some Evolution versions accept number for better QR
    let qrData: { base64: string | null; pairingCode: string | null } = { base64: null, pairingCode: null };
    try {
      const raw = await getEvolutionQR(office.id, normalized || undefined);
      qrData = { base64: raw.base64 ?? null, pairingCode: raw.pairingCode ?? null };
    } catch (err) {
      console.error("Evolution QR error:", err);
      return NextResponse.json(
        { error: "فشل في الحصول على QR أو رمز الربط — تحقق من Evolution API والاتصال بالسيرفر" },
        { status: 500 },
      );
    }

    // Upsert session in DB
    if (normalized) {
      await WhatsAppSessionService.connectPhone({
        officeId: office.id,
        phoneNumber: normalized,
        instanceId: "saqr",
      });
    }

    // Return QR image and/or pairing code (Evolution v2 may return only pairingCode)
    return NextResponse.json({
      qr: qrData.base64 || null,
      pairingCode: qrData.pairingCode || null,
      session: normalized
        ? {
            officeId: office.id,
            phoneNumber: normalized,
            sessionStatus: "pending",
            instanceId: "saqr",
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
    const supabase = await createSupabaseRouteClient();
    const { data: { user } } = await supabase.auth.getUser();
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
