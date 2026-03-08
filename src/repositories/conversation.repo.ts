/**
 * Conversation Repository
 * CRUD operations for conversation_messages table
 */

import { supabaseAdmin } from "@/lib/supabase";

export interface ConversationMessage {
  id: string;
  tenant_id: string;
  lead_id: string;
  role: "user" | "assistant";
  message: string;
  created_at: string;
}

export class ConversationRepository {
  /**
   * Save a single message (user or assistant)
   */
  static async saveMessage(
    tenantId: string,
    leadId: string,
    role: "user" | "assistant",
    message: string,
  ): Promise<ConversationMessage | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("conversation_messages")
        .insert({ tenant_id: tenantId, lead_id: leadId, role, message })
        .select()
        .single();

      if (error) {
        console.error("ConversationRepository.saveMessage error:", error);
        return null;
      }

      return data as ConversationMessage;
    } catch (error) {
      console.error("ConversationRepository.saveMessage exception:", error);
      return null;
    }
  }

  /**
   * Fetch last N messages for a lead (oldest-first for GPT context)
   */
  static async getHistory(
    leadId: string,
    limit: number = 12,
  ): Promise<ConversationMessage[]> {
    try {
      // Fetch newest `limit` rows, then reverse so GPT receives oldest-first
      const { data, error } = await supabaseAdmin
        .from("conversation_messages")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("ConversationRepository.getHistory error:", error);
        return [];
      }

      return ((data as ConversationMessage[]) || []).reverse();
    } catch (error) {
      console.error("ConversationRepository.getHistory exception:", error);
      return [];
    }
  }
}
