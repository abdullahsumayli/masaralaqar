/**
 * Lead Repository
 * Handles all lead database operations
 */

import { supabaseAdmin } from "@/lib/supabase";
import { Lead, LeadFilter, LeadUpdatePayload } from "@/types/lead";

export class LeadRepository {
  /**
   * Create a new lead
   */
  static async createLead(
    tenantId: string,
    leadData: Partial<Lead>,
  ): Promise<Lead | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .insert([
          {
            tenant_id: tenantId,
            ...leadData,
            source: leadData.source || "whatsapp",
            status: leadData.status || "new",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Lead creation error:", error);
        return null;
      }

      return data as Lead;
    } catch (error) {
      console.error("LeadRepository.createLead error:", error);
      return null;
    }
  }

  /**
   * Find lead by phone number
   */
  static async findLeadByPhone(
    tenantId: string,
    phone: string,
  ): Promise<Lead | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("phone", phone)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Lead fetch error:", error);
      }

      return (data as Lead) || null;
    } catch (error) {
      console.error("LeadRepository.findLeadByPhone error:", error);
      return null;
    }
  }

  /**
   * Update lead
   */
  static async updateLead(
    tenantId: string,
    leadId: string,
    updates: LeadUpdatePayload,
  ): Promise<Lead | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId)
        .eq("tenant_id", tenantId)
        .select()
        .single();

      if (error) {
        console.error("Lead update error:", error);
        return null;
      }

      return data as Lead;
    } catch (error) {
      console.error("LeadRepository.updateLead error:", error);
      return null;
    }
  }

  /**
   * Get all leads for tenant
   */
  static async getLeads(
    tenantId: string,
    filters?: LeadFilter,
  ): Promise<Lead[]> {
    try {
      let query = supabaseAdmin
        .from("leads")
        .select("*")
        .eq("tenant_id", tenantId);

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.source) {
        query = query.eq("source", filters.source);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Leads fetch error:", error);
        return [];
      }

      return (data as Lead[]) || [];
    } catch (error) {
      console.error("LeadRepository.getLeads error:", error);
      return [];
    }
  }

  /**
   * Get lead by ID
   */
  static async getLeadById(
    tenantId: string,
    leadId: string,
  ): Promise<Lead | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .eq("tenant_id", tenantId)
        .single();

      if (error) {
        console.error("Lead fetch error:", error);
        return null;
      }

      return data as Lead;
    } catch (error) {
      console.error("LeadRepository.getLeadById error:", error);
      return null;
    }
  }

  /**
   * Change lead status
   */
  static async changeLeadStatus(
    tenantId: string,
    leadId: string,
    status: string,
  ): Promise<Lead | null> {
    return this.updateLead(tenantId, leadId, { status: status as any });
  }
}
