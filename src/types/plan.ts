/**
 * Plan Types — باقات الاشتراك
 */

export interface Plan {
  id: string;
  name: string;
  nameAr: string;
  maxProperties: number;
  maxAiMessages: number;
  maxWhatsappMessages: number;
  price: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface PlanCreateInput {
  name: string;
  nameAr?: string;
  maxProperties?: number;
  maxAiMessages?: number;
  maxWhatsappMessages?: number;
  price?: number;
  features?: string[];
}

export interface PlanUpdateInput {
  name?: string;
  nameAr?: string;
  maxProperties?: number;
  maxAiMessages?: number;
  maxWhatsappMessages?: number;
  price?: number;
  features?: string[];
  isActive?: boolean;
  sortOrder?: number;
}
