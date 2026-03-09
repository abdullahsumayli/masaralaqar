/**
 * AI Engine — محرك الذكاء الاصطناعي المركزي
 *
 * خط سير الرسالة:
 * WhatsApp Message → Identify Office → Load AI Agent Settings
 * → Search Properties Database → Generate AI Reply → Send Response
 */

import { AIAgentRepository } from "@/repositories/ai-agent.repo";
import { PropertyRepository } from "@/repositories/property.repo";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import type { AIAgent } from "@/types/ai-agent";
import type { PropertyType } from "@/types/property";
import { AIAgentService } from "./ai-agent.service";
import { AIService } from "./ai.service";

interface IncomingMessage {
  phone: string;
  text: string;
  messageId: string;
}

interface AIEngineResult {
  reply: string;
  properties: Array<Record<string, unknown>>;
  suggestions: string[];
  officeId: string;
  leadId?: string;
}

export class AIEngine {
  /**
   * Main entry point: Process an incoming WhatsApp message
   * 1. Identify office from the WhatsApp session phone (the business number)
   * 2. Load AI Agent settings for the office
   * 3. Check subscription limits
   * 4. Search properties in office's catalog
   * 5. Generate AI reply using office's agent persona
   * 6. Return response
   */
  static async processMessage(
    businessPhone: string,
    message: IncomingMessage,
    conversationHistory: Array<{ role: string; content: string }> = [],
  ): Promise<AIEngineResult | null> {
    // ── Step 1: Identify Office ──
    const session = await WhatsAppSessionRepository.getByPhone(businessPhone);
    if (!session) {
      console.error(`[AIEngine] No session found for phone: ${businessPhone}`);
      return null;
    }
    const officeId = session.officeId;

    // ── Step 2: Load AI Agent ──
    const agent = await AIAgentRepository.getByOfficeId(officeId);
    if (!agent) {
      console.error(`[AIEngine] No AI agent found for office: ${officeId}`);
      return null;
    }

    // ── Step 3: Check subscription limits ──
    const aiLimit = await SubscriptionRepository.checkLimit(
      officeId,
      "ai_message",
    );
    if (!aiLimit.allowed) {
      return {
        reply:
          "عذراً، تم استنفاد حد الرسائل المتاح في باقتك الحالية. يرجى ترقية الباقة للاستمرار.",
        properties: [],
        suggestions: ["تواصل مع الدعم لترقية باقتك"],
        officeId,
      };
    }

    // ── Step 4: Analyze message & search properties ──
    const tenantContext = {
      tenantId: officeId,
      whatsappNumber: businessPhone,
      aiPersona: {
        agentName: agent.agentName,
        responseStyle:
          agent.tone === "friendly"
            ? ("friendly" as const)
            : ("formal" as const),
        welcomeMessage: agent.greetingMessage,
      },
    };

    const analysis = AIService.analyzeMessage(message.text, tenantContext);

    let matchedProperties: Array<Record<string, unknown>> = [];
    if (
      analysis.extractedData.propertyType ||
      analysis.extractedData.budget ||
      analysis.extractedData.city
    ) {
      const searchResult = await PropertyRepository.searchProperties(officeId, {
        type: analysis.extractedData.propertyType as PropertyType | undefined,
        minPrice: analysis.extractedData.budget?.min,
        maxPrice: analysis.extractedData.budget?.max,
        city: analysis.extractedData.city,
        bedrooms: analysis.extractedData.bedrooms,
      });
      matchedProperties = searchResult || [];
    }

    // ── Step 5: Generate AI Reply ──
    const propertyContext = matchedProperties.map(
      (p: Record<string, unknown>) => ({
        title: p.title as string,
        price: p.price as number,
        city: (p.city || p.location) as string,
        type: p.type as string,
      }),
    );

    const systemPrompt = AIAgentService.buildSystemPrompt(
      agent,
      propertyContext,
    );

    const response = await this.generateReply(
      message.text,
      systemPrompt,
      matchedProperties,
      tenantContext,
      conversationHistory,
    );

    // ── Step 6: Track usage ──
    await SubscriptionRepository.incrementUsage(officeId, "ai_message");

    return {
      reply: response.reply,
      properties: response.properties,
      suggestions: response.suggestions,
      officeId,
    };
  }

  /**
   * Fallback-compatible entry using legacy tenant routing (webhook secret)
   * Used by existing webhook until fully migrated to office-based routing
   */
  static async processMessageLegacy(
    tenantId: string,
    message: IncomingMessage,
    conversationHistory: Array<{ role: string; content: string }> = [],
  ): Promise<AIEngineResult | null> {
    // Try to find agent for this tenant (which may be linked to an office)
    const agent = await AIAgentRepository.getByOfficeId(tenantId);

    const defaultAgent: AIAgent = {
      id: "",
      officeId: tenantId,
      agentName: "مساعد مسار العقار",
      greetingMessage: "السلام عليكم، أهلاً بك في مسار العقار 🏠",
      officeDescription: "",
      tone: "friendly",
      language: "ar",
      workingHours: {
        start: "08:00",
        end: "22:00",
        days: ["sun", "mon", "tue", "wed", "thu"],
      },
      customInstructions: "",
      createdAt: "",
      updatedAt: "",
    };

    const activeAgent = agent || defaultAgent;

    const tenantContext = {
      tenantId,
      whatsappNumber: "",
      aiPersona: {
        agentName: activeAgent.agentName,
        responseStyle:
          activeAgent.tone === "friendly"
            ? ("friendly" as const)
            : ("formal" as const),
        welcomeMessage: activeAgent.greetingMessage,
      },
    };

    const analysis = AIService.analyzeMessage(message.text, tenantContext);

    let matchedProperties: Array<Record<string, unknown>> = [];
    if (
      analysis.extractedData.propertyType ||
      analysis.extractedData.budget ||
      analysis.extractedData.city
    ) {
      const searchResult = await PropertyRepository.searchProperties(tenantId, {
        type: analysis.extractedData.propertyType as PropertyType | undefined,
        minPrice: analysis.extractedData.budget?.min,
        maxPrice: analysis.extractedData.budget?.max,
        city: analysis.extractedData.city,
        bedrooms: analysis.extractedData.bedrooms,
      });
      matchedProperties = searchResult || [];
    }

    const propertyContext = matchedProperties.map(
      (p: Record<string, unknown>) => ({
        title: p.title as string,
        price: p.price as number,
        city: (p.city || p.location) as string,
        type: p.type as string,
      }),
    );

    const systemPrompt = AIAgentService.buildSystemPrompt(
      activeAgent,
      propertyContext,
    );

    const response = await this.generateReply(
      message.text,
      systemPrompt,
      matchedProperties,
      tenantContext,
      conversationHistory,
    );

    return {
      reply: response.reply,
      properties: response.properties,
      suggestions: response.suggestions,
      officeId: tenantId,
    };
  }

  // ── Internal: call OpenAI with custom system prompt ──
  private static async generateReply(
    userMessage: string,
    systemPrompt: string,
    properties: Array<Record<string, unknown>>,
    tenantContext: {
      tenantId: string;
      whatsappNumber: string;
      aiPersona: {
        agentName: string;
        responseStyle: "friendly" | "formal";
        welcomeMessage: string;
      };
    },
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<{
    reply: string;
    properties: Array<Record<string, unknown>>;
    suggestions: string[];
  }> {
    try {
      // Use existing AIService.generateSmartReply which already handles OpenAI
      const result = await AIService.generateSmartReply(
        userMessage,
        properties,
        tenantContext,
        conversationHistory,
      );

      return {
        reply: result.reply,
        properties: result.properties || [],
        suggestions: result.suggestions || [],
      };
    } catch (error) {
      console.error("[AIEngine] Error generating reply:", error);
      // Fallback to rule-based reply
      const fallback = AIService.generatePropertyReply(
        properties,
        tenantContext,
      );
      return {
        reply: fallback,
        properties: properties.slice(0, 3),
        suggestions: [
          "أخبرني بالمدينة المفضلة",
          "ما ميزانيتك؟",
          "ما نوع العقار المطلوب؟",
        ],
      };
    }
  }
}
