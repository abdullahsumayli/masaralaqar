/**
 * Tenant Repository
 * Handles all tenant database operations
 */

import { supabaseAdmin } from "@/lib/supabase";
import { Tenant } from "@/types/tenant";

export class TenantRepository {
  /**
   * Get tenant by ID
   */
  static async getTenantById(tenantId: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("tenants")
        .select("*")
        .eq("id", tenantId)
        .single();

      if (error) {
        console.error("Tenant fetch error:", error);
        return null;
      }

      return this.formatTenant(data);
    } catch (error) {
      console.error("TenantRepository.getTenantById error:", error);
      return null;
    }
  }

  /**
   * Get tenant by WhatsApp number
   */
  static async getTenantByPhone(phone: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("tenants")
        .select("*")
        .eq("whatsapp_number", phone)
        .single();

      if (error) {
        console.error("Tenant fetch by phone error:", error);
        return null;
      }

      return this.formatTenant(data);
    } catch (error) {
      console.error("TenantRepository.getTenantByPhone error:", error);
      return null;
    }
  }

  /**
   * Get tenant by webhook secret
   */
  static async getTenantByWebhook(secret: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("tenants")
        .select("*")
        .eq("webhook_secret", secret)
        .single();

      if (error) {
        console.error("Tenant fetch by webhook error:", error);
        return null;
      }

      return this.formatTenant(data);
    } catch (error) {
      console.error("TenantRepository.getTenantByWebhook error:", error);
      return null;
    }
  }

  /**
   * Update tenant configuration
   */
  static async updateTenant(
    tenantId: string,
    updates: Partial<Tenant>,
  ): Promise<Tenant | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("tenants")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tenantId)
        .select()
        .single();

      if (error) {
        console.error("Tenant update error:", error);
        return null;
      }

      return this.formatTenant(data);
    } catch (error) {
      console.error("TenantRepository.updateTenant error:", error);
      return null;
    }
  }

  /**
   * Format raw database record to Tenant interface
   */
  private static formatTenant(data: any): Tenant {
    return {
      id: data.id,
      name: data.name,
      officeName: data.office_name,
      whatsappNumber: data.whatsapp_number,
      webhookSecret: data.webhook_secret,
      aiPersona: data.ai_persona,
      openaiApiKey: data.openai_api_key,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
