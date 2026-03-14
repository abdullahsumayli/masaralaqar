/**
 * Bot integration utilities
 * Handles phone validation, formatting, and bot-related operations
 */

/**
 * Validates if phone number is in Saudi format (966 + 9 digits)
 * @param phone - Phone number to validate
 * @returns true if valid Saudi format
 */
export function isValidSaudiPhone(phone: string): boolean {
  // Remove spaces and special characters
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's exactly 12 digits starting with 966
  if (cleaned.length !== 12 || !cleaned.startsWith('966')) {
    return false;
  }

  // Check if remaining 9 digits are valid
  const remaining = cleaned.slice(3);
  return /^\d{9}$/.test(remaining);
}

/**
 * Formats phone number to standard Saudi format (966XXXXXXXXX)
 * Accepts various formats like 05XXXXXXXXX, 5XXXXXXXXX, 00966XXXXXXXXX, etc.
 * @param phone - Phone number to format
 * @returns Formatted phone in 966XXXXXXXXX format or original if invalid
 */
export function formatSaudiPhone(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // If starts with 00966, remove 00
  if (cleaned.startsWith('00966')) {
    cleaned = cleaned.slice(2);
  }
  // If starts with +966, it's already in international format
  else if (phone.startsWith('+966')) {
    cleaned = '966' + cleaned.slice(1);
  }
  // If starts with 05, replace 0 with 966
  else if (cleaned.startsWith('05')) {
    cleaned = '966' + cleaned.slice(1);
  }
  // If starts with 5, add 966
  else if (cleaned.startsWith('5') && cleaned.length === 9) {
    cleaned = '966' + cleaned;
  }
  // If doesn't start with 966, add it
  else if (!cleaned.startsWith('966')) {
    cleaned = '966' + cleaned;
  }

  // Validate final format
  if (isValidSaudiPhone(cleaned)) {
    return cleaned;
  }

  // Return original if formatting failed
  return phone;
}

/**
 * Get bot WhatsApp link for a phone number
 * @param botPhone - Bot phone number in format 966XXXXXXXXX
 * @param message - Optional pre-filled message
 * @returns WhatsApp link
 */
export function getBotWhatsAppLink(botPhone: string, message?: string): string {
  const baseUrl = `https://wa.me/${botPhone}`;
  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}?text=${encodedMessage}`;
  }
  return baseUrl;
}

/**
 * Get plan monthly chat limit
 * @param planType - Plan type (free, basic, pro)
 * @returns Number of chats allowed per month
 */
export function getPlanChatLimit(
  planType: 'free' | 'basic' | 'pro'
): number {
  const limits: Record<'free' | 'basic' | 'pro', number> = {
    free: 10,
    basic: 100,
    pro: -1, // unlimited
  };
  return limits[planType];
}

/**
 * Get plan price in SAR
 * @param planType - Plan type (free, basic, pro)
 * @returns Price in SAR
 */
export function getPlanPrice(planType: 'free' | 'basic' | 'pro'): number {
  const prices: Record<'free' | 'basic' | 'pro', number> = {
    free: 0,
    basic: 99,
    pro: 299,
  };
  return prices[planType];
}

/**
 * Get human-readable plan name in Arabic
 * @param planType - Plan type (free, basic, pro)
 * @returns Arabic plan name
 */
export function getPlanNameArabic(planType: 'free' | 'basic' | 'pro'): string {
  const names: Record<'free' | 'basic' | 'pro', string> = {
    free: 'مجاني',
    basic: 'أساسي',
    pro: 'احترافي',
  };
  return names[planType];
}

/**
 * Check if a phone number is formatted correctly for the bot API
 * @param phone - Phone number to check
 * @returns true if correctly formatted (966XXXXXXXXX)
 */
export function isBotPhoneFormatted(phone: string): boolean {
  return /^966\d{9}$/.test(phone);
}

/**
 * Get default message for WhatsApp based on plan
 * @param planType - Plan type (free, basic, pro)
 * @returns Default message in Arabic
 */
export function getDefaultWhatsAppMessage(
  planType: 'free' | 'basic' | 'pro'
): string {
  const messages: Record<'free' | 'basic' | 'pro', string> = {
    free: 'مرحبا، أود الاشتراك في الخطة المجانية',
    basic: 'مرحبا، أود الاشتراك في الخطة الأساسية',
    pro: 'مرحبا، أود الاشتراك في الخطة الاحترافية',
  };
  return messages[planType];
}
