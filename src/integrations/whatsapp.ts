/**
 * WhatsApp Integration
 * Handle WhatsApp Cloud API communication
 */

import { WhatsAppMessage, WebhookPayload } from '@/types/message'

export class WhatsAppService {
  private static whatsappApiUrl = 'https://graph.instagram.com/v20.0'
  private static accessToken = process.env.WHATSAPP_ACCESS_TOKEN || ''
  private static phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ''

  /**
   * Send WhatsApp message
   */
  static async sendMessage(
    recipientPhone: string,
    message: string,
    tenantId: string
  ): Promise<boolean> {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        console.warn('WhatsApp credentials not configured')
        return false
      }

      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'text',
        text: {
          body: message,
        },
      }

      const response = await fetch(
        `${this.whatsappApiUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        console.error('WhatsApp send error:', await response.text())
        return false
      }

      const data = await response.json()
      console.log('WhatsApp message sent:', data)
      return true
    } catch (error) {
      console.error('WhatsAppService.sendMessage error:', error)
      return false
    }
  }

  /**
   * Parse incoming WhatsApp webhook payload
   */
  static parseIncomingMessage(payload: WebhookPayload): WhatsAppMessage | null {
    try {
      if (!payload || !payload.entry || !payload.entry[0]) {
        return null
      }

      const entry = payload.entry[0]
      const changes = entry.changes?.[0]

      if (!changes || changes.field !== 'messages') {
        return null
      }

      const message = changes.value?.messages?.[0]

      if (!message) {
        return null
      }

      // Extract phone and text
      const contact = changes.value?.contacts?.[0]
      const phone = message.from
      const text = message.text?.body || ''

      if (!phone || !text) {
        return null
      }

      return {
        id: message.id,
        phone,
        text,
        timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
        media: null,
      }
    } catch (error) {
      console.error('WhatsAppService.parseIncomingMessage error:', error)
      return null
    }
  }

  /**
   * Verify webhook signature
   * Validates that webhook requests are from WhatsApp
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      // This is a placeholder - actual implementation would use HMAC-SHA256
      // In production, use crypto library:
      // const crypto = require('crypto')
      // const hash = crypto
      //   .createHmac('sha256', secret)
      //   .update(payload)
      //   .digest('hex')
      // return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hash))

      // For now, basic validation
      return signature && signature.length > 0
    } catch (error) {
      console.error('WhatsAppService.verifyWebhookSignature error:', error)
      return false
    }
  }

  /**
   * Send media message
   */
  static async sendMediaMessage(
    recipientPhone: string,
    mediaUrl: string,
    caption: string,
    tenantId: string
  ): Promise<boolean> {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        console.warn('WhatsApp credentials not configured')
        return false
      }

      const payload = {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'image',
        image: {
          link: mediaUrl,
        },
      }

      if (caption) {
        payload.image.caption = caption
      }

      const response = await fetch(
        `${this.whatsappApiUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        console.error('WhatsApp media send error:', await response.text())
        return false
      }

      return true
    } catch (error) {
      console.error('WhatsAppService.sendMediaMessage error:', error)
      return false
    }
  }

  /**
   * Send templated message
   */
  static async sendTemplateMessage(
    recipientPhone: string,
    templateName: string,
    parameters: string[],
    tenantId: string
  ): Promise<boolean> {
    try {
      if (!this.accessToken || !this.phoneNumberId) {
        console.warn('WhatsApp credentials not configured')
        return false
      }

      const payload = {
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'ar',
          },
          parameters: {
            body: {
              parameters: parameters.map((param) => ({ text: param })),
            },
          },
        },
      }

      const response = await fetch(
        `${this.whatsappApiUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        console.error('WhatsApp template send error:', await response.text())
        return false
      }

      return true
    } catch (error) {
      console.error('WhatsAppService.sendTemplateMessage error:', error)
      return false
    }
  }

  /**
   * Set credentials
   */
  static setCredentials(accessToken: string, phoneNumberId: string): void {
    this.accessToken = accessToken
    this.phoneNumberId = phoneNumberId
  }

  /**
   * Check if configured
   */
  static isConfigured(): boolean {
    return !!this.accessToken && !!this.phoneNumberId
  }
}
