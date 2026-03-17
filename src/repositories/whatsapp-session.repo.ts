/**
 * WhatsApp Session Repository — طبقة الوصول لجلسات الواتساب
 */

import { supabaseAdmin } from "@/lib/supabase";
import type {
  WhatsAppSession,
  WhatsAppSessionCreateInput,
} from "@/types/whatsapp-session";

export class WhatsAppSessionRepository {
  static formatSession(row: Record<string, unknown>): WhatsAppSession {
    return {
      id: row.id as string,
      officeId: row.office_id as string,
      phoneNumber: row.phone_number as string,
      sessionStatus:
        (row.session_status as WhatsAppSession["sessionStatus"]) ||
        "disconnected",
      instanceId: row.instance_id as string | null,
      apiToken: row.api_token as string | null,
      webhookUrl: row.webhook_url as string | null,
      lastConnectedAt: row.last_connected_at as string | null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async getByOfficeId(
    officeId: string,
  ): Promise<WhatsAppSession | null> {
    const { data, error } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("*")
      .eq("office_id", officeId)
      .single();

    if (error || !data) return null;
    return this.formatSession(data);
  }

  /**
   * Get session by instance_id.
   * Prefers connected sessions, but falls back to pending/disconnected
   * so connection.update events can actually mark them as connected.
   */
  static async getByInstanceId(
    instanceId: string,
  ): Promise<WhatsAppSession | null> {
    // Try connected first (most common for message routing)
    const { data: connected } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("*")
      .eq("instance_id", instanceId)
      .eq("session_status", "connected")
      .order("last_connected_at", { ascending: false })
      .limit(1)
      .single();

    if (connected) return this.formatSession(connected);

    // Fallback: any session with this instance_id (pending, disconnected)
    // Critical for connection.update events to work
    const { data: anySession } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("*")
      .eq("instance_id", instanceId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (anySession) return this.formatSession(anySession);

    return null;
  }

  /** Alias — kept for backward compatibility */
  static async getByInstanceIdAny(
    instanceId: string,
  ): Promise<WhatsAppSession | null> {
    return this.getByInstanceId(instanceId);
  }

  static async getByPhone(phone: string): Promise<WhatsAppSession | null> {
    const { data, error } = await supabaseAdmin
      .from("whatsapp_sessions")
      .select("*")
      .eq("phone_number", phone)
      .single();

    if (error || !data) return null;
    return this.formatSession(data);
  }

  static async create(
    input: WhatsAppSessionCreateInput,
  ): Promise<WhatsAppSession | null> {
    // Try upserting on office_id first (one session per office)
    const { data, error } = await supabaseAdmin
      .from("whatsapp_sessions")
      .upsert(
        {
          office_id: input.officeId,
          phone_number: input.phoneNumber,
          instance_id: input.instanceId || null,
          api_token: input.apiToken || null,
          session_status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "office_id" },
      )
      .select()
      .single();

    if (error) {
      // Fallback: try with phone_number conflict
      const { data: fallbackData, error: fallbackError } = await supabaseAdmin
        .from("whatsapp_sessions")
        .upsert(
          {
            office_id: input.officeId,
            phone_number: input.phoneNumber,
            instance_id: input.instanceId || null,
            api_token: input.apiToken || null,
            session_status: "pending",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "phone_number" },
        )
        .select()
        .single();

      if (fallbackError || !fallbackData) {
        console.error("[WhatsAppSession] create failed:", error, fallbackError);
        return null;
      }
      return this.formatSession(fallbackData);
    }

    return this.formatSession(data);
  }

  static async updateStatus(
    id: string,
    status: WhatsAppSession["sessionStatus"],
  ): Promise<WhatsAppSession | null> {
    const updates: Record<string, unknown> = {
      session_status: status,
      updated_at: new Date().toISOString(),
    };
    if (status === "connected") {
      updates.last_connected_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("whatsapp_sessions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return this.formatSession(data);
  }

  static async getAll(filters?: {
    status?: string;
  }): Promise<WhatsAppSession[]> {
    let query = supabaseAdmin
      .from("whatsapp_sessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (filters?.status) query = query.eq("session_status", filters.status);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((row) => this.formatSession(row));
  }

  static async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("whatsapp_sessions")
      .delete()
      .eq("id", id);
    return !error;
  }
}
