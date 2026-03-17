/**
 * Conversation Service
 * Manages long-term conversation memory for the Saqr AI system
 */

import { ConversationRepository } from "@/repositories/conversation.repo";

export type OpenAIMessage = { role: "user" | "assistant"; content: string };

export class ConversationService {
  /**
   * Save a user message to the conversation log.
   * For evolution path, pass officeId (tenantId may be empty).
   */
  static async saveUserMessage(
    tenantId: string,
    leadId: string,
    message: string,
    officeId?: string,
  ): Promise<void> {
    await ConversationRepository.saveMessage(tenantId, leadId, "user", message, officeId);
  }

  /**
   * Save an assistant (bot) reply to the conversation log.
   * For evolution path, pass officeId (tenantId may be empty).
   */
  static async saveAssistantMessage(
    tenantId: string,
    leadId: string,
    message: string,
    officeId?: string,
  ): Promise<void> {
    await ConversationRepository.saveMessage(tenantId, leadId, "assistant", message, officeId);
  }

  /**
   * Retrieve last N messages and convert to OpenAI message format
   * Returns messages in chronological order (oldest first)
   */
  static async getConversationHistory(
    leadId: string,
    limit: number = 12,
  ): Promise<OpenAIMessage[]> {
    const rows = await ConversationRepository.getHistory(leadId, limit);
    return rows.map((r) => ({ role: r.role, content: r.message }));
  }
}
