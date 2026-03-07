/**
 * Message Types
 * Defines all message and AI analysis related types
 */

export interface WhatsAppMessage {
  id: string;
  phone: string;
  text: string;
  timestamp: number;
  media?: {
    type: "image" | "document" | "audio";
    url: string;
  };
}

export interface MessageAnalysis {
  intent: "search" | "inquiry" | "booking" | "complaint" | "other";
  extractedData: {
    budget?: number;
    location?: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: {
      min?: number;
      max?: number;
    };
  };
  confidence: number; // 0-1
  rawMessage: string;
}

export interface AIResponse {
  reply: string;
  suggestions?: string[];
  properties?: Array<{
    id: string;
    title: string;
    price: number;
    location: string;
    city?: string;
    type: string;
    bedrooms?: number;
    image_url?: string;
    images?: string[];
  }>;
  shouldCreateLead: boolean;
  leadData?: {
    name?: string;
    phone: string;
    interest?: string;
    budget?: number;
  };
}

export interface TenantContext {
  tenantId: string;
  whatsappNumber: string;
  aiPersona: {
    agentName: string;
    responseStyle: "formal" | "friendly";
    welcomeMessage: string;
  };
}

export interface WebhookPayload {
  entry: Array<{
    changes: Array<{
      value: {
        messaging_product: string;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text: {
            body: string;
          };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
        }>;
      };
    }>;
  }>;
}
