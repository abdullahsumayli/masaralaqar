/**
 * AI Engine — محرك الذكاء الاصطناعي المركزي
 *
 * خط سير الرسالة المحسّن:
 * WhatsApp Message → Webhook → Identify Office → Load AI Agent
 * → Load Client Context → Recommendation Engine → Generate AI Response → Send WhatsApp
 */

import { AIAgentRepository } from "@/repositories/ai-agent.repo";
import { ClientContextRepository } from "@/repositories/client-context.repo";
import { PropertyRepository } from "@/repositories/property.repo";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import type { AIAgent } from "@/types/ai-agent";
import type { PropertyType } from "@/types/property";
import { AIAgentService } from "./ai-agent.service";
import { AIService } from "./ai.service";
import { PropertyKnowledgeService } from "./property-knowledge.service";
import { RecommendationEngine } from "./recommendation.service";

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

    // ── Step 4: Load Client Context ──
    const clientContext = await ClientContextRepository.getOrCreate(
      officeId,
      message.phone,
    );

    // ── Step 5: Recommendation Engine ──
    const recommendation = await RecommendationEngine.recommend({
      officeId,
      clientPhone: message.phone,
      message: message.text,
      conversationHistory,
    });

    const matchedProperties = recommendation.properties.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      city: p.city,
      location: p.location,
      type: p.type,
      bedrooms: p.bedrooms,
      area: p.area,
      images: p.images,
    })) as Array<Record<string, unknown>>;

    // ── Step 6: Generate AI Reply with enriched context ──
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

    // Build enriched property context with knowledge
    const propertyContext = recommendation.properties.map((p) => ({
      title: p.title,
      price: p.price,
      city: p.city,
      type: p.type,
      knowledge: p.knowledge
        ? PropertyKnowledgeService.buildContextDescription(
            { id: p.id, title: p.title, type: p.type, price: p.price, city: p.city, location: p.location, bedrooms: p.bedrooms, area: p.area },
            p.knowledge,
          )
        : undefined,
      matchReasons: p.matchReasons,
    }));

    const systemPrompt = this.buildEnrichedSystemPrompt(
      agent,
      propertyContext,
      clientContext,
      recommendation.contextualReply,
    );

    const response = await this.generateReply(
      message.text,
      systemPrompt,
      matchedProperties,
      tenantContext,
      conversationHistory,
    );

    // ── Step 7: Track usage ──
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

    // ── Load Client Context + Recommendation Engine ──
    let recommendation;
    try {
      recommendation = await RecommendationEngine.recommend({
        officeId: tenantId,
        clientPhone: message.phone,
        message: message.text,
        conversationHistory,
      });
    } catch {
      // Recommendation engine may fail if tables don't exist yet — fall through to legacy
      recommendation = null;
    }

    let matchedProperties: Array<Record<string, unknown>> = [];
    let contextualReply: string | undefined;

    if (recommendation && recommendation.properties.length > 0) {
      matchedProperties = recommendation.properties.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        city: p.city,
        location: p.location,
        type: p.type,
        bedrooms: p.bedrooms,
        area: p.area,
        images: p.images,
      }));
      contextualReply = recommendation.contextualReply;
    } else {
      // Legacy: direct property search
      const analysis = AIService.analyzeMessage(message.text, tenantContext);
      if (
        analysis.extractedData.propertyType ||
        analysis.extractedData.budget ||
        analysis.extractedData.city
      ) {
        const searchResult = await PropertyRepository.searchProperties(
          tenantId,
          {
            type: analysis.extractedData.propertyType as
              | PropertyType
              | undefined,
            minPrice: analysis.extractedData.budget?.min,
            maxPrice: analysis.extractedData.budget?.max,
            city: analysis.extractedData.city,
            bedrooms: analysis.extractedData.bedrooms,
          },
        );
        matchedProperties = searchResult || [];
      }
    }

    const propertyContext = matchedProperties.map(
      (p: Record<string, unknown>) => ({
        title: p.title as string,
        price: p.price as number,
        city: ((p.city || p.location) as string) || "",
        type: (p.type as string) || "",
      }),
    );

    // Use enriched prompt if we have recommendation context
    const clientContext = recommendation?.clientContext || null;
    const systemPrompt = clientContext
      ? this.buildEnrichedSystemPrompt(
          activeAgent,
          propertyContext.map((p) => ({ ...p, knowledge: undefined, matchReasons: [] })),
          clientContext,
          contextualReply,
        )
      : AIAgentService.buildSystemPrompt(activeAgent, propertyContext);

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

  // ── Build enriched system prompt with knowledge + client context ──
  private static buildEnrichedSystemPrompt(
    agent: AIAgent,
    properties: Array<{
      title: string;
      price: number;
      city: string;
      type: string;
      knowledge?: string;
      matchReasons: string[];
    }>,
    clientContext: import("@/types/client-context").ClientContext | null,
    contextualReply?: string,
  ): string {
    // Start with the base agent prompt
    let prompt = AIAgentService.buildSystemPrompt(
      agent,
      properties.map((p) => ({
        title: p.title,
        price: p.price,
        city: p.city,
        type: p.type,
      })),
    );

    // Add client context awareness
    if (clientContext && clientContext.interactionCount > 0) {
      prompt += "\n\n── سياق العميل ──";
      if (clientContext.preferredCity)
        prompt += `\nالمدينة المفضلة: ${clientContext.preferredCity}`;
      if (clientContext.preferredPropertyType)
        prompt += `\nنوع العقار المفضل: ${clientContext.preferredPropertyType}`;
      if (clientContext.budgetMax)
        prompt += `\nالميزانية: حتى ${clientContext.budgetMax.toLocaleString()} ريال`;
      if (clientContext.bedrooms)
        prompt += `\nعدد الغرف: ${clientContext.bedrooms}`;
      prompt += `\nعدد التفاعلات السابقة: ${clientContext.interactionCount}`;
      if (clientContext.conversationSummary)
        prompt += `\nملخص المحادثة: ${clientContext.conversationSummary}`;
    }

    // Add knowledge-enriched properties
    const enrichedProps = properties.filter((p) => p.knowledge);
    if (enrichedProps.length > 0) {
      prompt += "\n\n── تحليل العقارات المتاحة ──";
      enrichedProps.forEach((p, i) => {
        prompt += `\n${i + 1}. ${p.title} (${p.city}): ${p.knowledge}`;
        if (p.matchReasons.length > 0)
          prompt += `\n   أسباب التوصية: ${p.matchReasons.join("، ")}`;
      });
    }

    // Add contextual reply template as guidance
    if (contextualReply) {
      prompt += `\n\n── قالب الرد المقترح ──\n${contextualReply}`;
      prompt +=
        "\n\nاستخدم هذا القالب كأساس لردك مع تحسينه بأسلوبك الخاص. قدّم رداً تحليلياً وليس مجرد قائمة.";
    }

    prompt +=
      "\n\nمهم: قدّم رداً تحليلياً مخصصاً، وليس مجرد قائمة عقارات. اربط التوصيات بمعايير العميل واحتياجاته.";

    return prompt;
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
