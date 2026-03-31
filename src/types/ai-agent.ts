/**
 * AI Agent Types — وكيل الذكاء الاصطناعي
 */

export type AIAgentTone = "professional" | "friendly" | "formal" | "casual";
export type AIAgentLanguage = "ar" | "en" | "both";

export interface AIAgentWorkingHours {
  start: string; // "08:00"
  end: string; // "22:00"
  days: string[]; // ["sun","mon","tue","wed","thu"]
}

export interface AIAgent {
  id: string;
  officeId: string;
  agentName: string;
  greetingMessage: string;
  /** Instant webhook ack to customer; empty → platform default */
  customerAckMessage: string | null;
  officeDescription: string;
  tone: AIAgentTone;
  language: AIAgentLanguage;
  workingHours: AIAgentWorkingHours;
  customInstructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIAgentUpdateInput {
  agentName?: string;
  greetingMessage?: string;
  customerAckMessage?: string | null;
  officeDescription?: string;
  tone?: AIAgentTone;
  language?: AIAgentLanguage;
  workingHours?: AIAgentWorkingHours;
  customInstructions?: string;
}
