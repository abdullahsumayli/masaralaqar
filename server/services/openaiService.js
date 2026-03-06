import { logger } from "../utils/logger.js";

const extractLeadData = async ({ message, context }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logger.warn("OPENAI_API_KEY is missing");
    return {
      reply:
        "حالياً لا أستطيع الرد آلياً. فضلاً اذكر المدينة ونوع العقار والميزانية وهدفك (شراء/إيجار).",
    };
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const systemPrompt = `
أنت مساعد عقاري ذكي باسم Masar AI. مهمتك استخراج بيانات العميل العقارية.
أعد إجابة JSON فقط بالصيغ التالية:
{
  "reply": "نص الرد بالعربية",
  "city": "المدينة أو null",
  "property_type": "نوع العقار أو null",
  "purpose": "buy أو rent أو null",
  "budget": "الميزانية أو null"
}
إذا لم تتوفر معلومات كافية، اسأل سؤالاً واحداً فقط لتجميع البيانات الناقصة.
`;

  const userPrompt = `
رسالة العميل: ${message}
البيانات الحالية: ${JSON.stringify(context || {})}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt.trim() },
          { role: "user", content: userPrompt.trim() },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    const cleaned = content.trim();
    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    logger.error({ err: error }, "OpenAI extraction failed");
    return {
      reply:
        "واجهت مشكلة مؤقتة. فضلاً اذكر المدينة ونوع العقار والميزانية وهدفك (شراء/إيجار).",
    };
  }
};

export { extractLeadData };
