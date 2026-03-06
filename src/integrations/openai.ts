/**
 * OpenAI Integration
 * AI-powered message analysis and response generation using GPT-4o-mini
 */

import { MessageAnalysis } from '@/types/message'
import {
  extractCity,
  extractBudget,
  extractPropertyType,
  detectIntent,
  extractBedrooms,
  extractArea,
} from '@/lib/parser'

export class OpenAIService {
  private static apiKey: string = process.env.OPENAI_API_KEY || ''
  private static apiUrl: string = 'https://api.openai.com/v1/chat/completions'

  /**
   * Call OpenAI API
   */
  private static async callOpenAI(
    messages: Array<{ role: string; content: string }>,
    maxTokens: number = 500
  ): Promise<string | null> {
    try {
      if (!this.apiKey) {
        console.warn('OpenAI API key not configured')
        return null
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        console.error('OpenAI API error:', await response.text())
        return null
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || null
    } catch (error) {
      console.error('OpenAI API call failed:', error)
      return null
    }
  }

  /**
   * Generate smart reply using GPT-4o-mini
   */
  static async generateSmartReply(
    userMessage: string,
    context: {
      agentName?: string
      availableProperties?: any[]
      conversationHistory?: Array<{ role: string; content: string }>
    } = {}
  ): Promise<string> {
    const systemPrompt = `أنت مساعد ذكي متخصص في العقارات في السعودية. اسمك "${context.agentName || 'مساعد مسار العقار'}".

مهامك:
1. الرد على استفسارات العملاء بشكل ودود ومهني
2. فهم احتياجات العميل (نوع العقار، المدينة، الميزانية، عدد الغرف)
3. عرض العقارات المتاحة إن وجدت
4. جدولة الزيارات والمواعيد
5. الرد باللغة العربية دائماً

${context.availableProperties && context.availableProperties.length > 0 
  ? `العقارات المتاحة:\n${context.availableProperties.map(p => 
      `- ${p.title}: ${p.price?.toLocaleString()} ريال، ${p.location}`
    ).join('\n')}`
  : 'لا توجد عقارات محددة حالياً'
}

كن موجزاً ومفيداً. لا تكتب أكثر من 3-4 جمل.`

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history if available
    if (context.conversationHistory) {
      messages.push(...context.conversationHistory.slice(-5)) // Last 5 messages
    }

    messages.push({ role: 'user', content: userMessage })

    const reply = await this.callOpenAI(messages, 300)

    if (reply) {
      return reply
    }

    // Fallback to basic response if API fails
    return this.generateBasicReply(userMessage)
  }

  /**
   * Basic reply fallback (no API)
   */
  private static generateBasicReply(message: string): string {
    const intent = detectIntent(message)
    
    switch (intent) {
      case 'greeting':
        return 'السلام عليكم ورحمة الله وبركاته! 👋 أهلاً بك في مسار العقار. كيف يمكنني مساعدتك؟'
      case 'search':
        return 'أفهم أنك تبحث عن عقار. يرجى تحديد المدينة ونوع العقار والميزانية لنساعدك بشكل أفضل.'
      case 'schedule':
        return 'تم استلام طلب الموعد. سيتواصل معك فريقنا قريباً لتأكيد الزيارة.'
      case 'contact':
        return 'يسعدنا تواصلك معنا! سيقوم أحد مستشارينا بالرد عليك في أقرب وقت.'
      default:
        return 'شكراً لتواصلك! كيف يمكنني مساعدتك في البحث عن عقار مناسب؟'
    }
  }

  /**
   * Analyze message intent using OpenAI
   */
  static async analyzeIntentWithAI(message: string): Promise<string> {
    try {
      // Use local parser for speed, OpenAI for complex cases
      const localIntent = detectIntent(message)
      if (localIntent !== 'general') {
        return localIntent
      }

      // If local parser couldn't determine, use AI
      if (this.apiKey) {
        const prompt = `حدد نية المستخدم من هذه الرسالة. أجب بكلمة واحدة فقط من: search, greeting, schedule, contact, inquire, general

الرسالة: "${message}"

النية:`

        const result = await this.callOpenAI([
          { role: 'user', content: prompt }
        ], 10)

        if (result) {
          const intent = result.toLowerCase().trim()
          if (['search', 'greeting', 'schedule', 'contact', 'inquire'].includes(intent)) {
            return intent
          }
        }
      }

      return localIntent
    } catch (error) {
      console.error('OpenAIService.analyzeIntentWithAI error:', error)
      return 'general'
    }
  }

  /**
   * Extract budget information
   */
  static async extractBudgetWithAI(message: string): Promise<{ min?: number; max?: number } | null> {
    try {
      // For now, use local parser
      // In production, this would use AI for more accurate extraction
      return extractBudget(message)
    } catch (error) {
      console.error('OpenAIService.extractBudgetWithAI error:', error)
      return null
    }
  }

  /**
   * Extract location/city
   */
  static async extractLocationWithAI(message: string): Promise<string | null> {
    try {
      return extractCity(message)
    } catch (error) {
      console.error('OpenAIService.extractLocationWithAI error:', error)
      return null
    }
  }

  /**
   * Extract property type
   */
  static async extractPropertyTypeWithAI(message: string): Promise<string | null> {
    try {
      return extractPropertyType(message)
    } catch (error) {
      console.error('OpenAIService.extractPropertyTypeWithAI error:', error)
      return null
    }
  }

  /**
   * Generate contextual reply using OpenAI
   * This is a placeholder - actual implementation would call GPT-4o
   */
  static async generateReply(
    messageAnalysis: MessageAnalysis,
    tenantContext: any,
    availableProperties: any[] = []
  ): Promise<string> {
    try {
      const { intent, extractedData } = messageAnalysis

      let response = ''

      // Based on intent, generate appropriate response
      switch (intent) {
        case 'search':
          if (availableProperties.length === 0) {
            response =
              'عذراً، لم أتمكن من العثور على عقارات تطابق بحثك. يمكنك المحاولة مع معايير مختلفة أو الاتصال بنا مباشرة.'
          } else if (availableProperties.length === 1) {
            const prop = availableProperties[0]
            response = `وجدت عقار يطابق احتياجاتك:\n\n🏠 ${prop.title}\n💰 ${prop.price.toLocaleString()} ریال\n📍 ${prop.location}\n\nهل تريد مزيد من التفاصيل؟`
          } else {
            response = `وجدت ${availableProperties.length} عقار يطابق بحثك. أعرض لك أفضل ${Math.min(3, availableProperties.length)} خيار.`
            availableProperties.slice(0, 3).forEach((prop) => {
              response += `\n\n🏠 ${prop.title}\n💰 ${prop.price.toLocaleString()} ریال`
            })
          }
          break

        case 'inquire':
          response =
            'شكراً على استفسارك! أنا مساعدك الشخصي في مجال العقارات. كيف يمكنني مساعدتك بشكل أدق؟'
          break

        case 'schedule':
          response = 'تم تسجيل طلب الزيارة. سيتواصل معك فريقنا قريباً لتأكيد الموعد.'
          break

        case 'contact':
          response = `يمكنك التواصل معنا من خلال:\n📱 WhatsApp: ${tenantContext.whatsappNumber}\n☎️ الاتصال المباشر\n📧 البريد الإلكتروني\n\nكيف يمكنني مساعدتك؟`
          break

        case 'greeting':
          response =
            tenantContext.greeting ||
            'السلام عليكم ورحمة الله وبركاته! 👋 أنا مساعدك الذكي في عالم العقارات. كيف يمكنني مساعدتك اليوم؟'
          break

        default:
          response = `فهمت: "${messageAnalysis.extractedData.intent || message}". كيف يمكنني المساعدة؟`
      }

      return response
    } catch (error) {
      console.error('OpenAIService.generateReply error:', error)
      return 'عذراً، حدث خطأ في معالجة طلبك. الرجاء المحاولة مرة أخرى.'
    }
  }

  /**
   * Analyze message comprehensively
   * Returns detailed analysis including intent, entities, sentiment
   */
  static async analyzeMessageComprehensive(message: string): Promise<MessageAnalysis> {
    try {
      const intent = await this.analyzeIntentWithAI(message)
      const budget = await this.extractBudgetWithAI(message)
      const location = await this.extractLocationWithAI(message)
      const propertyType = await this.extractPropertyTypeWithAI(message)
      const bedrooms = extractBedrooms(message)
      const area = extractArea(message)

      const extractedData: Record<string, any> = {}
      if (intent !== 'general') extractedData.intent = intent
      if (location) extractedData.location = location
      if (budget) extractedData.budget = budget
      if (propertyType) extractedData.propertyType = propertyType
      if (bedrooms) extractedData.bedrooms = bedrooms
      if (area) extractedData.area = area

      // Calculate confidence
      let confidence = 0.5 // Base confidence
      if (Object.keys(extractedData).length > 2) confidence += 0.2
      if (budget && location) confidence += 0.2
      confidence = Math.min(1, confidence)

      return {
        intent,
        extractedData,
        confidence,
      }
    } catch (error) {
      console.error('OpenAIService.analyzeMessageComprehensive error:', error)
      return {
        intent: 'general',
        extractedData: {},
        confidence: 0,
      }
    }
  }

  /**
   * Check if API key is configured
   */
  static isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Set API key
   */
  static setApiKey(key: string): void {
    this.apiKey = key
  }
}
