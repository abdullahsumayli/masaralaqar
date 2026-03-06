/**
 * OpenAI Integration
 * AI-powered message analysis and response generation
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

  /**
   * Analyze message intent using OpenAI
   */
  static async analyzeIntentWithAI(message: string): Promise<string> {
    try {
      // For now, use local parser
      // In production, this would call OpenAI's GPT-4o model
      return detectIntent(message)
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
