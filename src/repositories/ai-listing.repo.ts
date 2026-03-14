/**
 * AI Listing Repository — طبقة الوصول للإعلانات الذكية
 */

import { supabaseAdmin } from "@/lib/supabase";
import type { AIListing, AIListingInput } from "@/types/ai-listing";

export class AIListingRepository {
  private static format(row: Record<string, unknown>): AIListing {
    return {
      id: row.id as string,
      officeId: row.office_id as string,
      propertyId: row.property_id as string,
      title: row.title as string,
      marketingDescription: row.marketing_description as string,
      bulletFeatures: (row.bullet_features as string[]) || [],
      targetAudience: (row.target_audience as string[]) || [],
      seoKeywords: (row.seo_keywords as string[]) || [],
      adCopyShort: (row.ad_copy_short as string) || "",
      imageAnalysis: (row.image_analysis as AIListing["imageAnalysis"]) || {},
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async getByPropertyId(propertyId: string): Promise<AIListing | null> {
    const { data, error } = await supabaseAdmin
      .from("ai_listings")
      .select("*")
      .eq("property_id", propertyId)
      .single();

    if (error || !data) return null;
    return this.format(data);
  }

  static async getByOfficeId(
    officeId: string,
    limit = 50,
  ): Promise<AIListing[]> {
    const { data, error } = await supabaseAdmin
      .from("ai_listings")
      .select("*")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => this.format(row));
  }

  static async upsert(input: AIListingInput): Promise<AIListing | null> {
    const { data, error } = await supabaseAdmin
      .from("ai_listings")
      .upsert(
        {
          office_id: input.officeId,
          property_id: input.propertyId,
          title: input.title,
          marketing_description: input.marketingDescription,
          bullet_features: input.bulletFeatures,
          target_audience: input.targetAudience,
          seo_keywords: input.seoKeywords,
          ad_copy_short: input.adCopyShort,
          image_analysis: input.imageAnalysis || {},
        },
        { onConflict: "property_id" },
      )
      .select()
      .single();

    if (error || !data) {
      console.error("[AIListingRepo] upsert error:", error);
      return null;
    }
    return this.format(data);
  }

  static async delete(propertyId: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("ai_listings")
      .delete()
      .eq("property_id", propertyId);

    return !error;
  }
}
