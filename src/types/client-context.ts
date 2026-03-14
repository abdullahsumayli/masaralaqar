/**
 * Client Context Types — سياق العميل وذاكرته
 */

export interface ClientContext {
  id: string;
  officeId: string;
  phoneNumber: string;
  preferredCity: string | null;
  preferredPropertyType: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  bedrooms: number | null;
  preferredAreaMin: number | null;
  preferredAreaMax: number | null;
  lifestyleTags: string[];
  conversationSummary: string;
  interactionCount: number;
  lastInteraction: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientContextUpdate {
  preferredCity?: string;
  preferredPropertyType?: string;
  budgetMin?: number;
  budgetMax?: number;
  bedrooms?: number;
  preferredAreaMin?: number;
  preferredAreaMax?: number;
  lifestyleTags?: string[];
  conversationSummary?: string;
}

export interface ClientAction {
  id: string;
  officeId: string;
  clientPhone: string;
  propertyId: string | null;
  actionType: ClientActionType;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type ClientActionType =
  | "view"
  | "interest"
  | "visit"
  | "reject"
  | "inquiry"
  | "recommendation_shown";
