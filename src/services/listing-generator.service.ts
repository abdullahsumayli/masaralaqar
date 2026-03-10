/**
 * Listing Generator Service — خدمة توليد الإعلانات الذكية
 *
 * تحويل بيانات العقار + المعرفة العقارية → إعلان تسويقي جاهز للنشر
 * يدعم: تحليل الصور، توليد جماعي، fallback نصي
 */

import { AIListingRepository } from "@/repositories/ai-listing.repo";
import type {
    AIListing,
    AIListingInput,
    ExportFormat,
    ImageAnalysisResult,
} from "@/types/ai-listing";
import type { PropertyKnowledge } from "@/types/property-knowledge";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface PropertyData {
  id: string;
  title: string;
  description?: string;
  type: string;
  price: number;
  city: string;
  location?: string;
  district?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features?: string[];
  images?: string[];
  license_number?: string;
}

interface GeneratedListing {
  title: string;
  marketingDescription: string;
  bulletFeatures: string[];
  targetAudience: string[];
  seoKeywords: string[];
  adCopyShort: string;
}

interface AgentSettings {
  agentName?: string;
  tone?: string;
  officeDescription?: string;
}

export class ListingGeneratorService {
  /**
   * Generate a full AI listing for a property
   * Pipeline: Load knowledge → Analyze images → Generate ad → Save
   */
  static async generate(
    property: PropertyData,
    officeId: string,
    knowledge: PropertyKnowledge | null,
    agentSettings?: AgentSettings,
  ): Promise<AIListing | null> {
    // Step 1: Analyze images (with fallback)
    let imageAnalysis: ImageAnalysisResult = { analyzed: false };
    if (property.images && property.images.length > 0) {
      try {
        imageAnalysis = await this.analyzeImages(property.images);
      } catch (error) {
        console.warn(
          "[ListingGenerator] Image analysis failed, continuing with text-only:",
          error,
        );
        imageAnalysis = { analyzed: false };
      }
    }

    // Step 2: Generate the marketing content
    let listing: GeneratedListing;
    try {
      listing = await this.generateWithAI(
        property,
        knowledge,
        imageAnalysis,
        agentSettings,
      );
    } catch (error) {
      console.warn(
        "[ListingGenerator] AI generation failed, using rule-based:",
        error,
      );
      listing = this.generateRuleBased(property, knowledge, imageAnalysis);
    }

    // Step 3: Save to database
    const input: AIListingInput = {
      officeId,
      propertyId: property.id,
      ...listing,
      imageAnalysis,
    };

    return AIListingRepository.upsert(input);
  }

  /**
   * Batch generate listings for multiple properties
   */
  static async generateBatch(
    properties: PropertyData[],
    officeId: string,
    knowledgeMap: Map<string, PropertyKnowledge>,
    agentSettings?: AgentSettings,
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const property of properties) {
      try {
        const knowledge = knowledgeMap.get(property.id) || null;
        const result = await this.generate(
          property,
          officeId,
          knowledge,
          agentSettings,
        );
        if (result) success++;
        else failed++;
      } catch {
        failed++;
      }
    }

    return { success, failed };
  }

  // ── Image Analysis using GPT-4o vision ──

  private static async analyzeImages(
    imageUrls: string[],
  ): Promise<ImageAnalysisResult> {
    if (!OPENAI_API_KEY || imageUrls.length === 0) {
      return { analyzed: false };
    }

    // Analyze up to 3 images to save costs
    const imagesToAnalyze = imageUrls.slice(0, 3);

    const imageMessages = imagesToAnalyze.map((url) => ({
      type: "image_url" as const,
      image_url: { url, detail: "low" as const },
    }));

    try {
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
                "أنت محلل صور عقارية. حلّل الصور وأجب بتنسيق JSON فقط بدون أي نص إضافي.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `حلّل صور العقار التالية واستخرج المعلومات بتنسيق JSON:
{
  "hasModernKitchen": true/false,
  "hasBalcony": true/false,
  "hasView": true/false,
  "hasParking": true/false,
  "finishLevel": "basic" | "standard" | "premium" | "luxury",
  "detectedFeatures": ["ميزة 1", "ميزة 2"]
}`,
                },
                ...imageMessages,
              ],
            },
          ],
          temperature: 0.2,
          max_tokens: 300,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI Vision API error: ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) return { analyzed: false };

      const jsonStr = content.replace(/```json?\n?/g, "").replace(/```/g, "");
      const parsed = JSON.parse(jsonStr);

      return {
        hasModernKitchen: !!parsed.hasModernKitchen,
        hasBalcony: !!parsed.hasBalcony,
        hasView: !!parsed.hasView,
        hasParking: !!parsed.hasParking,
        finishLevel: parsed.finishLevel || "standard",
        detectedFeatures: Array.isArray(parsed.detectedFeatures)
          ? parsed.detectedFeatures
          : [],
        analyzed: true,
      };
    } catch (error) {
      console.warn("[ListingGenerator] Vision analysis failed:", error);
      return { analyzed: false };
    }
  }

  // ── AI-based listing generation ──

  private static async generateWithAI(
    property: PropertyData,
    knowledge: PropertyKnowledge | null,
    imageAnalysis: ImageAnalysisResult,
    agentSettings?: AgentSettings,
  ): Promise<GeneratedListing> {
    if (!OPENAI_API_KEY) {
      return this.generateRuleBased(property, knowledge, imageAnalysis);
    }

    const typeMap: Record<string, string> = {
      apartment: "شقة",
      villa: "فيلا",
      land: "أرض",
      commercial: "عقار تجاري",
    };
    const typeAr = typeMap[property.type] || property.type;

    // Build context sections
    let knowledgeContext = "";
    if (knowledge) {
      knowledgeContext = `
المعرفة العقارية:
- ملاءمة للعائلات: ${knowledge.familyScore}/100
- جاذبية استثمارية: ${knowledge.investmentScore}/100
- مستوى الفخامة: ${knowledge.luxuryScore}/100
- الموقع: ${knowledge.locationSummary}
- المميزات: ${knowledge.advantages.join("، ")}
- الجمهور: ${knowledge.targetAudience.join("، ")}`;
    }

    let imageContext = "";
    if (imageAnalysis.analyzed) {
      const features: string[] = [];
      if (imageAnalysis.hasModernKitchen) features.push("مطبخ حديث");
      if (imageAnalysis.hasBalcony) features.push("شرفة/بلكونة");
      if (imageAnalysis.hasView) features.push("إطلالة مميزة");
      if (imageAnalysis.hasParking) features.push("موقف سيارات");
      if (imageAnalysis.finishLevel)
        features.push(
          `تشطيب ${imageAnalysis.finishLevel === "luxury" ? "فاخر" : imageAnalysis.finishLevel === "premium" ? "ممتاز" : imageAnalysis.finishLevel === "standard" ? "جيد" : "أساسي"}`,
        );
      if (imageAnalysis.detectedFeatures?.length)
        features.push(...imageAnalysis.detectedFeatures);
      if (features.length > 0) {
        imageContext = `\nمن تحليل الصور: ${features.join("، ")}`;
      }
    }

    let toneInstruction = "";
    if (agentSettings?.tone === "formal") {
      toneInstruction = "استخدم أسلوبًا رسميًا ومهنيًا.";
    } else {
      toneInstruction = "استخدم أسلوبًا جذابًا ودافئًا مع الاحترافية.";
    }

    const prompt = `أنشئ إعلانًا تسويقيًا عقاريًا احترافيًا للعقار التالي:

بيانات العقار:
- النوع: ${typeAr}
- العنوان: ${property.title}
- المدينة: ${property.city}
- الحي: ${property.location || property.district || "غير محدد"}
- السعر: ${property.price.toLocaleString()} ريال
- المساحة: ${property.area || "غير محددة"} م²
- غرف النوم: ${property.bedrooms || "غير محدد"}
- دورات المياه: ${property.bathrooms || "غير محدد"}
- الوصف: ${property.description || "لا يوجد"}
${knowledgeContext}${imageContext}

${toneInstruction}
${agentSettings?.officeDescription ? `المكتب: ${agentSettings.officeDescription}` : ""}

أعطني إجابة بتنسيق JSON فقط (بدون أي نص إضافي):
{
  "title": "عنوان تسويقي جذاب للعقار (سطر واحد)",
  "marketingDescription": "وصف تسويقي احترافي 100-150 كلمة",
  "bulletFeatures": ["ميزة 1", "ميزة 2", "ميزة 3", "ميزة 4", "ميزة 5"],
  "targetAudience": ["جمهور 1", "جمهور 2"],
  "seoKeywords": ["كلمة 1", "كلمة 2", "كلمة 3", "كلمة 4", "كلمة 5"],
  "adCopyShort": "نسخة إعلانية قصيرة لتويتر (أقل من 200 حرف)"
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
              "أنت خبير تسويق عقاري في السوق السعودي. مهمتك إنشاء إعلانات عقارية جذابة واحترافية. أجب بتنسيق JSON فقط.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("Empty AI response");

    const jsonStr = content.replace(/```json?\n?/g, "").replace(/```/g, "");
    const parsed = JSON.parse(jsonStr);

    return {
      title: parsed.title || property.title,
      marketingDescription: parsed.marketingDescription || "",
      bulletFeatures: Array.isArray(parsed.bulletFeatures)
        ? parsed.bulletFeatures
        : [],
      targetAudience: Array.isArray(parsed.targetAudience)
        ? parsed.targetAudience
        : [],
      seoKeywords: Array.isArray(parsed.seoKeywords) ? parsed.seoKeywords : [],
      adCopyShort: parsed.adCopyShort || "",
    };
  }

  // ── Rule-based fallback ──

  private static generateRuleBased(
    property: PropertyData,
    knowledge: PropertyKnowledge | null,
    imageAnalysis: ImageAnalysisResult,
  ): GeneratedListing {
    const typeMap: Record<string, string> = {
      apartment: "شقة",
      villa: "فيلا",
      land: "أرض",
      commercial: "عقار تجاري",
    };
    const typeAr = typeMap[property.type] || property.type;
    const location = property.location || property.district || "";

    // Title
    const title = `${typeAr} ${property.price > 2000000 ? "فاخرة " : ""}للبيع في ${location ? "حي " + location : property.city}${location ? " – " + property.city : ""}`;

    // Description
    let desc = `نقدم لكم ${typeAr} مميزة في ${property.city}`;
    if (location) desc += ` بحي ${location}`;
    desc += ` بسعر ${property.price.toLocaleString()} ريال.`;
    if (property.area) desc += ` تبلغ المساحة ${property.area} متر مربع`;
    if (property.bedrooms) desc += ` وتحتوي على ${property.bedrooms} غرف نوم`;
    if (property.bathrooms) desc += ` و${property.bathrooms} دورات مياه`;
    desc += ".";

    if (knowledge?.aiDescription) {
      desc += " " + knowledge.aiDescription;
    }

    if (imageAnalysis.analyzed) {
      const extras: string[] = [];
      if (imageAnalysis.hasModernKitchen) extras.push("مطبخ حديث");
      if (imageAnalysis.hasBalcony) extras.push("شرفة");
      if (imageAnalysis.hasView) extras.push("إطلالة مميزة");
      if (extras.length > 0) {
        desc += ` يتميز العقار بـ ${extras.join(" و")}.`;
      }
    }

    desc += " فرصة مميزة لا تفوّتها. تواصل معنا الآن للاطلاع والمعاينة.";

    // Features
    const features: string[] = [];
    if (location) features.push(`موقع مميز في ${location}`);
    if (property.area) features.push(`مساحة ${property.area} م²`);
    if (property.bedrooms) features.push(`${property.bedrooms} غرف نوم`);
    if (property.bathrooms) features.push(`${property.bathrooms} دورات مياه`);
    if (knowledge) {
      features.push(...knowledge.advantages.slice(0, 3));
    }
    if (imageAnalysis.hasModernKitchen) features.push("مطبخ حديث");
    if (imageAnalysis.hasBalcony) features.push("شرفة / بلكونة");
    if (imageAnalysis.hasView) features.push("إطلالة مميزة");
    if (imageAnalysis.hasParking) features.push("موقف سيارات");
    if (property.license_number) features.push("مرخّص من الفال");

    // Audience
    const audience: string[] = [];
    if (knowledge) {
      if (knowledge.familyScore >= 60) audience.push("عائلات");
      if (knowledge.investmentScore >= 60) audience.push("مستثمرون عقاريون");
      if (knowledge.luxuryScore >= 70) audience.push("باحثون عن الفخامة");
    }
    if (audience.length === 0) {
      if (property.type === "apartment" && property.price < 800000)
        audience.push("مشترون لأول مرة");
      else audience.push("مهتمون بالعقارات");
    }

    // SEO
    const keywords: string[] = [
      `${typeAr} للبيع`,
      property.city,
      location,
      `عقارات ${property.city}`,
      `${typeAr} ${property.city}`,
    ].filter(Boolean);

    // Short ad copy
    const adShort = `${typeAr} للبيع في ${property.city}${location ? " – " + location : ""} | ${property.price.toLocaleString()} ريال${property.bedrooms ? " | " + property.bedrooms + " غرف" : ""}`;

    return {
      title,
      marketingDescription: desc,
      bulletFeatures: features.slice(0, 8),
      targetAudience: audience,
      seoKeywords: keywords,
      adCopyShort: adShort.slice(0, 200),
    };
  }

  // ── Export Formatters ──

  static formatForExport(
    listing: AIListing,
    property: PropertyData,
    format: ExportFormat,
  ): string {
    switch (format) {
      case "whatsapp":
        return this.formatWhatsApp(listing, property);
      case "twitter":
        return this.formatTwitter(listing, property);
      case "instagram":
        return this.formatInstagram(listing, property);
      case "portal":
        return this.formatPortal(listing, property);
      case "seo":
        return this.formatSEO(listing, property);
      default:
        return listing.marketingDescription;
    }
  }

  private static formatWhatsApp(
    listing: AIListing,
    property: PropertyData,
  ): string {
    let msg = `🏠 *${listing.title}*\n\n`;
    msg += `${listing.marketingDescription}\n\n`;
    msg += `✅ *المميزات:*\n`;
    listing.bulletFeatures.forEach((f) => {
      msg += `• ${f}\n`;
    });
    msg += `\n💰 *السعر:* ${property.price.toLocaleString()} ريال\n`;
    if (property.area) msg += `📐 *المساحة:* ${property.area} م²\n`;
    if (property.bedrooms) msg += `🛏️ *الغرف:* ${property.bedrooms} غرف نوم\n`;
    msg += `📍 *الموقع:* ${property.city}${property.location ? " – " + property.location : ""}\n\n`;
    msg += `📞 تواصل معنا الآن للمعاينة!`;
    return msg;
  }

  private static formatTwitter(
    listing: AIListing,
    _property: PropertyData,
  ): string {
    let tweet = listing.adCopyShort;
    // Add hashtags from keywords (fit within ~280 chars)
    const hashtags = listing.seoKeywords
      .slice(0, 3)
      .map((k) => `#${k.replace(/\s+/g, "_")}`)
      .join(" ");
    const remaining = 280 - tweet.length - 1;
    if (remaining > hashtags.length) {
      tweet += "\n" + hashtags;
    }
    return tweet.slice(0, 280);
  }

  private static formatInstagram(
    listing: AIListing,
    property: PropertyData,
  ): string {
    let caption = `🏡 ${listing.title}\n\n`;
    caption += `${listing.marketingDescription}\n\n`;
    caption += `💰 السعر: ${property.price.toLocaleString()} ريال\n`;
    if (property.area) caption += `📐 المساحة: ${property.area} م²\n`;
    caption += `📍 ${property.city}${property.location ? " – " + property.location : ""}\n\n`;
    // Hashtags
    caption += listing.seoKeywords
      .map((k) => `#${k.replace(/\s+/g, "_")}`)
      .join(" ");
    caption += " #عقارات #عقارات_السعودية #عقار_للبيع";
    return caption;
  }

  private static formatPortal(
    listing: AIListing,
    property: PropertyData,
  ): string {
    let text = `${listing.title}\n\n`;
    text += `${listing.marketingDescription}\n\n`;
    text += `المميزات:\n`;
    listing.bulletFeatures.forEach((f) => {
      text += `- ${f}\n`;
    });
    text += `\nالتفاصيل:\n`;
    text += `النوع: ${property.type}\n`;
    text += `السعر: ${property.price.toLocaleString()} ريال\n`;
    text += `المدينة: ${property.city}\n`;
    if (property.location) text += `الحي: ${property.location}\n`;
    if (property.area) text += `المساحة: ${property.area} م²\n`;
    if (property.bedrooms) text += `غرف النوم: ${property.bedrooms}\n`;
    if (property.bathrooms) text += `دورات المياه: ${property.bathrooms}\n`;
    if (property.license_number)
      text += `رقم الترخيص: ${property.license_number}\n`;
    return text;
  }

  private static formatSEO(listing: AIListing, property: PropertyData): string {
    let html = `<h1>${listing.title}</h1>\n`;
    html += `<meta name="description" content="${listing.adCopyShort}" />\n`;
    html += `<meta name="keywords" content="${listing.seoKeywords.join(", ")}" />\n\n`;
    html += `<article>\n`;
    html += `<p>${listing.marketingDescription}</p>\n\n`;
    html += `<h2>المميزات</h2>\n<ul>\n`;
    listing.bulletFeatures.forEach((f) => {
      html += `  <li>${f}</li>\n`;
    });
    html += `</ul>\n\n`;
    html += `<h2>التفاصيل</h2>\n`;
    html += `<dl>\n`;
    html += `  <dt>السعر</dt><dd>${property.price.toLocaleString()} ريال</dd>\n`;
    html += `  <dt>المدينة</dt><dd>${property.city}</dd>\n`;
    if (property.area)
      html += `  <dt>المساحة</dt><dd>${property.area} م²</dd>\n`;
    if (property.bedrooms)
      html += `  <dt>غرف النوم</dt><dd>${property.bedrooms}</dd>\n`;
    html += `</dl>\n`;
    html += `</article>`;
    return html;
  }
}
