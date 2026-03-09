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
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionWithPlan extends Subscription {
  plan?: import("./plan").Plan;
}

export interface UsageLog {
  id: string;
  officeId: string;
  type: "ai_message" | "whatsapp_message" | "property_created";
  metadata: Record<string, unknown>;
  createdAt: string;
}
