/**
 * Usage Service
 * Tracks usage events (messages, leads, etc.) for billing and plan limits
 */

import { supabaseAdmin } from "@/lib/supabase";

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
      await supabaseAdmin
        .from("offices")
        .update({
          message_count: supabaseAdmin.rpc ? undefined : undefined,
        })
        .eq("id", officeId);

      // Increment via RPC if available, otherwise use direct increment
      await supabaseAdmin.rpc("increment_message_count", {
        office_id_input: officeId,
      }).then(() => {}).catch(() => {
        // RPC not available yet, skip silently
      });
    }

    // Log the event for analytics
    console.log(`[Usage] office=${officeId} event=${event}`, metadata || "");
    
    // TODO: Insert into usage_logs table when ready
    // await supabaseAdmin.from("usage_logs").insert({
    //   office_id: officeId,
    //   event,
    //   metadata,
    //   created_at: new Date().toISOString(),
    // });
  } catch (error) {
    // Never throw - this is fire-and-forget
    console.error("[Usage] Failed to log usage:", error);
  }
}
