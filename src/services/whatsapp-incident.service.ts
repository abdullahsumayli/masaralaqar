/**
 * WhatsApp Incident Tracking Service
 *
 * Logs WhatsApp connection incidents (disconnects, reconnects, failures)
 * to console with structured data. Can be extended to persist to Supabase
 * or send alerts when needed.
 *
 * Fire-and-forget: callers should NOT await this.
 */

export type IncidentType =
  | "instance_disconnected"
  | "auto_reconnect_triggered"
  | "reconnect_success"
  | "reconnect_failed"
  | "send_failure";

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

  // TODO: persist to Supabase whatsapp_incidents table
  // TODO: send alert for critical incidents (e.g. repeated disconnects)
}
