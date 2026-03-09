/**
 * Property Knowledge Repository — طبقة الوصول للمعرفة العقارية
 */

import { supabaseAdmin } from "@/lib/supabase";
import type {
  PropertyKnowledge,
  PropertyKnowledgeInput,
} from "@/types/property-knowledge";

export class PropertyKnowledgeRepository {
  private static format(row: Record<string, unknown>): PropertyKnowledge {
    return {
      id: row.id as string,
      propertyId: row.property_id as string,
      familyScore: (row.family_score as number) || 0,
      investmentScore: (row.investment_score as number) || 0,
      luxuryScore: (row.luxury_score as number) || 0,
      locationSummary: (row.location_summary as string) || "",
      advantages: (row.advantages as string[]) || [],
      targetAudience: (row.target_audience as string[]) || [],
      nearbyFacilities: (row.nearby_facilities as string[]) || [],
      aiDescription: (row.ai_description as string) || "",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async getByPropertyId(
    propertyId: string,
  ): Promise<PropertyKnowledge | null> {
    const { data, error } = await supabaseAdmin
      .from("property_knowledge")
      .select("*")
      .eq("property_id", propertyId)
      .single();

    if (error || !data) return null;
    return this.format(data);
  }

  static async upsert(
    input: PropertyKnowledgeInput,
  ): Promise<PropertyKnowledge | null> {
    const { data, error } = await supabaseAdmin
      .from("property_knowledge")
      .upsert(
        {
          property_id: input.propertyId,
          family_score: input.familyScore,
          investment_score: input.investmentScore,
          luxury_score: input.luxuryScore,
          location_summary: input.locationSummary,
          advantages: input.advantages,
          target_audience: input.targetAudience || [],
          nearby_facilities: input.nearbyFacilities || [],
          ai_description: input.aiDescription || "",
        },
        { onConflict: "property_id" },
      )
      .select()
      .single();

    if (error || !data) return null;
    return this.format(data);
  }

  static async getByPropertyIds(
    propertyIds: string[],
  ): Promise<PropertyKnowledge[]> {
    if (propertyIds.length === 0) return [];
    const { data, error } = await supabaseAdmin
      .from("property_knowledge")
      .select("*")
      .in("property_id", propertyIds);

    if (error || !data) return [];
    return data.map((row) => this.format(row));
  }

  static async getTopByScore(
    officeId: string,
    scoreType: "family_score" | "investment_score" | "luxury_score",
    limit: number = 5,
  ): Promise<PropertyKnowledge[]> {
    const { data, error } = await supabaseAdmin
      .from("property_knowledge")
      .select("*, properties!inner(office_id, tenant_id)")
      .or(
        `properties.office_id.eq.${officeId},properties.tenant_id.eq.${officeId}`,
      )
      .order(scoreType, { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => this.format(row));
  }
}
