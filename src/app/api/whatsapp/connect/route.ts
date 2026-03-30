/**
 * WhatsApp Connect API — multi-tenant: one WAHA session per office (office_{officeId}).
 */
import {
  checkInstanceStatus,
  deleteWhatsappInstance,
  ensureInstanceExists,
  getFreshQR,
  getLiveConnectionPayload,
  invalidateInstanceCache,
  syncSessionWebhook,
} from "@/integrations/whatsapp";
import { instanceNameForOffice } from "@/lib/whatsapp-session";
import { OfficeService } from "@/services/office.service";
import { trackWhatsAppOnboarding } from "@/services/whatsapp-onboarding-tracking.service";
import { WhatsAppSessionService } from "@/services/whatsapp-session.service";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { wahaApiKey, wahaBaseUrl } from "@/lib/waha-client";

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

    const instanceName = session?.instanceId || instanceNameForOffice(office.id);

    let whatsappStatus: string | null = null;
    try {
      const live = await getLiveConnectionPayload(instanceName);
      if (live?.instance?.state === "open") {
        whatsappStatus = "connected";
      } else if (live) {
        whatsappStatus = "disconnected";
      }
    } catch {
      // WAHA unreachable — rely on DB
    }

    return NextResponse.json({
      session,
      whatsappStatus,
      instanceName,
    });
  } catch (err) {
    console.error("WhatsApp GET error:", err);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: Connect — ensure WAHA session + QR */
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

    trackWhatsAppOnboarding(office.id, "whatsapp_connect_clicked");

    const body = await request.json().catch(() => ({}));
    const { phoneNumber } = body;

    if (!wahaApiKey() || !wahaBaseUrl()) {
      trackWhatsAppOnboarding(office.id, "whatsapp_failed", {
        reason: "waha_api_missing",
      });
      return NextResponse.json(
        {
          error: "إعدادات WAHA غير مكتملة (WAHA_API_URL و WAHA_API_KEY)",
        },
        { status: 503 },
      );
    }

    const instanceName = instanceNameForOffice(office.id);
    const logPrefix = `[WhatsApp Connect] office=${office.id} session=${instanceName}`;

    let normalized = "";
    if (phoneNumber) {
      normalized = phoneNumber.replace(/[^0-9]/g, "");
      if (normalized.startsWith("0")) normalized = "966" + normalized.slice(1);
      if (!normalized.startsWith("966")) normalized = "966" + normalized;
    }

    const status = await checkInstanceStatus(instanceName);
    console.log(`${logPrefix} session status: ${status ? status.state : "not_found"}`);

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

      console.log(`${logPrefix} already connected — no QR`);
      return NextResponse.json({
        connected: true,
        whatsappStatus: "connected",
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

    if (!status) {
      const ready = await ensureInstanceExists(instanceName, logPrefix);
      if (!ready) {
        trackWhatsAppOnboarding(office.id, "whatsapp_failed", {
          reason: "session_creation_failed",
        });
        return NextResponse.json(
          { error: "فشل في إنشاء الجلسة — تحقق من WAHA" },
          { status: 500 },
        );
      }
    } else {
      console.log(`${logPrefix} reconnect — state=${status.state}`);
      try {
        await syncSessionWebhook(instanceName);
      } catch (err) {
        console.warn(`${logPrefix} webhook sync:`, err);
      }
    }

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
      console.error(`${logPrefix} QR failed:`, err);
      trackWhatsAppOnboarding(office.id, "whatsapp_failed", {
        reason: "qr_fetch_failed",
      });
      return NextResponse.json(
        {
          error:
            typeof err === "object" && err !== null && "message" in err
              ? (err as Error).message
              : "فشل في استرجاع رمز QR",
        },
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

/** DELETE: Disconnect — logout/delete WAHA session + DB */
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

    const session = await WhatsAppSessionService.getSessionByOffice(office.id);
    const instanceName = session?.instanceId || instanceNameForOffice(office.id);

    try {
      await deleteWhatsappInstance(instanceName);
    } catch {
      // Session may not exist on WAHA
    }

    if (session) {
      await WhatsAppSessionService.disconnect(session.id);
    }

    invalidateInstanceCache(office.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
