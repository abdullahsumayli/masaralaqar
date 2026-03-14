/**
 * Subscription Repository — طبقة الوصول لبيانات الاشتراكات
 */

import { supabaseAdmin } from "@/lib/supabase";
import type { Subscription, SubscriptionWithPlan } from "@/types/subscription";
import { PlanRepository } from "./plan.repo";

export class SubscriptionRepository {
  static formatSubscription(row: Record<string, unknown>): Subscription {
    return {
      id: row.id as string,
      officeId: row.office_id as string,
      planId: row.plan_id as string,
      status: (row.status as Subscription["status"]) || "trial",
      startDate: row.start_date as string,
      endDate: row.end_date as string | null,
      aiMessagesUsed: (row.ai_messages_used as number) || 0,
      whatsappMessagesUsed: (row.whatsapp_messages_used as number) || 0,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async getByOfficeId(
    officeId: string,
  ): Promise<SubscriptionWithPlan | null> {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    const sub = this.formatSubscription(data);
    const plan = await PlanRepository.getById(sub.planId);
    return { ...sub, plan: plan ?? undefined };
  }

  static async create(
    officeId: string,
    planId: string,
    status: Subscription["status"] = "trial",
    endDate?: string,
  ): Promise<Subscription | null> {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        office_id: officeId,
        plan_id: planId,
        status,
        start_date: new Date().toISOString(),
        end_date: endDate || null,
      })
      .select()
      .single();

    if (error || !data) return null;
    return this.formatSubscription(data);
  }

  static async updateStatus(
    id: string,
    status: Subscription["status"],
  ): Promise<Subscription | null> {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return this.formatSubscription(data);
  }

  static async incrementUsage(
    officeId: string,
    type: "ai_message" | "whatsapp_message",
  ): Promise<boolean> {
    const sub = await this.getByOfficeId(officeId);
    if (!sub) return false;

    const field =
      type === "ai_message" ? "ai_messages_used" : "whatsapp_messages_used";
    const currentVal =
      type === "ai_message" ? sub.aiMessagesUsed : sub.whatsappMessagesUsed;

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({ [field]: currentVal + 1, updated_at: new Date().toISOString() })
      .eq("id", sub.id);

    if (error) return false;

    // Log usage
    await supabaseAdmin.from("usage_logs").insert({
      office_id: officeId,
      type,
    });

    return true;
  }

  static async checkLimit(
    officeId: string,
    type: "ai_message" | "whatsapp_message" | "property",
  ): Promise<{ allowed: boolean; used: number; limit: number }> {
    const sub = await this.getByOfficeId(officeId);
    if (!sub || !sub.plan) return { allowed: false, used: 0, limit: 0 };

    if (sub.status !== "active" && sub.status !== "trial") {
      return { allowed: false, used: 0, limit: 0 };
    }

    let used = 0;
    let limit = 0;

    switch (type) {
      case "ai_message":
        used = sub.aiMessagesUsed;
        limit = sub.plan.maxAiMessages;
        break;
      case "whatsapp_message":
        used = sub.whatsappMessagesUsed;
        limit = sub.plan.maxWhatsappMessages;
        break;
      case "property": {
        const { count } = await supabaseAdmin
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("office_id", officeId);
        used = count ?? 0;
        limit = sub.plan.maxProperties;
        break;
      }
    }

    // -1 means unlimited
    const allowed = limit === -1 || used < limit;
    return { allowed, used, limit };
  }

  static async getAll(filters?: { status?: string }): Promise<Subscription[]> {
    let query = supabaseAdmin
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((row) => this.formatSubscription(row));
  }
}
