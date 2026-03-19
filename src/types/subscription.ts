/**
 * Subscription Types — الاشتراكات
 */

export type SubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled"
  | "trial"
  | "suspended";

export interface Subscription {
  id: string;
  officeId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  aiMessagesUsed: number;
  whatsappMessagesUsed: number;
  messageLimit: number | null;
  overageMessages: number;
  overageAmountSar: number;
  billingCycleStart: string | null;
  billingCycleEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionWithPlan extends Subscription {
  plan?: import("./plan").Plan;
}

export interface UsageLog {
  id: string;
  officeId: string;
  type:
    | "ai_message"
    | "whatsapp_message"
    | "property_created"
    | "ai_response"
    | "lead_created"
    | "message_sent";
  count: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
