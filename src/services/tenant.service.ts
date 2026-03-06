/**
 * Tenant Service
 * Tenant configuration and management
 */

import { TenantRepository } from '@/repositories/tenant.repo'
import { Tenant } from '@/types/tenant'

export class TenantService {
  /**
   * Get tenant by ID
   */
  static async getTenantById(tenantId: string): Promise<Tenant | null> {
    try {
      return await TenantRepository.getTenantById(tenantId)
    } catch (error) {
      console.error('TenantService.getTenantById error:', error)
      return null
    }
  }

  /**
   * Get tenant by WhatsApp number
   * Used to route incoming messages to correct tenant
   */
  static async getTenantByPhone(phone: string): Promise<Tenant | null> {
    try {
      return await TenantRepository.getTenantByPhone(phone)
    } catch (error) {
      console.error('TenantService.getTenantByPhone error:', error)
      return null
    }
  }

  /**
   * Get tenant by webhook secret
   * Used to authenticate webhook requests from WhatsApp
   */
  static async getTenantByWebhook(secret: string): Promise<Tenant | null> {
    try {
      return await TenantRepository.getTenantByWebhook(secret)
    } catch (error) {
      console.error('TenantService.getTenantByWebhook error:', error)
      return null
    }
  }

  /**
   * Get tenant configuration
   */
  static async getTenantConfig(tenantId: string): Promise<any | null> {
    try {
      const tenant = await TenantRepository.getTenantById(tenantId)

      if (!tenant) {
        return null
      }

      return {
        id: tenant.id,
        whatsappNumber: tenant.whatsappNumber,
        aiPersona: tenant.aiPersona || {
          greeting: 'السلام عليكم ورحمة الله وبركاته',
          style: 'professional',
        },
        timezone: 'Asia/Riyadh',
      }
    } catch (error) {
      console.error('TenantService.getTenantConfig error:', error)
      return null
    }
  }

  /**
   * Update tenant configuration
   */
  static async updateTenantConfig(
    tenantId: string,
    updates: Partial<Tenant>
  ): Promise<Tenant | null> {
    try {
      return await TenantRepository.updateTenant(tenantId, updates)
    } catch (error) {
      console.error('TenantService.updateTenantConfig error:', error)
      return null
    }
  }

  /**
   * Verify webhook signature
   * Used to validate messages from WhatsApp Cloud API
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      // This is a placeholder - real implementation would use HMAC-SHA256
      // const crypto = require('crypto')
      // const expectedSignature = crypto
      //   .createHmac('sha256', secret)
      //   .update(payload)
      //   .digest('hex')
      // return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))

      // For now, just check if signature format is valid
      return signature && signature.length > 0
    } catch (error) {
      console.error('TenantService.verifyWebhookSignature error:', error)
      return false
    }
  }

  /**
   * Get tenant statistics
   */
  static async getTenantStats(tenantId: string): Promise<any> {
    try {
      const tenant = await TenantRepository.getTenantById(tenantId)

      if (!tenant) {
        return null
      }

      // Placeholder - would fetch real stats from database
      return {
        tenantId,
        totalProperties: 0,
        totalLeads: 0,
        activeLeads: 0,
        convertedLeads: 0,
        mesagesProcessed: 0,
      }
    } catch (error) {
      console.error('TenantService.getTenantStats error:', error)
      return null
    }
  }
}
