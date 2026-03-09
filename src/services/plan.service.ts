/**
 * Plan & Subscription Service — خدمة إدارة الباقات والاشتراكات
 */

import { PlanRepository } from "@/repositories/plan.repo";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import type { Plan, PlanCreateInput, PlanUpdateInput } from "@/types/plan";
import type { Subscription, SubscriptionWithPlan } from "@/types/subscription";

export class PlanService {
  static async getAllPlans(): Promise<Plan[]> {
    return PlanRepository.getAll();
  }

  static async getPlan(id: string): Promise<Plan | null> {
    return PlanRepository.getById(id);
  }

  static async createPlan(input: PlanCreateInput): Promise<Plan | null> {
    return PlanRepository.create(input);
  }

  static async updatePlan(
    id: string,
    input: PlanUpdateInput,
  ): Promise<Plan | null> {
    return PlanRepository.update(id, input);
  }

  static async deletePlan(id: string): Promise<boolean> {
    return PlanRepository.delete(id);
  }
}

export class SubscriptionService {
  static async getSubscription(
    officeId: string,
  ): Promise<SubscriptionWithPlan | null> {
    return SubscriptionRepository.getByOfficeId(officeId);
  }

  static async createSubscription(
    officeId: string,
    planId: string,
  ): Promise<Subscription | null> {
    return SubscriptionRepository.create(officeId, planId);
  }

  static async cancelSubscription(
    subscriptionId: string,
  ): Promise<Subscription | null> {
    return SubscriptionRepository.updateStatus(subscriptionId, "cancelled");
  }

  static async activateSubscription(
    subscriptionId: string,
  ): Promise<Subscription | null> {
    return SubscriptionRepository.updateStatus(subscriptionId, "active");
  }

  /** Check if office can use a resource */
  static async checkUsageLimit(
    officeId: string,
    type: "ai_message" | "whatsapp_message" | "property",
  ) {
    return SubscriptionRepository.checkLimit(officeId, type);
  }

  /** Increment usage counter */
  static async trackUsage(
    officeId: string,
    type: "ai_message" | "whatsapp_message",
  ) {
    return SubscriptionRepository.incrementUsage(officeId, type);
  }

  static async getAllSubscriptions(filters?: {
    status?: string;
  }): Promise<Subscription[]> {
    return SubscriptionRepository.getAll(filters);
  }
}
