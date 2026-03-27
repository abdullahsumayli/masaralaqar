/**
 * Admin WhatsApp Monitor API — aggregated connection status per office
 *
 * GET: Returns monitor rows (office name, connection status, last activity, failure count)
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export type ConnectionStatus = "connected" | "reconnecting" | "failed";

export interface WhatsAppMonitorRow {
  officeId: string;
  officeName: string;
  instanceName: string;
  connectionStatus: ConnectionStatus;
  lastActivity: string | null;
  failureCount: number;
  needsManualIntervention: boolean;
  phoneNumber: string;
  sessionStatus: string;
}

const FAILURE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** GET: Monitor data for admin dashboard */
export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const since = new Date(Date.now() - FAILURE_WINDOW_MS).toISOString();

    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select(`
        id,
        office_id,
        instance_id,
        session_status,
        phone_number,
        last_connected_at,
        updated_at
      `)
      .order("updated_at", { ascending: false });

    if (sessionsError || !sessions?.length) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const officeIds = [...new Set(sessions.map((s) => s.office_id))];
    const { data: offices } = await supabaseAdmin
      .from("offices")
      .select("id, office_name")
      .in("id", officeIds);

    const officeMap = new Map(
      (offices ?? []).map((o) => [o.id, o.office_name || "—"]),
    );

    const { data: incidents } = await supabaseAdmin
      .from("whatsapp_incidents")
      .select("office_id, instance_name, event_type, needs_manual_intervention, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    const incidentsByInstance = new Map<
      string,
      Array<{
        eventType: string;
        needsManualIntervention: boolean;
        createdAt: string;
      }>
    >();
    for (const inc of incidents ?? []) {
      const key = inc.instance_name as string;
      const list = incidentsByInstance.get(key) ?? [];
      list.push({
        eventType: inc.event_type as string,
        needsManualIntervention: (inc.needs_manual_intervention as boolean) ?? false,
        createdAt: inc.created_at as string,
      });
      incidentsByInstance.set(key, list);
    }

    const rows: WhatsAppMonitorRow[] = sessions.map((s) => {
      const instanceName = (s.instance_id as string) || `office_${s.office_id}`;
      const instIncidents = incidentsByInstance.get(instanceName) ?? [];
      const failureCount = instIncidents.filter(
        (i) => i.eventType === "reconnect_failed",
      ).length;
      const needsManual = instIncidents.some((i) => i.needsManualIntervention);
      const lastIncident = instIncidents[0]?.createdAt ?? null;
      const lastActivity =
        lastIncident ||
        (s.last_connected_at as string) ||
        (s.updated_at as string) ||
        null;

      let connectionStatus: ConnectionStatus = "connected";
      if (s.session_status === "disconnected" || needsManual || failureCount >= 3) {
        connectionStatus = "failed";
      } else if (
        instIncidents.some((i) => i.eventType === "auto_reconnect_triggered") &&
        !instIncidents.some((i) => i.eventType === "reconnect_success")
      ) {
        connectionStatus = "reconnecting";
      } else if (s.session_status === "connected" && failureCount === 0) {
        connectionStatus = "connected";
      } else if (failureCount > 0) {
        connectionStatus = "failed";
      }

      return {
        officeId: s.office_id as string,
        officeName: officeMap.get(s.office_id) ?? "—",
        instanceName,
        connectionStatus,
        lastActivity,
        failureCount,
        needsManualIntervention: needsManual,
        phoneNumber: (s.phone_number as string) || "—",
        sessionStatus: (s.session_status as string) || "pending",
      };
    });

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("[WhatsApp Monitor] GET error:", err);
    return NextResponse.json(
      { error: "خطأ في جلب البيانات" },
      { status: 500 },
    );
  }
}
