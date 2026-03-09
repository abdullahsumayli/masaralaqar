/**
 * Property Knowledge Service — خدمة المعرفة العقارية
 *
 * تحويل بيانات العقار الخام إلى معلومات سياقية يستخدمها الذكاء الاصطناعي
 * مثال: بدل "شقة 3 غرف في الملقا" → "مناسبة للعائلات، قريبة من المدارس، موقع استثماري"
 */

import { PropertyKnowledgeRepository } from "@/repositories/property-knowledge.repo";
import type {
  PropertyKnowledge,
  PropertyKnowledgeInput,
} from "@/types/property-knowledge";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface PropertyData {
  id: string;
  title: string;
  description?: string;
  type: string;
  price: number;
  city: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features?: string[];
  images?: string[];
}

interface AIKnowledgeResult {
  familyScore: number;
  investmentScore: number;
  luxuryScore: number;
  locationSummary: string;
  advantages: string[];
  targetAudience: string[];
  nearbyFacilities: string[];
  aiDescription: string;
}

export class PropertyKnowledgeService {
  /**
   * Generate or retrieve knowledge for a property.
   * If knowledge already exists and is recent, return cached version.
   */
  static async getKnowledge(
    propertyId: string,
  ): Promise<PropertyKnowledge | null> {
    return PropertyKnowledgeRepository.getByPropertyId(propertyId);
  }

  /**
   * Generate knowledge for a property using AI analysis.
   * Called when a property is added or updated.
   */
  static async generateKnowledge(
    property: PropertyData,
  ): Promise<PropertyKnowledge | null> {
    try {
      const aiResult = await this.analyzeWithAI(property);
      const input: PropertyKnowledgeInput = {
        propertyId: property.id,
        ...aiResult,
      };
      return PropertyKnowledgeRepository.upsert(input);
    } catch (error) {
      console.error(
        "[PropertyKnowledge] AI analysis failed, using rule-based:",
        error,
      );
      // Fallback to rule-based analysis
      const ruleResult = this.analyzeRuleBased(property);
      const input: PropertyKnowledgeInput = {
        propertyId: property.id,
        ...ruleResult,
      };
      return PropertyKnowledgeRepository.upsert(input);
    }
  }

  /**
   * Batch generate knowledge for multiple properties
   */
  static async generateBatch(properties: PropertyData[]): Promise<number> {
    let generated = 0;
    for (const property of properties) {
      const result = await this.generateKnowledge(property);
      if (result) generated++;
    }
    return generated;
  }

  /**
   * Get knowledge for multiple properties at once (used by recommendation engine)
   */
  static async getKnowledgeBatch(
    propertyIds: string[],
  ): Promise<Map<string, PropertyKnowledge>> {
    const knowledgeList =
      await PropertyKnowledgeRepository.getByPropertyIds(propertyIds);
    const map = new Map<string, PropertyKnowledge>();
    for (const k of knowledgeList) {
      map.set(k.propertyId, k);
    }
    return map;
  }

  /**
   * Build a contextual description enriching the property for AI conversations
   */
  static buildContextDescription(
    property: PropertyData,
    knowledge: PropertyKnowledge | null,
  ): string {
    let ctx = `${property.title} — ${property.city}`;
    ctx += `\nالسعر: ${property.price.toLocaleString()} ريال`;
    if (property.bedrooms) ctx += ` | ${property.bedrooms} غرف`;
    if (property.area) ctx += ` | ${property.area} م²`;

    if (knowledge) {
      if (knowledge.aiDescription) {
        ctx += `\n${knowledge.aiDescription}`;
      }
      if (knowledge.advantages.length > 0) {
        ctx += `\nالمميزات: ${knowledge.advantages.join("، ")}`;
      }
      if (knowledge.familyScore >= 70) ctx += "\n✅ مناسب للعائلات";
      if (knowledge.investmentScore >= 70) ctx += "\n📈 فرصة استثمارية";
      if (knowledge.luxuryScore >= 70) ctx += "\n✨ مستوى فاخر";
      if (knowledge.locationSummary) {
        ctx += `\nالموقع: ${knowledge.locationSummary}`;
      }
    }

    return ctx;
  }

  // ── AI-based analysis using OpenAI ──

  private static async analyzeWithAI(
    property: PropertyData,
  ): Promise<AIKnowledgeResult> {
    if (!OPENAI_API_KEY) {
      return this.analyzeRuleBased(property);
    }

    const prompt = `حلّل العقار التالي وأعطني تقييماً رقمياً وإثراءً معرفياً:

العنوان: ${property.title}
النوع: ${property.type}
المدينة: ${property.city}
الحي: ${property.location || "غير محدد"}
السعر: ${property.price.toLocaleString()} ريال
المساحة: ${property.area || "غير محددة"} م²
الغرف: ${property.bedrooms || "غير محدد"}
الوصف: ${property.description || "لا يوجد وصف"}
المميزات: ${property.features?.join("، ") || "غير محددة"}

أعطني إجابة بتنسيق JSON فقط (بدون أي نص إضافي):
{
  "familyScore": رقم من 0 إلى 100 (مدى ملاءمته للعائلات),
  "investmentScore": رقم من 0 إلى 100 (مدى جاذبيته كاستثمار),
  "luxuryScore": رقم من 0 إلى 100 (مستوى الفخامة),
  "locationSummary": "وصف مختصر للموقع وقربه من الخدمات",
  "advantages": ["ميزة 1", "ميزة 2", "ميزة 3"],
  "targetAudience": ["الجمهور المستهدف 1", "الجمهور 2"],
  "nearbyFacilities": ["مرفق قريب 1", "مرفق 2"],
  "aiDescription": "وصف تحليلي مختصر للعقار في 2-3 جمل"
}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "أنت محلل عقاري خبير في السوق السعودي. أجب بتنسيق JSON فقط.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Empty AI response");
    }

    // Parse JSON, handling potential markdown wrapping
    const jsonStr = content.replace(/```json?\n?/g, "").replace(/```/g, "");
    const parsed = JSON.parse(jsonStr);

    return {
      familyScore: Math.min(100, Math.max(0, parsed.familyScore || 0)),
      investmentScore: Math.min(
        100,
        Math.max(0, parsed.investmentScore || 0),
      ),
      luxuryScore: Math.min(100, Math.max(0, parsed.luxuryScore || 0)),
      locationSummary: parsed.locationSummary || "",
      advantages: Array.isArray(parsed.advantages) ? parsed.advantages : [],
      targetAudience: Array.isArray(parsed.targetAudience)
        ? parsed.targetAudience
        : [],
      nearbyFacilities: Array.isArray(parsed.nearbyFacilities)
        ? parsed.nearbyFacilities
        : [],
      aiDescription: parsed.aiDescription || "",
    };
  }

  // ── Rule-based fallback analysis ──

  private static analyzeRuleBased(property: PropertyData): AIKnowledgeResult {
    let familyScore = 50;
    let investmentScore = 50;
    let luxuryScore = 30;

    // Family scoring
    if (property.bedrooms && property.bedrooms >= 3) familyScore += 20;
    if (property.bedrooms && property.bedrooms >= 4) familyScore += 10;
    if (property.type === "villa") familyScore += 15;
    if (property.type === "apartment" && property.bedrooms && property.bedrooms >= 3)
      familyScore += 10;

    // Investment scoring
    if (property.type === "land") investmentScore += 20;
    if (property.type === "commercial") investmentScore += 25;
    if (property.area && property.area > 300) investmentScore += 10;

    // Luxury scoring
    if (property.price > 2000000) luxuryScore += 25;
    if (property.price > 5000000) luxuryScore += 20;
    if (property.type === "villa") luxuryScore += 15;
    if (property.area && property.area > 400) luxuryScore += 10;

    // Location-based adjustments for known Saudi districts
    const loc = (property.location || "").toLowerCase();
    const premiumAreas = [
      "الملقا",
      "النرجس",
      "الياسمين",
      "حطين",
      "العليا",
      "الورود",
      "السفارات",
    ];
    if (premiumAreas.some((a) => loc.includes(a))) {
      luxuryScore += 15;
      investmentScore += 10;
    }

    const familyAreas = [
      "الملقا",
      "الياسمين",
      "النرجس",
      "العارض",
      "الرمال",
      "القيروان",
    ];
    if (familyAreas.some((a) => loc.includes(a))) {
      familyScore += 10;
    }

    familyScore = Math.min(100, familyScore);
    investmentScore = Math.min(100, investmentScore);
    luxuryScore = Math.min(100, luxuryScore);

    const advantages: string[] = [];
    if (familyScore >= 70) advantages.push("مناسب للعائلات");
    if (investmentScore >= 70) advantages.push("فرصة استثمارية");
    if (luxuryScore >= 70) advantages.push("مستوى فاخر");
    if (property.bedrooms && property.bedrooms >= 4)
      advantages.push("مساحة واسعة");
    if (property.images && property.images.length > 3)
      advantages.push("صور متعددة متاحة");

    const targetAudience: string[] = [];
    if (familyScore >= 60) targetAudience.push("عائلات");
    if (investmentScore >= 60) targetAudience.push("مستثمرين");
    if (luxuryScore >= 70) targetAudience.push("باحثين عن الفخامة");
    if (property.type === "apartment" && property.price < 800000)
      targetAudience.push("مشتري أول مرة");

    return {
      familyScore,
      investmentScore,
      luxuryScore,
      locationSummary: property.location
        ? `${property.location}، ${property.city}`
        : property.city,
      advantages,
      targetAudience,
      nearbyFacilities: [],
      aiDescription: `${property.type === "villa" ? "فيلا" : property.type === "apartment" ? "شقة" : property.type} في ${property.city}${property.location ? " - " + property.location : ""}، بسعر ${property.price.toLocaleString()} ريال.`,
    };
  }
}
