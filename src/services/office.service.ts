/**
 * Office Service — خدمة إدارة المكاتب
 */

import { supabaseAdmin } from "@/lib/supabase";
import { AIAgentRepository } from "@/repositories/ai-agent.repo";
import { OfficeRepository } from "@/repositories/office.repo";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import type {
    Office,
    OfficeCreateInput,
    OfficeUpdateInput,
    OfficeWithDetails,
} from "@/types/office";

export class OfficeService {
  /** Create a new office (AI agent + subscription auto-created by DB triggers) */
  static async createOffice(input: OfficeCreateInput): Promise<Office | null> {
    return OfficeRepository.create(input);
  }

  static async getOffice(id: string): Promise<Office | null> {
    return OfficeRepository.getById(id);
  }

  static async getOfficeWithDetails(
    id: string,
  ): Promise<OfficeWithDetails | null> {
    const office = await OfficeRepository.getById(id);
    if (!office) return null;

    const [
      aiAgent,
      subscription,
      whatsappSession,
      propertiesCount,
      leadsCount,
    ] = await Promise.all([
      AIAgentRepository.getByOfficeId(id),
      SubscriptionRepository.getByOfficeId(id),
      WhatsAppSessionRepository.getByOfficeId(id),
      supabaseAdmin
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("office_id", id),
      supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("office_id", id),
    ]);

    return {
      ...office,
      aiAgent,
      subscription: subscription ?? null,
      whatsappSession,
      plan: subscription?.plan ?? null,
      propertiesCount: propertiesCount.count ?? 0,
      leadsCount: leadsCount.count ?? 0,
    };
  }

  static async updateOffice(
    id: string,
    input: OfficeUpdateInput,
  ): Promise<Office | null> {
    return OfficeRepository.update(id, input);
  }

  static async getAllOffices(filters?: {
    city?: string;
    planId?: string;
  }): Promise<Office[]> {
    return OfficeRepository.getAll(filters);
  }

  /** Get office by user's office_id (from users table) */
  static async getOfficeByUserId(userId: string): Promise<Office | null> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("office_id")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[OfficeService] getOfficeByUserId query error:", error.message);
      return null;
    }

    if (!data?.office_id) return null;

    const office = await OfficeRepository.getById(data.office_id);
    if (!office) {
      console.error("[OfficeService] office_id exists but office not found:", data.office_id);
    }
    return office;
  }

  /** Link a user to an office */
  static async linkUserToOffice(
    userId: string,
    officeId: string,
  ): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("users")
      .update({ office_id: officeId })
      .eq("id", userId);

    if (error) {
      console.error("[OfficeService] linkUserToOffice error:", error.message);
    }
    return !error;
  }

  /**
   * Ensure user has an office — create one automatically if missing.
   * Resolves the "لم يتم إعداد مكتبك بعد" issue for new or orphaned users.
   */
  static async ensureUserOffice(userId: string): Promise<Office | null> {
    const existing = await this.getOfficeByUserId(userId);
    if (existing) return existing;

    // Fetch user info to name the office
    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("name, company, email, office_id")
      .eq("id", userId)
      .single();

    // If office_id is set but the office row is missing, clear the stale reference
    if (userRow?.office_id) {
      await supabaseAdmin
        .from("users")
        .update({ office_id: null })
        .eq("id", userId);
    }

    const officeName =
      userRow?.company?.trim() ||
      (userRow?.name ? `${userRow.name} - مكتب` : "مكتب جديد");

    const office = await OfficeRepository.create({
      officeName,
      email: userRow?.email || null,
    } as OfficeCreateInput);

    if (!office) {
      console.error("[OfficeService] ensureUserOffice: failed to create office for user", userId);
      return null;
    }

    const linked = await this.linkUserToOffice(userId, office.id);
    if (!linked) {
      console.error("[OfficeService] ensureUserOffice: failed to link office", office.id, "to user", userId);
    }

    console.log("[OfficeService] auto-created office", office.id, "for user", userId);
    return office;
  }

  /** Get platform-wide stats for admin */
  static async getPlatformStats(): Promise<{
    totalOffices: number;
    activeSubscriptions: number;
    totalProperties: number;
    totalLeads: number;
    connectedWhatsApp: number;
  }> {
    const [offices, activeSubs, properties, leads, whatsapp] =
      await Promise.all([
        supabaseAdmin
          .from("offices")
          .select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabaseAdmin
          .from("properties")
          .select("*", { count: "exact", head: true }),
        supabaseAdmin.from("leads").select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("whatsapp_sessions")
          .select("*", { count: "exact", head: true })
          .eq("session_status", "connected"),
      ]);

    return {
      totalOffices: offices.count ?? 0,
      activeSubscriptions: activeSubs.count ?? 0,
      totalProperties: properties.count ?? 0,
      totalLeads: leads.count ?? 0,
      connectedWhatsApp: whatsapp.count ?? 0,
    };
  }

  static async deleteOffice(id: string): Promise<boolean> {
    return OfficeRepository.delete(id);
  }
}
