/**
 * WhatsApp Connect API — multi-tenant: one instance per office
 *
 * Instance naming: office_{officeId}
 * Each office gets its own Evolution API instance, QR code, and webhook routing.
 */
import {
  checkInstanceStatus,
  deleteEvolutionInstance,
  ensureInstanceExists,
  getEvolutionStatus,
  getFreshQR,
  invalidateInstanceCache,
  setEvolutionWebhook,
} from "@/integrations/whatsapp";
import { instanceNameForOffice } from "@/lib/evolution";
import { OfficeService } from "@/services/office.service";
import { trackWhatsAppOnboarding } from "@/services/whatsapp-onboarding-tracking.service";
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
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.ensureUserOffice(user.id);
    if (!office)
      return NextResponse.json(
        { error: "فشل في إنشاء المكتب — تواصل مع الدعم الفني" },
        { status: 500 },
      );

    const session = await WhatsAppSessionService.getSessionByOffice(office.id);

    // Resolve the instance name from the session (or derive it)
    const instanceName = session?.instanceId || instanceNameForOffice(office.id);

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
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.ensureUserOffice(user.id);
    if (!office)
      return NextResponse.json(
        { error: "فشل في إنشاء المكتب — تواصل مع الدعم الفني" },
        { status: 500 },
      );

    // Track connect_clicked (user started onboarding)
    trackWhatsAppOnboarding(office.id, "whatsapp_connect_clicked");

    const body = await request.json().catch(() => ({}));
    const { phoneNumber } = body;

    if (!process.env.EVOLUTION_API_KEY?.trim()) {
      trackWhatsAppOnboarding(office.id, "whatsapp_failed", {
        reason: "evolution_api_missing",
      });
      return NextResponse.json(
        { error: "إعدادات Evolution API غير مكتملة (EVOLUTION_API_KEY)" },
        { status: 503 },
      );
    }

    const instanceName = instanceNameForOffice(office.id);
    const logPrefix = `[WhatsApp Connect] office=${office.id} instance=${instanceName}`;

    // Normalize phone if provided
    let normalized = "";
    if (phoneNumber) {
      normalized = phoneNumber.replace(/[^0-9]/g, "");
      if (normalized.startsWith("0")) normalized = "966" + normalized.slice(1);
      if (!normalized.startsWith("966")) normalized = "966" + normalized;
    }

    // 1) Check instance status before generating QR
    const status = await checkInstanceStatus(instanceName);
    console.log(`${logPrefix} instance status: ${status ? status.state : "not_found"}`);

    // 2) If status is "open" → return connected immediately
    if (status?.state === "open") {
      let session = await WhatsAppSessionService.getSessionByOffice(office.id);
      await WhatsAppSessionService.connectPhone({
        officeId: office.id,
        phoneNumber: normalized || session?.phoneNumber || "pending",
        instanceId: instanceName,
      });
      session = await WhatsAppSessionService.getSessionByOffice(office.id);
      if (session && session.sessionStatus !== "connected") {
        await WhatsAppSessionService.markConnected(session.id);
        session = await WhatsAppSessionService.getSessionByOffice(office.id);
      }
      invalidateInstanceCache(office.id);

      console.log(`${logPrefix} already connected — returning without QR`);
      return NextResponse.json({
        connected: true,
        evolutionStatus: "connected",
        instanceName,
        session: session
          ? {
              officeId: session.officeId,
              phoneNumber: session.phoneNumber,
              sessionStatus: "connected" as const,
              instanceId: session.instanceId,
              lastConnectedAt: session.lastConnectedAt,
            }
          : {
              officeId: office.id,
              phoneNumber: normalized || "pending",
              sessionStatus: "connected" as const,
              instanceId: instanceName,
              lastConnectedAt: new Date().toISOString(),
            },
      });
    }

    // 3) If instance does not exist → create + set webhook
    if (!status) {
      const ready = await ensureInstanceExists(instanceName, logPrefix);
      if (!ready) {
        trackWhatsAppOnboarding(office.id, "whatsapp_failed", {
          reason: "instance_creation_failed",
        });
        return NextResponse.json(
          { error: "فشل في إنشاء الاتصال — تحقق من Evolution API" },
          { status: 500 },
        );
      }
    } else {
      // 4) Instance exists but close/logged out → reinitialize (trigger fresh QR)
      console.log(`${logPrefix} reconnect triggered — state=${status.state}`);
      try {
        await setEvolutionWebhook(instanceName);
      } catch (err) {
        console.warn(`${logPrefix} setWebhook on reconnect:`, err);
      }
    }

    // 5) Get fresh QR
    let qrData: { base64: string | null; pairingCode: string | null };
    try {
      const raw = await getFreshQR(
        instanceName,
        normalized || undefined,
        logPrefix,
      );
      qrData = {
        base64: raw.base64 ?? null,
        pairingCode: raw.pairingCode ?? null,
      };
    } catch (err) {
      console.error(`${logPrefix} QR fetch failed:`, err);
      trackWhatsAppOnboarding(office.id, "whatsapp_failed", {
        reason: "qr_fetch_failed",
      });
      return NextResponse.json(
        { error: typeof err === "object" && err !== null && "message" in err ? (err as Error).message : "فشل في استرجاع رمز QR" },
        { status: 500 },
      );
    }

    trackWhatsAppOnboarding(office.id, "whatsapp_qr_shown");

    await WhatsAppSessionService.connectPhone({
      officeId: office.id,
      phoneNumber: normalized || "pending",
      instanceId: instanceName,
    });
    invalidateInstanceCache(office.id);

    return NextResponse.json({
      success: true,
      qr: qrData.base64,
      pairingCode: qrData.pairingCode,
      instanceName,
      session: {
        officeId: office.id,
        phoneNumber: normalized || "pending",
        sessionStatus: "pending",
        instanceId: instanceName,
      },
    });
  } catch (err) {
    console.error("WhatsApp Connect POST error:", err);
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
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

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
    const instanceName = session?.instanceId || instanceNameForOffice(office.id);

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
