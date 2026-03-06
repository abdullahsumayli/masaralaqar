/**
 * Lead Service
 * High-level lead/customer operations
 */

import { LeadRepository } from '@/repositories/lead.repo'
import { Lead, LeadUpdatePayload, LeadFilter } from '@/types/lead'

export class LeadService {
  /**
   * Create a new lead from WhatsApp message
   */
  static async createLeadFromMessage(
    tenantId: string,
    phone: string,
    name: string,
    message: string,
    source: string = 'whatsapp'
  ): Promise<Lead | null> {
    try {
      // Check if lead already exists
      const existing = await LeadRepository.findLeadByPhone(tenantId, phone)

      if (existing) {
        // Update existing lead
        return await this.addMessageToLead(tenantId, existing.id, message)
      }

      // Create new lead
      const leadData = {
        phone,
        name: name || 'Unknown',
        message,
        source: source as any,
        status: 'new' as any,
        conversation_history: [
          {
            type: 'incoming',
            message,
            timestamp: new Date().toISOString(),
          },
        ],
      }

      return await LeadRepository.createLead(tenantId, leadData)
    } catch (error) {
      console.error('LeadService.createLeadFromMessage error:', error)
      return null
    }
  }

  /**
   * Add message to existing lead conversation
   */
  static async addMessageToLead(
    tenantId: string,
    leadId: string,
    message: string,
    type: 'incoming' | 'outgoing' = 'incoming'
  ): Promise<Lead | null> {
    try {
      const lead = await LeadRepository.getLeadById(tenantId, leadId)

      if (!lead) {
        return null
      }

      const conversationHistory = Array.isArray(lead.conversation_history)
        ? [...lead.conversation_history]
        : []

      conversationHistory.push({
        type,
        message,
        timestamp: new Date().toISOString(),
      })

      const updates: LeadUpdatePayload = {
        conversation_history: conversationHistory as any,
        status: lead.status, // Preserve current status
      }

      return await LeadRepository.updateLead(tenantId, leadId, updates)
    } catch (error) {
      console.error('LeadService.addMessageToLead error:', error)
      return null
    }
  }

  /**
   * Update lead with search criteria
   */
  static async updateLeadPreferences(
    tenantId: string,
    phone: string,
    preferences: {
      city?: string
      budget?: { min?: number; max?: number }
      propertyType?: string
      bedrooms?: number
    }
  ): Promise<Lead | null> {
    try {
      const lead = await LeadRepository.findLeadByPhone(tenantId, phone)

      if (!lead) {
        return null
      }

      const updates: LeadUpdatePayload = {
        location_interest: preferences.city || lead.location_interest,
        budget: preferences.budget?.max || lead.budget,
        property_type_interest: preferences.propertyType || lead.property_type_interest,
        status: lead.status,
      }

      return await LeadRepository.updateLead(tenantId, lead.id, updates)
    } catch (error) {
      console.error('LeadService.updateLeadPreferences error:', error)
      return null
    }
  }

  /**
   * Get all leads for tenant with optional filters
   */
  static async getLeads(tenantId: string, filters?: LeadFilter): Promise<Lead[]> {
    try {
      return await LeadRepository.getLeads(tenantId, filters)
    } catch (error) {
      console.error('LeadService.getLeads error:', error)
      return []
    }
  }

  /**
   * Change lead status
   */
  static async changeLeadStatus(
    tenantId: string,
    leadId: string,
    newStatus: string
  ): Promise<Lead | null> {
    try {
      return await LeadRepository.changeLeadStatus(tenantId, leadId, newStatus)
    } catch (error) {
      console.error('LeadService.changeLeadStatus error:', error)
      return null
    }
  }

  /**
   * Get lead conversation history
   */
  static async getConversation(tenantId: string, leadId: string): Promise<any[] | null> {
    try {
      const lead = await LeadRepository.getLeadById(tenantId, leadId)

      if (!lead) {
        return null
      }

      return Array.isArray(lead.conversation_history) ? lead.conversation_history : []
    } catch (error) {
      console.error('LeadService.getConversation error:', error)
      return null
    }
  }

  /**
   * Get leads by status
   */
  static async getLeadsByStatus(tenantId: string, status: string): Promise<Lead[]> {
    try {
      return await LeadRepository.getLeads(tenantId, { status: status as any })
    } catch (error) {
      console.error('LeadService.getLeadsByStatus error:', error)
      return []
    }
  }
}
