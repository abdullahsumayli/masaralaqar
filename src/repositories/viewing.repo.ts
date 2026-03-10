/**
 * Viewing Repository — طبقة الوصول لطلبات المعاينة
 */

import { supabaseAdmin } from "@/lib/supabase";
import type {
    ViewingRequest,
    ViewingRequestInput,
    ViewingStatus,
} from "@/types/viewing";

export class ViewingRepository {
  private static format(row: Record<string, unknown>): ViewingRequest {
    return {
      id: row.id as string,
      officeId: row.office_id as string,
      propertyId: row.property_id as string,
      clientPhone: row.client_phone as string,
      clientName: (row.client_name as string) || "",
      preferredDate: (row.preferred_date as string) || null,
      status: (row.status as ViewingStatus) || "pending",
      notes: (row.notes as string) || "",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async createViewingRequest(
    input: ViewingRequestInput,
  ): Promise<ViewingRequest | null> {
    const { data, error } = await supabaseAdmin
      .from("viewing_requests")
      .insert({
        office_id: input.officeId,
        property_id: input.propertyId,
        client_phone: input.clientPhone,
        client_name: input.clientName || "",
        preferred_date: input.preferredDate || null,
        notes: input.notes || "",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("[ViewingRepo] create error:", error);
      return null;
    }
    return this.format(data);
  }

  static async getOfficeViewings(
    officeId: string,
    status?: ViewingStatus,
  ): Promise<ViewingRequest[]> {
    let query = supabaseAdmin
      .from("viewing_requests")
      .select("*")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.limit(100);

    if (error || !data) return [];
    return data.map((row) => this.format(row));
  }

  static async updateViewingStatus(
    id: string,
    status: ViewingStatus,
    notes?: string,
  ): Promise<ViewingRequest | null> {
    const updateData: Record<string, unknown> = { status };
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabaseAdmin
      .from("viewing_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[ViewingRepo] update error:", error);
      return null;
    }
    return this.format(data);
  }
}
