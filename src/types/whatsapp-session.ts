/**
 * WhatsApp Session Types — جلسات الواتساب
 */

export type SessionStatus =
  | "connected"
  | "disconnected"
  | "pending"
  | "expired";

export interface WhatsAppSession {
  id: string;
  officeId: string;
  phoneNumber: string;
  sessionStatus: SessionStatus;
  instanceId: string | null;
  apiToken: string | null;
  webhookUrl: string | null;
  lastConnectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppSessionCreateInput {
  officeId: string;
  phoneNumber: string;
  instanceId?: string;
  apiToken?: string;
}
