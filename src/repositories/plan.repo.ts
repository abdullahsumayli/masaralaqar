/**
 * Plan Repository — طبقة الوصول لبيانات الباقات
 */

import { supabaseAdmin } from "@/lib/supabase";
import type { Plan, PlanCreateInput, PlanUpdateInput } from "@/types/plan";

export class PlanRepository {
  static formatPlan(row: Record<string, unknown>): Plan {
    return {
      id: row.id as string,
      name: row.name as string,
      nameAr: (row.name_ar as string) || "",
      maxProperties: (row.max_properties as number) ?? 10,
      maxAiMessages: (row.max_ai_messages as number) ?? 100,
      maxWhatsappMessages: (row.max_whatsapp_messages as number) ?? 500,
      price: Number(row.price) || 0,
      features: (row.features as string[]) || [],
      isActive: row.is_active !== false,
      sortOrder: (row.sort_order as number) || 0,
      createdAt: row.created_at as string,
    };
  }

  static async getAll(): Promise<Plan[]> {
    const { data, error } = await supabaseAdmin
      .from("plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map((row) => this.formatPlan(row));
  }

  static async getById(id: string): Promise<Plan | null> {
    const { data, error } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.formatPlan(data);
  }

  static async getByName(name: string): Promise<Plan | null> {
    const { data, error } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("name", name)
      .single();

    if (error || !data) return null;
    return this.formatPlan(data);
  }

  static async create(input: PlanCreateInput): Promise<Plan | null> {
    const { data, error } = await supabaseAdmin
      .from("plans")
      .insert({
        name: input.name,
        name_ar: input.nameAr || null,
        max_properties: input.maxProperties ?? 10,
        max_ai_messages: input.maxAiMessages ?? 100,
        max_whatsapp_messages: input.maxWhatsappMessages ?? 500,
        price: input.price ?? 0,
        features: input.features || [],
      })
      .select()
      .single();

    if (error || !data) return null;
    return this.formatPlan(data);
  }

  static async update(
    id: string,
    input: PlanUpdateInput,
  ): Promise<Plan | null> {
    const updates: Record<string, unknown> = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.nameAr !== undefined) updates.name_ar = input.nameAr;
    if (input.maxProperties !== undefined)
      updates.max_properties = input.maxProperties;
    if (input.maxAiMessages !== undefined)
      updates.max_ai_messages = input.maxAiMessages;
    if (input.maxWhatsappMessages !== undefined)
      updates.max_whatsapp_messages = input.maxWhatsappMessages;
    if (input.price !== undefined) updates.price = input.price;
    if (input.features !== undefined) updates.features = input.features;
    if (input.isActive !== undefined) updates.is_active = input.isActive;
    if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;

    const { data, error } = await supabaseAdmin
      .from("plans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return this.formatPlan(data);
  }

  static async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("plans").delete().eq("id", id);
    return !error;
  }
}
