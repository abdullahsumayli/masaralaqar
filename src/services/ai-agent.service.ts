/**
 * AI Agent Service — خدمة إدارة وكلاء الذكاء الاصطناعي
 */

import { AIAgentRepository } from "@/repositories/ai-agent.repo";
import type { AIAgent, AIAgentUpdateInput } from "@/types/ai-agent";

export class AIAgentService {
  static async getAgentByOfficeId(officeId: string): Promise<AIAgent | null> {
    return AIAgentRepository.getByOfficeId(officeId);
  }

  static async updateAgent(
    officeId: string,
    input: AIAgentUpdateInput,
  ): Promise<AIAgent | null> {
    // Check if agent exists, create if not
    const existing = await AIAgentRepository.getByOfficeId(officeId);
    if (!existing) {
      return AIAgentRepository.create(
        officeId,
        input.agentName || "مساعد عقاري",
        input.greetingMessage || "مرحباً بك!",
      );
    }
    return AIAgentRepository.update(officeId, input);
  }

  static async getAgentById(id: string): Promise<AIAgent | null> {
    return AIAgentRepository.getById(id);
  }

  /** Build system prompt from agent settings */
  static buildSystemPrompt(
    agent: AIAgent,
    properties?: Array<{
      title: string;
      price: number;
      city: string;
      type: string;
    }>,
  ): string {
    const toneMap: Record<string, string> = {
      professional: "احترافي ومهني",
      friendly: "ودود وقريب",
      formal: "رسمي ومحترم",
      casual: "عفوي وبسيط",
    };

    const langInstruction =
      agent.language === "ar"
        ? "رد دائماً باللغة العربية."
        : agent.language === "en"
          ? "Always respond in English."
          : "رد بنفس لغة العميل.";

    let prompt = `أنت "${agent.agentName}"، مساعد عقاري ذكي.${agent.officeDescription ? ` تعمل لدى: ${agent.officeDescription}.` : ""}
أسلوب: ${toneMap[agent.tone] || "احترافي"}. ${langInstruction}${agent.customInstructions ? ` ${agent.customInstructions}` : ""}
ترحيب: "${agent.greetingMessage}"
قواعد: كن مختصراً (2-4 أسطر). لا تختلق عقارات. الأسعار بالريال. اقترح بدائل إن لم يتوفر مطابق.`;

    if (properties && properties.length > 0) {
      prompt += "\n\nالعقارات المتاحة حالياً:\n";
      properties.forEach((p, i) => {
        prompt += `${i + 1}. ${p.title} - ${p.city} - ${p.price.toLocaleString()} ريال - ${p.type}\n`;
      });
    }

    return prompt;
  }
}
