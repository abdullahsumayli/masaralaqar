/**
 * WhatsApp Incident Tracking Service
 *
 * Logs incidents and persists to whatsapp_incidents (service role).
 * Fire-and-forget: callers should NOT await this.
 */

import { supabaseAdmin } from "@/lib/supabase";

export type IncidentType =
  | "instance_disconnected"
  | "auto_reconnect_triggered"
  | "reconnect_success"
  | "reconnect_failed"
  | "manual_reconnect_triggered"
  | "manual_disconnect";

interface IncidentMetadata {
  wasConnected?: boolean;
  previousState?: string;
  status?: number;
  body?: string;
  [key: string]: unknown;
}

/**
 * Track a WhatsApp incident for an office instance.
 * Currently logs to console. Can be extended to write to
 * a `whatsapp_incidents` table or trigger alerts.
 */
export function trackWhatsAppIncident(
  officeId: string,
  instanceName: string,
  type: IncidentType,
  metadata?: IncidentMetadata,
): void {
  const timestamp = new Date().toISOString();

  console.log(
    `[WhatsApp Incident] ${type} | office=${officeId} instance=${instanceName} | ${timestamp}`,
    metadata ? JSON.stringify(metadata) : "",
  );

  void supabaseAdmin
    .from("whatsapp_incidents")
    .insert({
      office_id: officeId,
      instance_name: instanceName,
      event_type: type,
      metadata: (metadata ?? {}) as Record<string, unknown>,
    })
    .then(({ error }) => {
      if (error)
        console.warn("[WhatsApp Incident] DB insert failed:", error.message);
    });
}

export interface WhatsAppIncidentRow {
  id: string;
  officeId: string;
  instanceName: string;
  eventType: string;
  severity: string | null;
  needsManualIntervention: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export async function getWhatsAppIncidents(
  limit: number,
  officeId: string | null,
): Promise<WhatsAppIncidentRow[]> {
  let q = supabaseAdmin
    .from("whatsapp_incidents")
    .select(
      "id, office_id, instance_name, event_type, severity, needs_manual_intervention, metadata, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 100));

  if (officeId) q = q.eq("office_id", officeId);

  const { data, error } = await q;
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    officeId: row.office_id as string,
    instanceName: row.instance_name as string,
    eventType: row.event_type as string,
    severity: (row.severity as string) ?? null,
    needsManualIntervention: Boolean(row.needs_manual_intervention),
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
  }));
}
