/**
 * Usage Service
 * Tracks usage events (messages, leads, etc.) for billing and plan limits
 */

import { supabaseAdmin } from "@/lib/supabase";
import { SubscriptionRepository } from "@/repositories/subscription.repo";

export interface UsageSummary {
  messagesUsed: number;
  messageLimit: number;
  percentUsed: number;
  isAtLimit: boolean;
  isNearLimit: boolean;
}

/** Current AI message usage vs plan limit (for billing UI) */
export async function getUsageSummary(
  officeId: string,
): Promise<UsageSummary | null> {
  const sub = await SubscriptionRepository.getByOfficeId(officeId);
  if (!sub) return null;
  const limit = sub.messageLimit ?? sub.plan?.maxAiMessages ?? 300;
  const used = sub.aiMessagesUsed;
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return {
    messagesUsed: used,
    messageLimit: limit,
    percentUsed: pct,
    isAtLimit: limit > 0 && used >= limit,
    isNearLimit: limit > 0 && pct >= 80,
  };
}

type UsageEvent = "lead_created" | "message_sent" | "message_received" | "ai_response";

/**
 * Log a usage event for an office
 * Fire-and-forget: callers use .catch(() => {}) so this should not throw
 */
export async function logUsage(
  officeId: string,
  event: UsageEvent,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    // Increment message_count on the office record for billing tracking
    if (event === "message_sent" || event === "message_received" || event === "ai_response") {
      try {
        const { error } = await supabaseAdmin.rpc("increment_message_count", {
          office_id_input: officeId,
        });
        if (error) {
          console.debug("[Usage] increment_message_count:", error.message);
        }
      } catch {
        /* RPC غير متوفر أو فشل — غير حرج */
      }
    }

    const { error: insertError } = await supabaseAdmin.from("usage_logs").insert({
      office_id: officeId,
      type: event,
      metadata: metadata ?? {},
      count: 1,
    });
    if (insertError) {
      console.debug("[Usage] usage_logs insert:", insertError.message);
    }
  } catch (error) {
    // Never throw - this is fire-and-forget
    console.error("[Usage] Failed to log usage:", error);
  }
}
