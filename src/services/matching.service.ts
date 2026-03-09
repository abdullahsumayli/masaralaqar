/**
 * Property Matching Service — نظام مطابقة العقارات مع طلب العميل
 *
 * عند وصول رسالة مثل: "أبغى شقة في الرياض بحدود 900 ألف"
 * يقوم النظام بتحليل: المدينة، نوع العقار، الميزانية
 * ثم يبحث في جدول properties الخاص بالمكتب
 * ويرسل أفضل 3 نتائج
 */

import {
    extractBedrooms,
    extractBudget,
    extractCity,
    extractPropertyType,
} from "@/lib/parser";
import { supabaseAdmin } from "@/lib/supabase";

interface MatchCriteria {
  city?: string;
  propertyType?: string;
  budget?: { min?: number; max?: number };
  bedrooms?: number;
}

interface MatchedProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  type: string;
  bedrooms: number;
  area: number;
  images: string[];
  relevanceScore: number;
}

export class MatchingService {
  /** Extract search criteria from natural language message (Arabic/English) */
  static extractCriteria(message: string): MatchCriteria {
    return {
      city: extractCity(message) || undefined,
      propertyType: extractPropertyType(message) || undefined,
      budget: extractBudget(message) || undefined,
      bedrooms: extractBedrooms(message) || undefined,
    };
  }

  /** Search and rank properties for an office based on criteria */
  static async matchProperties(
    officeId: string,
    criteria: MatchCriteria,
    limit: number = 3,
  ): Promise<MatchedProperty[]> {
    let query = supabaseAdmin
      .from("properties")
      .select("*")
      .eq("status", "available");

    // Filter by office (try office_id first, then tenant_id for backward compat)
    query = query.or(`office_id.eq.${officeId},tenant_id.eq.${officeId}`);

    // Apply filters
    if (criteria.city) {
      query = query.or(
        `city.ilike.%${criteria.city}%,location.ilike.%${criteria.city}%`,
      );
    }
    if (criteria.propertyType) {
      query = query.eq("type", criteria.propertyType);
    }
    if (criteria.budget?.max) {
      query = query.lte("price", criteria.budget.max * 1.15); // 15% tolerance
    }
    if (criteria.budget?.min) {
      query = query.gte("price", criteria.budget.min * 0.85);
    }
    if (criteria.bedrooms) {
      query = query.gte("bedrooms", criteria.bedrooms);
    }

    const { data, error } = await query.limit(20);
    if (error || !data || data.length === 0) {
      // Fallback: return any available properties for this office
      return this.getFallbackProperties(officeId, limit);
    }

    // Score and rank
    const scored = data.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description || "",
      price: Number(p.price),
      city: p.city || p.location || "",
      type: p.type || "",
      bedrooms: p.bedrooms || 0,
      area: Number(p.area) || 0,
      images: p.images || [],
      relevanceScore: this.scoreMatch(p, criteria),
    }));

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return scored.slice(0, limit);
  }

  /** Score how well a property matches the criteria (0–1) */
  private static scoreMatch(
    property: Record<string, unknown>,
    criteria: MatchCriteria,
  ): number {
    let score = 0;
    let weights = 0;

    // Type match (25%)
    if (criteria.propertyType) {
      weights += 25;
      if (property.type === criteria.propertyType) score += 25;
    }

    // Budget match (25%)
    if (criteria.budget?.max) {
      weights += 25;
      const price = Number(property.price);
      const maxBudget = criteria.budget.max;
      if (price <= maxBudget) {
        score += 25;
      } else if (price <= maxBudget * 1.15) {
        score += 15; // close enough
      }
    }

    // City match (25%)
    if (criteria.city) {
      weights += 25;
      const city = ((property.city as string) || "").toLowerCase();
      const location = ((property.location as string) || "").toLowerCase();
      const target = criteria.city.toLowerCase();
      if (city.includes(target) || location.includes(target)) score += 25;
    }

    // Bedrooms match (15%)
    if (criteria.bedrooms) {
      weights += 15;
      const beds = Number(property.bedrooms) || 0;
      if (beds >= criteria.bedrooms) score += 15;
      else if (beds === criteria.bedrooms - 1) score += 8;
    }

    // Has images bonus (10%)
    weights += 10;
    const images = property.images as unknown[];
    if (images && images.length > 0) score += 10;

    return weights > 0 ? score / weights : 0;
  }

  /** Fallback: return top properties when no specific match found */
  private static async getFallbackProperties(
    officeId: string,
    limit: number,
  ): Promise<MatchedProperty[]> {
    const { data } = await supabaseAdmin
      .from("properties")
      .select("*")
      .or(`office_id.eq.${officeId},tenant_id.eq.${officeId}`)
      .eq("status", "available")
      .order("views_count", { ascending: false })
      .limit(limit);

    if (!data) return [];
    return data.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description || "",
      price: Number(p.price),
      city: p.city || p.location || "",
      type: p.type || "",
      bedrooms: p.bedrooms || 0,
      area: Number(p.area) || 0,
      images: p.images || [],
      relevanceScore: 0.1,
    }));
  }

  /** Format matched properties for WhatsApp reply */
  static formatForWhatsApp(properties: MatchedProperty[]): string {
    if (properties.length === 0) {
      return "عذراً، لم أجد عقارات تطابق بحثك حالياً. يمكنك تعديل المعايير أو سأبحث لك عن بدائل.";
    }

    let msg = `🏠 وجدت لك ${properties.length} عقارات مناسبة:\n\n`;
    properties.forEach((p, i) => {
      msg += `${i + 1}. *${p.title}*\n`;
      msg += `   📍 ${p.city}\n`;
      msg += `   💰 ${p.price.toLocaleString()} ريال\n`;
      if (p.bedrooms) msg += `   🛏️ ${p.bedrooms} غرف\n`;
      if (p.area) msg += `   📐 ${p.area} م²\n`;
      msg += "\n";
    });
    msg += "هل تريد تفاصيل أكثر عن أحد هذه العقارات؟";
    return msg;
  }
}
