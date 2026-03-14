/**
 * Office Types — المكتب العقاري
 */

export interface Office {
  id: string;
  officeName: string;
  ownerName: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  planId: string | null;
  legacyTenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeCreateInput {
  officeName: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  city?: string;
  planId?: string;
}

export interface OfficeUpdateInput {
  officeName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  city?: string;
  planId?: string;
}

export interface OfficeWithDetails extends Office {
  aiAgent?: import("./ai-agent").AIAgent | null;
  subscription?: import("./subscription").Subscription | null;
  whatsappSession?: import("./whatsapp-session").WhatsAppSession | null;
  plan?: import("./plan").Plan | null;
  propertiesCount?: number;
  leadsCount?: number;
}
