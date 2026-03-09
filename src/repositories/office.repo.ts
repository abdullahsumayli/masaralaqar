/**
 * Office Repository — طبقة الوصول لبيانات المكاتب
 */

import { supabaseAdmin } from "@/lib/supabase";
import type {
    Office,
    OfficeCreateInput,
    OfficeUpdateInput,
} from "@/types/office";

export class OfficeRepository {
  static formatOffice(row: Record<string, unknown>): Office {
    return {
      id: row.id as string,
      officeName: row.office_name as string,
      ownerName: row.owner_name as string | null,
      email: row.email as string | null,
      phone: row.phone as string | null,
      city: row.city as string | null,
      planId: row.plan_id as string | null,
      legacyTenantId: row.legacy_tenant_id as string | null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async create(input: OfficeCreateInput): Promise<Office | null> {
    const { data, error } = await supabaseAdmin
      .from("offices")
      .insert({
        office_name: input.officeName,
        owner_name: input.ownerName || null,
        email: input.email || null,
        phone: input.phone || null,
        city: input.city || null,
        plan_id: input.planId || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating office:", error);
      return null;
    }
    return this.formatOffice(data);
  }

  static async getById(id: string): Promise<Office | null> {
    const { data, error } = await supabaseAdmin
      .from("offices")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.formatOffice(data);
  }

  static async getByEmail(email: string): Promise<Office | null> {
    const { data, error } = await supabaseAdmin
      .from("offices")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return null;
    return this.formatOffice(data);
  }

  static async getByPhone(phone: string): Promise<Office | null> {
    const { data, error } = await supabaseAdmin
      .from("offices")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !data) return null;
    return this.formatOffice(data);
  }

  static async update(
    id: string,
    input: OfficeUpdateInput,
  ): Promise<Office | null> {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (input.officeName !== undefined) updates.office_name = input.officeName;
    if (input.ownerName !== undefined) updates.owner_name = input.ownerName;
    if (input.email !== undefined) updates.email = input.email;
    if (input.phone !== undefined) updates.phone = input.phone;
    if (input.city !== undefined) updates.city = input.city;
    if (input.planId !== undefined) updates.plan_id = input.planId;

    const { data, error } = await supabaseAdmin
      .from("offices")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return this.formatOffice(data);
  }

  static async getAll(filters?: {
    city?: string;
    planId?: string;
  }): Promise<Office[]> {
    let query = supabaseAdmin
      .from("offices")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.city) query = query.eq("city", filters.city);
    if (filters?.planId) query = query.eq("plan_id", filters.planId);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((row) => this.formatOffice(row));
  }

  static async count(): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from("offices")
      .select("*", { count: "exact", head: true });

    return error ? 0 : (count ?? 0);
  }

  static async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("offices").delete().eq("id", id);
    return !error;
  }
}
