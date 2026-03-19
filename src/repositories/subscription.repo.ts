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
      messageLimit: (row.message_limit as number) ?? null,
      overageMessages: (row.overage_messages as number) || 0,
      overageAmountSar: Number(row.overage_amount_sar) || 0,
      billingCycleStart: (row.billing_cycle_start as string) ?? null,
      billingCycleEnd: (row.billing_cycle_end as string) ?? null,
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
    const newVal = currentVal + 1;

    const limit =
      sub.messageLimit ?? sub.plan?.maxAiMessages ?? 300;
    const pricePerMessage = sub.plan?.overagePricePerMessage ?? 0.5;

    let overageMessages = sub.overageMessages;
    let overageAmountSar = sub.overageAmountSar;

    if (
      type === "ai_message" &&
      limit > 0 &&
      newVal > limit
    ) {
      overageMessages += 1;
      overageAmountSar += pricePerMessage;
    }

    const updates: Record<string, unknown> = {
      [field]: newVal,
      overage_messages: overageMessages,
      overage_amount_sar: overageAmountSar,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update(updates)
      .eq("id", sub.id);

    if (error) return false;

    await supabaseAdmin.from("usage_logs").insert({
      office_id: officeId,
      type: type === "ai_message" ? "ai_response" : type,
      count: 1,
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
        limit =
          sub.messageLimit ??
          sub.plan.maxAiMessages ??
          300;
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

  /**
   * Reset billing cycle: set messages_used=0, new cycle dates
   */
  static async resetBillingCycle(subscriptionId: string): Promise<boolean> {
    const now = new Date();
    const cycleEnd = new Date(now);
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        ai_messages_used: 0,
        whatsapp_messages_used: 0,
        overage_messages: 0,
        overage_amount_sar: 0,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: cycleEnd.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", subscriptionId);

    return !error;
  }

  /**
   * Upgrade plan: update plan_id, message_limit, optionally reset usage
   */
  static async upgrade(
    subscriptionId: string,
    newPlanId: string,
    resetUsage = false,
  ): Promise<Subscription | null> {
    const plan = await PlanRepository.getById(newPlanId);
    if (!plan) return null;

    const updates: Record<string, unknown> = {
      plan_id: newPlanId,
      message_limit: plan.maxAiMessages,
      updated_at: new Date().toISOString(),
    };
    if (resetUsage) {
      updates.ai_messages_used = 0;
      updates.whatsapp_messages_used = 0;
      updates.overage_messages = 0;
      updates.overage_amount_sar = 0;
    }

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .update(updates)
      .eq("id", subscriptionId)
      .select()
      .single();

    if (error || !data) return null;
    return this.formatSubscription(data);
  }
}
