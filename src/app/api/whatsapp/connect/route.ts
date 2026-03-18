/**
 * WhatsApp Connect API — multi-tenant: one instance per office
 *
 * Instance naming: office_{officeId}
 * Each office gets its own Evolution API instance, QR code, and webhook routing.
 */

import {
  createEvolutionInstance,
  deleteEvolutionInstance,
  getEvolutionQR,
  getEvolutionStatus,
  invalidateInstanceCache,
  setEvolutionWebhook,
} from "@/integrations/whatsapp";
import { instanceNameForOffice } from "@/lib/evolution";
import { OfficeService } from "@/services/office.service";
import { WhatsAppSessionService } from "@/services/whatsapp-session.service";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {}
          });
        },
      },
    },
  );
}

/** GET: Get WhatsApp session status for current office */
export async function GET() {
  try {
    const supabase = await createSupabaseRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.ensureUserOffice(user.id);
    if (!office)
      return NextResponse.json(
        { error: "فشل في إنشاء المكتب — تواصل مع الدعم الفني" },
        { status: 500 },
      );

    const session = await WhatsAppSessionService.getSessionByOffice(office.id);

    // Resolve the instance name from the session (or derive it)
    const instanceName =
      session?.instanceId || instanceNameForOffice(office.id);

    // Check live status from Evolution API using the office's own instance
    let evolutionStatus: string | null = null;
    try {
      const instanceData = await getEvolutionStatus(instanceName);
      if (instanceData?.instance?.state === "open") {
        evolutionStatus = "connected";
      } else if (instanceData) {
        evolutionStatus = "disconnected";
      }
    } catch {
      // Evolution API not reachable — rely on DB status
    }

    return NextResponse.json({ session, evolutionStatus, instanceName });
  } catch (err) {
    console.error("WhatsApp GET error:", err);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: Connect WhatsApp — create per-office Evolution instance and return QR */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.ensureUserOffice(user.id);
    if (!office)
      return NextResponse.json(
        { error: "فشل في إنشاء المكتب — تواصل مع الدعم الفني" },
        { status: 500 },
      );

    const body = await request.json().catch(() => ({}));
    const { phoneNumber } = body;

    if (!process.env.EVOLUTION_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "إعدادات Evolution API غير مكتملة (EVOLUTION_API_KEY)" },
        { status: 503 },
      );
    }

    // Generate per-office instance name
    const instanceName = instanceNameForOffice(office.id);

    // Create Evolution instance (idempotent — ignores if already exists)
    try {
      await createEvolutionInstance(instanceName);
    } catch (err) {
      console.error("Evolution instance creation error:", err);
    }

    // ALWAYS set webhook — createInstance only sets it during first creation
    try {
      await setEvolutionWebhook(instanceName);
      console.log(
        `[WhatsApp Connect] Webhook configured for instance ${instanceName}`,
      );
    } catch (err) {
      console.error("Evolution webhook setup error:", err);
    }

    // Normalize phone if provided
    let normalized = "";
    if (phoneNumber) {
      normalized = phoneNumber.replace(/[^0-9]/g, "");
      if (normalized.startsWith("0"))
        normalized = "966" + normalized.slice(1);
      if (!normalized.startsWith("966")) normalized = "966" + normalized;
    }

    // Get QR for the office's instance
    let qrData: { base64: string | null; pairingCode: string | null } = {
      base64: null,
      pairingCode: null,
    };
    try {
      const raw = await getEvolutionQR(instanceName, normalized || undefined);
      qrData = {
        base64: raw.base64 ?? null,
        pairingCode: raw.pairingCode ?? null,
      };
    } catch (err) {
      console.error("Evolution QR error:", err);
      return NextResponse.json(
        {
          error:
            "فشل في الحصول على QR أو رمز الربط — تحقق من Evolution API والاتصال بالسيرفر",
        },
        { status: 500 },
      );
    }

    // Create/update session with the per-office instance name
    await WhatsAppSessionService.connectPhone({
      officeId: office.id,
      phoneNumber: normalized || "pending",
      instanceId: instanceName,
    });

    // Invalidate instance cache so future lookups get the new instance
    invalidateInstanceCache(office.id);

    return NextResponse.json({
      qr: qrData.base64 || null,
      pairingCode: qrData.pairingCode || null,
      instanceName,
      session: {
        officeId: office.id,
        phoneNumber: normalized || "pending",
        sessionStatus: "pending",
        instanceId: instanceName,
      },
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE: Disconnect WhatsApp — delete the office's Evolution instance */
export async function DELETE() {
  try {
    const supabase = await createSupabaseRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.ensureUserOffice(user.id);
    if (!office)
      return NextResponse.json(
        { error: "فشل في إنشاء المكتب" },
        { status: 500 },
      );

    // Resolve instance name from session (backward compat: may be "saqr" for old offices)
    const session = await WhatsAppSessionService.getSessionByOffice(
      office.id,
    );
    const instanceName =
      session?.instanceId || instanceNameForOffice(office.id);

    // Delete Evolution instance
    try {
      await deleteEvolutionInstance(instanceName);
    } catch {
      // Instance may not exist
    }

    // Remove DB session
    if (session) {
      await WhatsAppSessionService.disconnect(session.id);
    }

    // Invalidate cache
    invalidateInstanceCache(office.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
