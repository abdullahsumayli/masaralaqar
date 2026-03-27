/**
 * AI Service
 * Handles message analysis and property matching
 */

import { OpenAIService } from "@/integrations/openai";
import {
    detectIntent,
    extractArea,
    extractBedrooms,
    extractBudget,
    extractCity,
    extractPropertyType,
} from "@/lib/parser";
import { AIResponse, MessageAnalysis, MessageIntent, TenantContext } from "@/types/message";
import { Property } from "@/types/property";

export class AIService {
  /**
   * Analyze incoming message and extract structured data
   */
  static analyzeMessage(
    message: string,
    tenantContext: TenantContext,
  ): MessageAnalysis {
    const intent = detectIntent(message);
    const city = extractCity(message);
    const budget = extractBudget(message);
    const propertyType = extractPropertyType(message);
    const bedrooms = extractBedrooms(message);
    const area = extractArea(message);

    const extractedData: Record<string, any> = {};
    if (intent !== "general") extractedData.intent = intent;
    if (city) extractedData.city = city;
    if (budget) extractedData.budget = budget;
    if (propertyType) extractedData.propertyType = propertyType;
    if (bedrooms) extractedData.bedrooms = bedrooms;
    if (area) extractedData.area = area;

    // Calculate confidence score: 0.0 - 1.0
    let confidenceFactors = 0;
    let totalFactors = 5;

    if (intent !== "general") confidenceFactors++;
    if (city) confidenceFactors++;
    if (budget) confidenceFactors++;
    if (propertyType) confidenceFactors++;
    if (bedrooms || area) confidenceFactors++;

    const confidence = confidenceFactors / totalFactors;

    return {
      intent: intent as MessageIntent,
      extractedData,
      confidence,
    };
  }

  /**
   * Generate AI response using GPT-4o-mini
   */
  static async generateSmartReply(
    userMessage: string,
    matchedProperties: Property[],
    tenantContext: TenantContext,
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
  ): Promise<AIResponse> {
    try {
      // Use OpenAI for smart reply — pass full conversation history
      const reply = await OpenAIService.generateSmartReply(userMessage, {
        agentName: tenantContext.aiPersona?.agentName || "مساعد MQ",
        availableProperties: matchedProperties,
        conversationHistory,
      });

      // Return properties for image sending
      return {
        reply,
        suggestions: [],
        properties: matchedProperties.slice(0, 5).map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          location: p.location,
          city: p.city,
          type: p.type,
          bedrooms: p.bedrooms,
          image_url: p.image_url,
          images: p.images,
        })),
        shouldCreateLead: true,
        leadData: {},
      };
    } catch (error) {
      console.error("AIService.generateSmartReply error:", error);
      // Fallback to basic reply
      return this.generatePropertyReply(
        this.analyzeMessage(userMessage, tenantContext),
        matchedProperties,
        tenantContext,
      );
    }
  }

  /**
   * Get Arabic property type name
   */
  private static getPropertyTypeArabic(type: string): string {
    const types: Record<string, string> = {
      apartment: "شقة",
      villa: "فيلا",
      land: "أرض",
      commercial: "تجاري",
    };
    return types[type] || type;
  }

  /**
   * Format single property for WhatsApp
   */
  static formatPropertyMessage(prop: Property): string {
    const typeArabic = this.getPropertyTypeArabic(prop.type);
    let msg = `🏠 *${typeArabic} للبيع*\n`;
    msg += `📍 ${prop.city || prop.location}\n`;
    msg += `💰 ${prop.price?.toLocaleString()} ريال\n`;
    if (prop.bedrooms) msg += `🛏️ ${prop.bedrooms} غرف\n`;
    if (prop.bathrooms) msg += `🚿 ${prop.bathrooms} حمام\n`;
    if (prop.area) msg += `📐 ${prop.area} م²\n`;
    return msg;
  }

  /**
   * Generate AI response based on analysis and available properties (fallback)
   */
  static generatePropertyReply(
    analysis: MessageAnalysis,
    matchedProperties: Property[],
    tenantContext: TenantContext,
  ): AIResponse {
    const { intent, extractedData } = analysis;

    let reply = "";
    const suggestions: string[] = [];
    let shouldCreateLead = false;
    let leadData: Partial<any> = {};

    // Greeting response
    if (intent === "greeting") {
      reply =
        tenantContext.aiPersona?.welcomeMessage ||
        "السلام عليكم ورحمة الله وبركاته! أهلاً بك في MQ 🏠 كيف يمكنني مساعدتك؟";
      suggestions.push("ابحث عن عقار");
      suggestions.push("اعرض آخر العروض");
    }

    // Search response with improved formatting
    if (intent === "search" || intent === "inquire") {
      if (matchedProperties.length === 0) {
        reply = `للأسف لم أجد عقارات تطابق معايير بحثك. الرجاء تحديد المعايير بشكل أدق.`;
        suggestions.push("جرب تغيير الميزانية");
        suggestions.push("جرب نوع عقار آخر");
      } else {
        reply = `وجدت ${matchedProperties.length} عقار يناسب بحثك:\n\n`;
        matchedProperties.slice(0, 5).forEach((prop, idx) => {
          reply += this.formatPropertyMessage(prop);
          if (idx < Math.min(matchedProperties.length - 1, 4)) {
            reply += "\n---\n";
          }
        });
        suggestions.push("أرسل صور العقارات");
        suggestions.push("احجز موعد زيارة");
      }

      shouldCreateLead = true;
      leadData = {
        location_interest: extractedData.city || extractedData.location,
        budget: extractedData.budget?.max ?? extractedData.budget?.min,
        property_type_interest: extractedData.propertyType,
        message: `تم البحث عن: ${JSON.stringify(extractedData)}`,
      } as any;
    }

    // Contact/Schedule response
    if (intent === "schedule" || intent === "contact") {
      reply = "تم استلام طلبك. سيتواصل معك أحد فريقنا في أسرع وقت ممكن.";
      suggestions.push("شكراً");
      shouldCreateLead = true;
    }

    // Default response
    if (!reply) {
      reply = `فهمت طلبك: ${extractedData.intent || "لم أفهم بوضوح"}. كيف يمكنني مساعدتك بشكل أدق؟`;
      suggestions.push("ابحث عن عقار");
      suggestions.push("اتصل بنا");
    }

    return {
      reply,
      suggestions,
      properties: matchedProperties.slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        location: p.location,
        city: p.city,
        type: p.type,
        bedrooms: p.bedrooms,
        image_url: p.image_url,
        images: p.images,
      })),
      shouldCreateLead,
      leadData: shouldCreateLead ? leadData : undefined,
    };
  }

  /**
   * Score property match against search criteria
   * Returns 0-1 score
   */
  static scorePropertyMatch(
    property: Property,
    criteria: Record<string, any>,
  ): number {
    let score = 0;
    let maxScore = 0;

    // Type matching (25%)
    if (criteria.propertyType) {
      maxScore += 0.25;
      if (property.type === criteria.propertyType) {
        score += 0.25;
      }
    } else {
      maxScore += 0.25;
      score += 0.125; // Partial credit if no type specified
    }

    // Budget matching (25%)
    if (criteria.budget) {
      maxScore += 0.25;
      const { min = 0, max = Infinity } = criteria.budget;
      if (property.price >= min && property.price <= max) {
        score += 0.25;
      } else if (property.price >= min * 0.8 && property.price <= max * 1.2) {
        score += 0.125; // Partial credit if within 20%
      }
    } else {
      maxScore += 0.25;
      score += 0.125;
    }

    // Location matching (25%)
    if (criteria.city && property.location.includes(criteria.city)) {
      maxScore += 0.25;
      score += 0.25;
    } else {
      maxScore += 0.25;
      score += 0.05; // Low partial credit
    }

    // Bedrooms matching (15%)
    if (criteria.bedrooms) {
      maxScore += 0.15;
      if (property.bedrooms === criteria.bedrooms) {
        score += 0.15;
      } else if (property.bedrooms !== undefined && Math.abs(property.bedrooms - criteria.bedrooms) === 1) {
        score += 0.075; // Partial credit if ±1 bedroom
      }
    } else {
      maxScore += 0.15;
      score += 0.075;
    }

    // Area matching (10%)
    if (criteria.area) {
      maxScore += 0.1;
      const areaDiff = Math.abs(property.area - criteria.area) / criteria.area;
      if (areaDiff < 0.1) {
        score += 0.1; // Exact match
      } else if (areaDiff < 0.3) {
        score += 0.05; // Close match
      }
    } else {
      maxScore += 0.1;
      score += 0.05;
    }

    return maxScore > 0 ? score / maxScore : 0;
  }

  /**
   * Filter and rank properties by relevance
   */
  static rankProperties(
    properties: Property[],
    criteria: Record<string, any>,
  ): Array<Property & { relevanceScore: number }> {
    return properties
      .map((prop) => ({
        ...prop,
        relevanceScore: this.scorePropertyMatch(prop, criteria),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
