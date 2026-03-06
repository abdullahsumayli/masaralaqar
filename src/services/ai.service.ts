/**
 * AI Service
 * Handles message analysis and property matching
 */

import { MessageAnalysis, AIResponse, TenantContext } from '@/types/message'
import { Property } from '@/types/property'
import { OpenAIService } from '@/integrations/openai'
import {
  extractCity,
  extractBudget,
  extractPropertyType,
  extractBedrooms,
  extractArea,
  detectIntent,
} from '@/lib/parser'

export class AIService {
  /**
   * Analyze incoming message and extract structured data
   */
  static analyzeMessage(message: string, tenantContext: TenantContext): MessageAnalysis {
    const intent = detectIntent(message)
    const city = extractCity(message)
    const budget = extractBudget(message)
    const propertyType = extractPropertyType(message)
    const bedrooms = extractBedrooms(message)
    const area = extractArea(message)

    const extractedData: Record<string, any> = {}
    if (intent !== 'general') extractedData.intent = intent
    if (city) extractedData.city = city
    if (budget) extractedData.budget = budget
    if (propertyType) extractedData.propertyType = propertyType
    if (bedrooms) extractedData.bedrooms = bedrooms
    if (area) extractedData.area = area

    // Calculate confidence score: 0.0 - 1.0
    let confidenceFactors = 0
    let totalFactors = 5

    if (intent !== 'general') confidenceFactors++
    if (city) confidenceFactors++
    if (budget) confidenceFactors++
    if (propertyType) confidenceFactors++
    if (bedrooms || area) confidenceFactors++

    const confidence = confidenceFactors / totalFactors

    return {
      intent,
      extractedData,
      confidence,
    }
  }

  /**
   * Generate AI response using GPT-4o-mini
   */
  static async generateSmartReply(
    userMessage: string,
    matchedProperties: Property[],
    tenantContext: TenantContext
  ): Promise<AIResponse> {
    try {
      // Use OpenAI for smart reply
      const reply = await OpenAIService.generateSmartReply(userMessage, {
        agentName: tenantContext.aiPersona?.agentName || 'مساعد مسار العقار',
        availableProperties: matchedProperties,
      })

      return {
        reply,
        suggestions: [],
        shouldCreateLead: true,
        leadData: {},
      }
    } catch (error) {
      console.error('AIService.generateSmartReply error:', error)
      // Fallback to basic reply
      return this.generatePropertyReply(
        this.analyzeMessage(userMessage, tenantContext),
        matchedProperties,
        tenantContext
      )
    }
  }

  /**
   * Generate AI response based on analysis and available properties (fallback)
   */
  static generatePropertyReply(
    analysis: MessageAnalysis,
    matchedProperties: Property[],
    tenantContext: TenantContext
  ): AIResponse {
    const { intent, extractedData } = analysis

    let reply = ''
    const suggestions: string[] = []
    let shouldCreateLead = false
    let leadData: Partial<any> = {}

    // Greeting response
    if (intent === 'greeting') {
      reply = tenantContext.aiPersona?.welcomeMessage || 'السلام عليكم ورحمة الله وبركاته! أهلاً بك في مسار العقار 🏠 كيف يمكنني مساعدتك؟'
      suggestions.push('ابحث عن عقار')
      suggestions.push('اعرض آخر العروض')
    }

    // Search response
    if (intent === 'search' || intent === 'inquire') {
      if (matchedProperties.length === 0) {
        reply = `للأسف لم أجد عقارات تطابق معايير بحثك. الرجاء تحديد المعايير بشكل أدق.`
        suggestions.push('جرب تغيير الميزانية')
        suggestions.push('جرب نوع عقار آخر')
      } else if (matchedProperties.length === 1) {
        const prop = matchedProperties[0]
        reply = `وجدت عقار واحد يطابق معايير بحثك:\n\n🏠 ${prop.title}\n💰 ${prop.price.toLocaleString()} ریال سعودي\n📍 ${prop.location}\n`
        suggestions.push('هل تريد المزيد من التفاصيل؟')
        suggestions.push('هل تريد زيارة العقار؟')
      } else {
        reply = `وجدت ${matchedProperties.length} عقار يطابق معايير بحثك:\n`
        matchedProperties.slice(0, 3).forEach((prop) => {
          reply += `\n🏠 ${prop.title}\n💰 ${prop.price.toLocaleString()} ریال\n`
        })
        if (matchedProperties.length > 3) {
          reply += `\n... و${matchedProperties.length - 3} عقار آخر`
        }
        suggestions.push('اعرض العقار الأول')
        suggestions.push('اعرض المزيد من العقارات')
      }

      shouldCreateLead = true
      leadData = {
        location_interest: extractedData.city,
        budget: extractedData.budget?.max || extractedData.budget?.min,
        property_type_interest: extractedData.propertyType,
        message: `تم البحث عن: ${JSON.stringify(extractedData)}`,
      }
    }

    // Contact/Schedule response
    if (intent === 'schedule' || intent === 'contact') {
      reply =
        'تم استلام طلبك. سيتواصل معك أحد فريقنا في أسرع وقت ممكن.'
      suggestions.push('شكراً')
      shouldCreateLead = true
    }

    // Default response
    if (!reply) {
      reply = `فهمت طلبك: ${extractedData.intent || 'لم أفهم بوضوح'}. كيف يمكنني مساعدتك بشكل أدق؟`
      suggestions.push('ابحث عن عقار')
      suggestions.push('اتصل بنا')
    }

    return {
      reply,
      suggestions,
      shouldCreateLead,
      leadData: shouldCreateLead ? leadData : undefined,
    }
  }

  /**
   * Score property match against search criteria
   * Returns 0-1 score
   */
  static scorePropertyMatch(property: Property, criteria: Record<string, any>): number {
    let score = 0
    let maxScore = 0

    // Type matching (25%)
    if (criteria.propertyType) {
      maxScore += 0.25
      if (property.type === criteria.propertyType) {
        score += 0.25
      }
    } else {
      maxScore += 0.25
      score += 0.125 // Partial credit if no type specified
    }

    // Budget matching (25%)
    if (criteria.budget) {
      maxScore += 0.25
      const { min = 0, max = Infinity } = criteria.budget
      if (property.price >= min && property.price <= max) {
        score += 0.25
      } else if (property.price >= min * 0.8 && property.price <= max * 1.2) {
        score += 0.125 // Partial credit if within 20%
      }
    } else {
      maxScore += 0.25
      score += 0.125
    }

    // Location matching (25%)
    if (criteria.city && property.location.includes(criteria.city)) {
      maxScore += 0.25
      score += 0.25
    } else {
      maxScore += 0.25
      score += 0.05 // Low partial credit
    }

    // Bedrooms matching (15%)
    if (criteria.bedrooms) {
      maxScore += 0.15
      if (property.bedrooms === criteria.bedrooms) {
        score += 0.15
      } else if (Math.abs(property.bedrooms - criteria.bedrooms) === 1) {
        score += 0.075 // Partial credit if ±1 bedroom
      }
    } else {
      maxScore += 0.15
      score += 0.075
    }

    // Area matching (10%)
    if (criteria.area) {
      maxScore += 0.1
      const areaDiff = Math.abs(property.area - criteria.area) / criteria.area
      if (areaDiff < 0.1) {
        score += 0.1 // Exact match
      } else if (areaDiff < 0.3) {
        score += 0.05 // Close match
      }
    } else {
      maxScore += 0.1
      score += 0.05
    }

    return maxScore > 0 ? score / maxScore : 0
  }

  /**
   * Filter and rank properties by relevance
   */
  static rankProperties(
    properties: Property[],
    criteria: Record<string, any>
  ): Array<Property & { relevanceScore: number }> {
    return properties
      .map((prop) => ({
        ...prop,
        relevanceScore: this.scorePropertyMatch(prop, criteria),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
  }
}
