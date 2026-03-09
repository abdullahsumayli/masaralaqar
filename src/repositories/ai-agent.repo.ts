/**
 * AI Agent Repository — طبقة الوصول لبيانات وكلاء الذكاء الاصطناعي
 */

import { supabaseAdmin } from "@/lib/supabase";
import type { AIAgent, AIAgentUpdateInput } from "@/types/ai-agent";

export class AIAgentRepository {
  static formatAgent(row: Record<string, unknown>): AIAgent {
    const workingHours =
      typeof row.working_hours === "string"
        ? JSON.parse(row.working_hours)
        : (row.working_hours ?? {
            start: "08:00",
            end: "22:00",
            days: ["sun", "mon", "tue", "wed", "thu"],
          });

    return {
      id: row.id as string,
      officeId: row.office_id as string,
      agentName: row.agent_name as string,
      greetingMessage: row.greeting_message as string,
      officeDescription: (row.office_description as string) || "",
      tone: (row.tone as AIAgent["tone"]) || "professional",
      language: (row.language as AIAgent["language"]) || "ar",
      workingHours,
      customInstructions: (row.custom_instructions as string) || "",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  static async getByOfficeId(officeId: string): Promise<AIAgent | null> {
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .select("*")
      .eq("office_id", officeId)
      .single();

    if (error || !data) return null;
    return this.formatAgent(data);
  }

  static async getById(id: string): Promise<AIAgent | null> {
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return this.formatAgent(data);
  }

  static async update(
    officeId: string,
    input: AIAgentUpdateInput,
  ): Promise<AIAgent | null> {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (input.agentName !== undefined) updates.agent_name = input.agentName;
    if (input.greetingMessage !== undefined)
      updates.greeting_message = input.greetingMessage;
    if (input.officeDescription !== undefined)
      updates.office_description = input.officeDescription;
    if (input.tone !== undefined) updates.tone = input.tone;
    if (input.language !== undefined) updates.language = input.language;
    if (input.workingHours !== undefined)
      updates.working_hours = input.workingHours;
    if (input.customInstructions !== undefined)
      updates.custom_instructions = input.customInstructions;

    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .update(updates)
      .eq("office_id", officeId)
      .select()
      .single();

    if (error || !data) return null;
    return this.formatAgent(data);
  }

  static async create(
    officeId: string,
    agentName: string,
    greetingMessage: string,
  ): Promise<AIAgent | null> {
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .insert({
        office_id: officeId,
        agent_name: agentName,
        greeting_message: greetingMessage,
      })
      .select()
      .single();

    if (error || !data) return null;
    return this.formatAgent(data);
  }

  static async getAll(): Promise<AIAgent[]> {
    const { data, error } = await supabaseAdmin
      .from("ai_agents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((row) => this.formatAgent(row));
  }
}
