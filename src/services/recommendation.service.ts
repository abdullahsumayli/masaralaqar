/**
 * Recommendation Engine — محرك التوصيات الذكي
 *
 * خط السير:
 * 1. تحليل رسالة العميل (NLP)
 * 2. قراءة سياق العميل من client_context
 * 3. قراءة property_knowledge
 * 4. ترتيب العقارات بمعايير متعددة
 * 5. تعلم من سلوك العملاء (client_actions)
 * 6. إرجاع أفضل 3 عقارات مع وصف تحليلي
 */

import {
  ClientActionRepository,
  ClientContextRepository,
} from "@/repositories/client-context.repo";
import { PropertyKnowledgeRepository } from "@/repositories/property-knowledge.repo";
import { supabaseAdmin } from "@/lib/supabase";
import {
  extractBedrooms,
  extractBudget,
  extractCity,
  extractPropertyType,
} from "@/lib/parser";
import type { ClientContext } from "@/types/client-context";
import type { PropertyKnowledge } from "@/types/property-knowledge";
import { PropertyKnowledgeService } from "./property-knowledge.service";

interface RecommendationRequest {
  officeId: string;
  clientPhone: string;
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

interface ScoredProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  location: string;
  type: string;
  bedrooms: number;
  area: number;
  images: string[];
  score: number;
  knowledge: PropertyKnowledge | null;
  matchReasons: string[];
}

export interface RecommendationResult {
  properties: ScoredProperty[];
  clientContext: ClientContext;
  analysisText: string;
  contextualReply: string;
}

export class RecommendationEngine {
  /**
   * Main entry: analyze message + context → ranked recommendations + analytical reply
   */
  static async recommend(
    req: RecommendationRequest,
  ): Promise<RecommendationResult> {
    // ── Step 1: Extract intent from current message ──
    const extracted = {
      city: extractCity(req.message) || undefined,
      propertyType: extractPropertyType(req.message) || undefined,
      budget: extractBudget(req.message) || undefined,
      bedrooms: extractBedrooms(req.message) || undefined,
    };

    // ── Step 2: Load client context (creates if first time) ──
    const ctx = await ClientContextRepository.getOrCreate(
      req.officeId,
      req.clientPhone,
    );

    // ── Step 3: Merge current message extraction with stored context ──
    const merged = this.mergeContext(ctx, extracted);

    // Update stored context with new info
    await this.updateClientContext(req.officeId, req.clientPhone, extracted);

    // Increment interaction count
    await ClientContextRepository.incrementInteraction(
      req.officeId,
      req.clientPhone,
    );

    // ── Step 4: Search properties ──
    const candidates = await this.searchCandidates(req.officeId, merged);

    // ── Step 5: Load knowledge for candidates ──
    const propertyIds = candidates.map((c) => c.id);
    const knowledgeMap =
      await PropertyKnowledgeService.getKnowledgeBatch(propertyIds);

    // ── Step 6: Load client action history for personalization ──
    const actions = await ClientActionRepository.getByClient(
      req.officeId,
      req.clientPhone,
      30,
    );
    const rejectedIds = new Set(
      actions
        .filter((a) => a.actionType === "reject")
        .map((a) => a.propertyId)
        .filter(Boolean),
    );
    const interestedIds = new Set(
      actions
        .filter((a) => a.actionType === "interest")
        .map((a) => a.propertyId)
        .filter(Boolean),
    );

    // ── Step 7: Score and rank ──
    const scored = candidates
      .filter((c) => !rejectedIds.has(c.id)) // Exclude rejected properties
      .map((property) => {
        const knowledge = knowledgeMap.get(property.id) || null;
        const { score, reasons } = this.scoreProperty(
          property,
          merged,
          knowledge,
          interestedIds,
        );
        return {
          id: property.id,
          title: property.title,
          description: property.description || "",
          price: Number(property.price),
          city: property.city || property.location || "",
          location: property.location || "",
          type: property.type || "",
          bedrooms: property.bedrooms || 0,
          area: Number(property.area) || 0,
          images: property.images || [],
          score,
          knowledge,
          matchReasons: reasons,
        };
      });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3);

    // ── Step 8: Log recommendations shown ──
    for (const prop of top) {
      await ClientActionRepository.log(
        req.officeId,
        req.clientPhone,
        "recommendation_shown",
        prop.id,
      );
    }

    // ── Step 9: Build analytical reply text ──
    const analysisText = this.buildAnalysis(merged);
    const contextualReply = this.buildContextualReply(top, merged, ctx);

    return {
      properties: top,
      clientContext: ctx,
      analysisText,
      contextualReply,
    };
  }

  // ── Merge current extraction with stored context ──

  private static mergeContext(
    ctx: ClientContext,
    extracted: {
      city?: string;
      propertyType?: string;
      budget?: { min?: number; max?: number };
      bedrooms?: number;
    },
  ): MergedCriteria {
    return {
      city: extracted.city || ctx.preferredCity || undefined,
      propertyType:
        extracted.propertyType || ctx.preferredPropertyType || undefined,
      budgetMin: extracted.budget?.min || ctx.budgetMin || undefined,
      budgetMax: extracted.budget?.max || ctx.budgetMax || undefined,
      bedrooms: extracted.bedrooms || ctx.bedrooms || undefined,
    };
  }

  // ── Update client context with new data from message ──

  private static async updateClientContext(
    officeId: string,
    phone: string,
    extracted: {
      city?: string;
      propertyType?: string;
      budget?: { min?: number; max?: number };
      bedrooms?: number;
    },
  ): Promise<void> {
    const updates: Record<string, unknown> = {};
    if (extracted.city) updates.preferredCity = extracted.city;
    if (extracted.propertyType)
      updates.preferredPropertyType = extracted.propertyType;
    if (extracted.budget?.min) updates.budgetMin = extracted.budget.min;
    if (extracted.budget?.max) updates.budgetMax = extracted.budget.max;
    if (extracted.bedrooms) updates.bedrooms = extracted.bedrooms;

    if (Object.keys(updates).length > 0) {
      await ClientContextRepository.update(officeId, phone, updates);
    }
  }

  // ── Search candidate properties from the database ──

  private static async searchCandidates(
    officeId: string,
    criteria: MergedCriteria,
  ): Promise<Record<string, unknown>[]> {
    let query = supabaseAdmin
      .from("properties")
      .select("*")
      .eq("status", "available")
      .or(`office_id.eq.${officeId},tenant_id.eq.${officeId}`);

    if (criteria.city) {
      query = query.or(
        `city.ilike.%${criteria.city}%,location.ilike.%${criteria.city}%`,
      );
    }
    if (criteria.propertyType) {
      query = query.eq("type", criteria.propertyType);
    }
    if (criteria.budgetMax) {
      query = query.lte("price", criteria.budgetMax * 1.2);
    }
    if (criteria.budgetMin) {
      query = query.gte("price", criteria.budgetMin * 0.8);
    }
    if (criteria.bedrooms) {
      query = query.gte("bedrooms", criteria.bedrooms);
    }

    const { data } = await query.limit(30);

    if (!data || data.length === 0) {
      // Fallback: any available properties for this office
      const { data: fallback } = await supabaseAdmin
        .from("properties")
        .select("*")
        .eq("status", "available")
        .or(`office_id.eq.${officeId},tenant_id.eq.${officeId}`)
        .order("views_count", { ascending: false })
        .limit(10);
      return (fallback as Record<string, unknown>[]) || [];
    }

    return data as Record<string, unknown>[];
  }

  // ── Score a single property against merged criteria + knowledge ──

  private static scoreProperty(
    property: Record<string, unknown>,
    criteria: MergedCriteria,
    knowledge: PropertyKnowledge | null,
    interestedIds: Set<string | null>,
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // City match (25 pts)
    if (criteria.city) {
      const city = ((property.city as string) || "").toLowerCase();
      const loc = ((property.location as string) || "").toLowerCase();
      const target = criteria.city.toLowerCase();
      if (city.includes(target) || loc.includes(target)) {
        score += 25;
        reasons.push("المدينة مطابقة");
      }
    }

    // Budget match (25 pts)
    if (criteria.budgetMax) {
      const price = Number(property.price);
      if (price <= criteria.budgetMax) {
        score += 25;
        reasons.push("ضمن الميزانية");
      } else if (price <= criteria.budgetMax * 1.15) {
        score += 15;
        reasons.push("قريب من الميزانية");
      }
    }

    // Type match (20 pts)
    if (criteria.propertyType) {
      if (property.type === criteria.propertyType) {
        score += 20;
        reasons.push("نوع العقار مطابق");
      }
    }

    // Bedrooms match (10 pts)
    if (criteria.bedrooms) {
      const beds = Number(property.bedrooms) || 0;
      if (beds >= criteria.bedrooms) {
        score += 10;
        reasons.push(`${beds} غرف`);
      } else if (beds === criteria.bedrooms - 1) {
        score += 5;
      }
    }

    // Knowledge-based scoring (15 pts)
    if (knowledge) {
      // Family-friendly bonus
      if (knowledge.familyScore >= 70) {
        score += 5;
        reasons.push("مناسب للعائلات");
      }
      // Investment quality bonus
      if (knowledge.investmentScore >= 70) {
        score += 5;
        reasons.push("فرصة استثمارية");
      }
      // Has advantages
      if (knowledge.advantages.length > 0) {
        score += 5;
      }
    }

    // Behavioral boost: previously interested (5 pts)
    if (interestedIds.has(property.id as string)) {
      score += 5;
      reasons.push("أبديت اهتماماً سابقاً");
    }

    // Has images bonus
    const images = property.images as unknown[];
    if (images && images.length > 0) score += 3;

    return { score, reasons };
  }

  // ── Build analysis text about what the engine understood ──

  private static buildAnalysis(criteria: MergedCriteria): string {
    const parts: string[] = [];
    if (criteria.city) parts.push(`المدينة: ${criteria.city}`);
    if (criteria.propertyType) {
      const typeMap: Record<string, string> = {
        apartment: "شقة",
        villa: "فيلا",
        land: "أرض",
        commercial: "تجاري",
      };
      parts.push(`النوع: ${typeMap[criteria.propertyType] || criteria.propertyType}`);
    }
    if (criteria.budgetMax)
      parts.push(`الميزانية: حتى ${criteria.budgetMax.toLocaleString()} ريال`);
    if (criteria.bedrooms) parts.push(`الغرف: ${criteria.bedrooms}+`);

    if (parts.length === 0) return "لم يتم تحديد معايير بحث محددة.";
    return `معايير البحث: ${parts.join(" | ")}`;
  }

  // ── Build the analytical contextual reply (not just a list) ──

  private static buildContextualReply(
    properties: ScoredProperty[],
    criteria: MergedCriteria,
    ctx: ClientContext,
  ): string {
    if (properties.length === 0) {
      return "عذراً، لم أجد عقارات تطابق معاييرك حالياً. يمكنك تعديل الميزانية أو المدينة وسأبحث لك مجدداً.";
    }

    // Build personalized intro
    let intro = "";
    if (criteria.budgetMax && criteria.city) {
      const typeLabel = criteria.propertyType
        ? criteria.propertyType === "apartment"
          ? "شقة"
          : criteria.propertyType === "villa"
            ? "فيلا"
            : criteria.propertyType
        : "عقار";
      intro = `بناءً على ميزانيتك (${criteria.budgetMax.toLocaleString()} ريال) ورغبتك في ${typeLabel} في ${criteria.city}، أنسب الخيارات حالياً هي:\n\n`;
    } else if (criteria.city) {
      intro = `بناءً على بحثك في ${criteria.city}، وجدت لك الخيارات التالية:\n\n`;
    } else if (ctx.interactionCount > 1) {
      intro = `بناءً على تفضيلاتك السابقة، إليك أفضل الخيارات:\n\n`;
    } else {
      intro = `وجدت لك ${properties.length} خيارات مميزة:\n\n`;
    }

    // Build property descriptions
    let body = "";
    properties.forEach((p, i) => {
      body += `${i + 1}. *${p.title}*\n`;
      body += `   📍 ${p.city}${p.location && p.location !== p.city ? " - " + p.location : ""}\n`;
      body += `   💰 ${p.price.toLocaleString()} ريال\n`;
      if (p.bedrooms) body += `   🛏️ ${p.bedrooms} غرف`;
      if (p.area) body += ` | 📐 ${p.area} م²`;
      body += "\n";

      // Add knowledge-based insights
      if (p.knowledge) {
        const insights: string[] = [];
        if (p.knowledge.familyScore >= 70) insights.push("مناسب للعائلات");
        if (p.knowledge.investmentScore >= 70) insights.push("فرصة استثمارية");
        if (p.knowledge.locationSummary)
          insights.push(p.knowledge.locationSummary);
        if (insights.length > 0) {
          body += `   ✨ ${insights.join(" • ")}\n`;
        }
      }

      // Add match reasons
      if (p.matchReasons.length > 0) {
        body += `   ✅ ${p.matchReasons.slice(0, 3).join(" | ")}\n`;
      }

      body += "\n";
    });

    const closing = "هل تفضل حجز معاينة لأحد هذه الخيارات؟ أو يمكنني البحث بمعايير مختلفة.";

    return intro + body + closing;
  }
}

// ── Internal type ──

interface MergedCriteria {
  city?: string;
  propertyType?: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  bedrooms?: number | null;
}
