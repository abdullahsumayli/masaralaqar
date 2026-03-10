/**
 * Client Context Repository — طبقة الوصول لسياق العميل
 */

import { supabaseAdmin } from "@/lib/supabase";
import type {
    ClientAction,
    ClientActionType,
    ClientContext,
    ClientContextUpdate,
} from "@/types/client-context";

export class ClientContextRepository {
  private static format(row: Record<string, unknown>): ClientContext {
    return {
      id: row.id as string,
      officeId: row.office_id as string,
      phoneNumber: row.phone_number as string,
      preferredCity: (row.preferred_city as string) || null,
      preferredPropertyType: (row.preferred_property_type as string) || null,
      budgetMin: (row.budget_min as number) || null,
      budgetMax: (row.budget_max as number) || null,
      bedrooms: (row.bedrooms as number) || null,
      preferredAreaMin: (row.preferred_area_min as number) || null,
      preferredAreaMax: (row.preferred_area_max as number) || null,
      lifestyleTags: (row.lifestyle_tags as string[]) || [],
      conversationSummary: (row.conversation_summary as string) || "",
      interactionCount: (row.interaction_count as number) || 0,
      lastInteraction: row.last_interaction as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async getOrCreate(
    officeId: string,
    phoneNumber: string,
  ): Promise<ClientContext> {
    const { data: existing } = await supabaseAdmin
      .from("client_context")
      .select("*")
      .eq("office_id", officeId)
      .eq("phone_number", phoneNumber)
      .single();

    if (existing) return this.format(existing);

    const { data: created, error } = await supabaseAdmin
      .from("client_context")
      .insert({ office_id: officeId, phone_number: phoneNumber })
      .select()
      .single();

    if (error || !created) {
      // Return a minimal context if insert fails (e.g. table doesn't exist yet)
      return {
        id: "",
        officeId,
        phoneNumber,
        preferredCity: null,
        preferredPropertyType: null,
        budgetMin: null,
        budgetMax: null,
        bedrooms: null,
        preferredAreaMin: null,
        preferredAreaMax: null,
        lifestyleTags: [],
        conversationSummary: "",
        interactionCount: 0,
        lastInteraction: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return this.format(created);
  }

  static async update(
    officeId: string,
    phoneNumber: string,
    updates: ClientContextUpdate,
  ): Promise<ClientContext | null> {
    const dbUpdates: Record<string, unknown> = {
      last_interaction: new Date().toISOString(),
    };

    if (updates.preferredCity !== undefined)
      dbUpdates.preferred_city = updates.preferredCity;
    if (updates.preferredPropertyType !== undefined)
      dbUpdates.preferred_property_type = updates.preferredPropertyType;
    if (updates.budgetMin !== undefined)
      dbUpdates.budget_min = updates.budgetMin;
    if (updates.budgetMax !== undefined)
      dbUpdates.budget_max = updates.budgetMax;
    if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
    if (updates.preferredAreaMin !== undefined)
      dbUpdates.preferred_area_min = updates.preferredAreaMin;
    if (updates.preferredAreaMax !== undefined)
      dbUpdates.preferred_area_max = updates.preferredAreaMax;
    if (updates.lifestyleTags !== undefined)
      dbUpdates.lifestyle_tags = updates.lifestyleTags;
    if (updates.conversationSummary !== undefined)
      dbUpdates.conversation_summary = updates.conversationSummary;

    const { data, error } = await supabaseAdmin
      .from("client_context")
      .update(dbUpdates)
      .eq("office_id", officeId)
      .eq("phone_number", phoneNumber)
      .select()
      .single();

    if (error || !data) return null;
    return this.format(data);
  }

  /** Increment interaction count */
  static async incrementInteraction(
    officeId: string,
    phoneNumber: string,
  ): Promise<void> {
    const ctx = await this.getOrCreate(officeId, phoneNumber);
    await supabaseAdmin
      .from("client_context")
      .update({
        interaction_count: ctx.interactionCount + 1,
        last_interaction: new Date().toISOString(),
      })
      .eq("office_id", officeId)
      .eq("phone_number", phoneNumber);
  }
}

// ── Client Actions ──

export class ClientActionRepository {
  private static format(row: Record<string, unknown>): ClientAction {
    return {
      id: row.id as string,
      officeId: row.office_id as string,
      clientPhone: row.client_phone as string,
      propertyId: (row.property_id as string) || null,
      actionType: row.action_type as ClientActionType,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.created_at as string,
    };
  }

  static async log(
    officeId: string,
    clientPhone: string,
    actionType: ClientActionType,
    propertyId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await supabaseAdmin.from("client_actions").insert({
      office_id: officeId,
      client_phone: clientPhone,
      property_id: propertyId || null,
      action_type: actionType,
      metadata: metadata || {},
    });
  }

  /** Get actions for a specific client+office */
  static async getByClient(
    officeId: string,
    clientPhone: string,
    limit: number = 50,
  ): Promise<ClientAction[]> {
    const { data, error } = await supabaseAdmin
      .from("client_actions")
      .select("*")
      .eq("office_id", officeId)
      .eq("client_phone", clientPhone)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => this.format(row));
  }

  /** Get the most-interacted properties for an office */
  static async getTopProperties(
    officeId: string,
    actionType?: ClientActionType,
    limit: number = 10,
  ): Promise<{ propertyId: string; count: number }[]> {
    let query = supabaseAdmin
      .from("client_actions")
      .select("property_id")
      .eq("office_id", officeId)
      .not("property_id", "is", null);

    if (actionType) query = query.eq("action_type", actionType);

    const { data, error } = await query;
    if (error || !data) return [];

    // Count occurrences
    const counts = new Map<string, number>();
    for (const row of data) {
      const pid = row.property_id as string;
      counts.set(pid, (counts.get(pid) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([propertyId, count]) => ({ propertyId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /** Get conversion stats for an office */
  static async getConversionStats(
    officeId: string,
  ): Promise<{ total: number; visits: number; rate: number }> {
    const { data } = await supabaseAdmin
      .from("client_actions")
      .select("action_type")
      .eq("office_id", officeId);

    if (!data) return { total: 0, visits: 0, rate: 0 };

    const total = data.length;
    const visits = data.filter((r) => r.action_type === "visit").length;
    return { total, visits, rate: total > 0 ? (visits / total) * 100 : 0 };
  }

  /** Get recommendations shown count for an office */
  static async getRecommendationStats(
    officeId: string,
  ): Promise<{ shown: number; interested: number }> {
    const { data } = await supabaseAdmin
      .from("client_actions")
      .select("action_type")
      .eq("office_id", officeId)
      .in("action_type", ["recommendation_shown", "interest"]);

    if (!data) return { shown: 0, interested: 0 };

    const shown = data.filter(
      (r) => r.action_type === "recommendation_shown",
    ).length;
    const interested = data.filter((r) => r.action_type === "interest").length;
    return { shown, interested };
  }
}
