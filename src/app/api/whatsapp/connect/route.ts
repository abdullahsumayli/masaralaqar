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

      const body = await request.json().catch(() => ({}));
          const { phoneNumber } = body;

      if (!process.env.EVOLUTION_API_KEY?.trim()) {
              return NextResponse.json(
                { error: "إعدادات Evolution API غير مكتملة (EVOLUTION_API_KEY)" },
                { status: 503 },
                      );
      }

      // STEP 1: Ensure instance exists
      const instanceName = instanceNameForOffice(office.id);
          await createEvolutionInstance(instanceName);

      // STEP 2: Ensure webhook is set
      await setEvolutionWebhook(instanceName);
          console.log(
                  `[WhatsApp Connect] Webhook configured for instance ${instanceName}`,
                );

      // Normalize phone if provided
      let normalized = "";
          if (phoneNumber) {
                  normalized = phoneNumber.replace(/[^0-9]/g, "");
                  if (normalized.startsWith("0")) normalized = "966" + normalized.slice(1);
                  if (!normalized.startsWith("966")) normalized = "966" + normalized;
          }

      // STEP 3: Wait briefly for Evolution to initialize
      await new Promise((r) => setTimeout(r, 1000));

      // STEP 4: Retry QR fetch (up to 3 attempts)
      let qr = null;
          for (let i = 0; i < 3; i++) {
                  try {
                            const res = await getEvolutionQR(instanceName, normalized || undefined);
                            console.log("[QR Attempt]", i + 1, res);
                            if (res?.base64) {
                                        qr = res;
                                        break;
                            }
                  } catch (err) {
                            console.error("[QR ERROR]", err);
                  }
                  await new Promise((r) => setTimeout(r, 1000));
          }

      // STEP 5: Handle failure
      if (!qr) {
              return NextResponse.json(
                {
                            success: false,
                            message: "Instance not ready yet",
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

      // STEP 6: Return QR
      return NextResponse.json({
              success: true,
              qr: qr.base64,
              pairingCode: qr.pairingCode || null,
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
