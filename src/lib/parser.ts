/**
 * Parser Utilities
 * Extract structured data from natural language messages
 */

/**
 * Extract city/location from message
 * Handles Saudi cities and regions
 */
export function extractCity(message: string): string | null {
  const cities = [
    'الرياض',
    'جدة',
    'الدمام',
    'الخبر',
    'الكويت',
    'المدينة',
    'مكة',
    'تبوك',
    'الأحساء',
    'القصيم',
    'حائل',
    'نجران',
    'جازان',
    'عسير',
    'الباحة',
    'riyadh',
    'jeddah',
    'dammam',
    'khobar',
    'medina',
    'mecca',
  ]

  const lowerMsg = message.toLowerCase()
  for (const city of cities) {
    if (lowerMsg.includes(city.toLowerCase())) {
      return city
    }
  }

  return null
}

/**
 * Extract budget range from message
 * Handles various formats: "500,000", "500 ألف", "مليون", etc.
 */
export function extractBudget(message: string): {
  min?: number
  max?: number
} | null {
  const budgetPatterns = [
    // English format: "500000", "500,000"
    /(\d{1,3}(?:,\d{3})*|\d+)\s*(?:sr|sar|ریال)?/gi,
    // Arabic: "500 ألف" = 500,000
    /(\d+)\s*ألف/gi,
    // Arabic: "مليون" = 1,000,000
    /(\d+)\s*مليون/gi,
  ]

  const numbers: number[] = []

  for (const pattern of budgetPatterns) {
    let match
    while ((match = pattern.exec(message)) !== null) {
      let num = parseInt(match[1].replace(/,/g, ''), 10)

      // If pattern includes "ألف" multiply by 1000
      if (message.includes('ألف')) {
        num *= 1000
      }
      // If pattern includes "مليون" multiply by 1,000,000
      if (message.includes('مليون')) {
        num *= 1000000
      }

      if (num > 0) {
        numbers.push(num)
      }
    }
  }

  if (numbers.length === 0) {
    return null
  }

  if (numbers.length === 1) {
    return { min: numbers[0] }
  }

  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
  }
}

/**
 * Extract property type from message
 * Handles various property categories
 */
export function extractPropertyType(message: string): string | null {
  const types: Record<string, string[]> = {
    apartment: [
      'شقة',
      'apartment',
      'flat',
      'unit',
      'suite',
      'وحدة',
      'مسكن',
    ],
    villa: ['فيلا', 'villa', 'house', 'منزل', 'دار', 'بيت'],
    land: [
      'أرض',
      'land',
      'قطعة',
      'terreno',
      'terrain',
      'بلد',
    ],
    commercial: [
      'تجاري',
      'commercial',
      'shop',
      'محل',
      'مكتب',
      'office',
      'مستودع',
      'warehouse',
    ],
  }

  const lowerMsg = message.toLowerCase()

  for (const [type, keywords] of Object.entries(types)) {
    for (const keyword of keywords) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        return type
      }
    }
  }

  return null
}

/**
 * Extract number of bedrooms from message
 */
export function extractBedrooms(message: string): number | null {
  // Patterns: "3 غرف", "3 bedrooms", "3 BR"
  const patterns = [
    /(\d+)\s*(?:غرف|غرفة|bedrooms?|br|beds?)/gi,
    /(\d+)\s*bedroom/gi,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(message)
    if (match) {
      return parseInt(match[1], 10)
    }
  }

  return null
}

/**
 * Extract area/size from message
 * Returns area in square meters
 */
export function extractArea(message: string): number | null {
  // Patterns: "200 متر", "200m", "2000 sq ft"
  const patterns = [
    /(\d+)\s*(?:متر|م|sqm|m²|square meters)/gi,
    /(\d+)\s*(?:sqft|square feet)/gi,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(message)
    if (match) {
      let area = parseInt(match[1], 10)
      // Convert sqft to sqm if needed
      if (message.toLowerCase().includes('sqft') || message.toLowerCase().includes('square feet')) {
        area = Math.round(area / 10.764) // 1 sqft = 0.092903 sqm
      }
      return area
    }
  }

  return null
}

/**
 * Detect message intent
 * Classify user intent from message
 */
export function detectIntent(message: string): string {
  const intents: Record<string, string[]> = {
    search: [
      'ابحث',
      'أبحث',
      'أريد',
      'أبحث عن',
      'search',
      'looking for',
      'find',
      'اظهر',
      'عرض',
    ],
    inquire: [
      'معلومات',
      'تفاصيل',
      'details',
      'information',
      'خبرني',
      'اخبرني',
    ],
    schedule: [
      'حجز',
      'موعد',
      'appointment',
      'visit',
      'زيارة',
      'اجتماع',
    ],
    contact: [
      'اتصل',
      'رقم',
      'من',
      'call',
      'contact',
      'phone',
      'اضافة',
      'add',
    ],
    greeting: [
      'السلام',
      'مرحبا',
      'hello',
      'hi',
      'صباح',
      'مساء',
    ],
  }

  const lowerMsg = message.toLowerCase()

  for (const [intent, keywords] of Object.entries(intents)) {
    for (const keyword of keywords) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        return intent
      }
    }
  }

  return 'general'
}

/**
 * Clean and normalize message
 */
export function normalizeMessage(message: string): string {
  return message
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s\u0600-\u06FF]/g, '') // Remove special chars except Arabic
}

/**
 * Extract phone number from message
 * Handles Saudi phone formats
 */
export function extractPhone(message: string): string | null {
  // Saudi phone patterns: 0501234567, 00966501234567, +966501234567
  const patterns = [
    /(?:\+966|00966|0)?([5-9]\d{8})/,
    /(\+?966\d{9})/,
    /(0\d{9})/,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(message)
    if (match) {
      const phone = match[1] || match[0]
      // Normalize to 0501234567 format
      return phone.startsWith('0') ? phone : `0${phone.slice(-9)}`
    }
  }

  return null
}
