/**
 * Lead Types
 * Defines all lead/customer-related type interfaces
 */

export type LeadSource = 'website' | 'whatsapp' | 'instagram' | 'email' | 'referral'
export type LeadStatus = 'new' | 'contacted' | 'interested' | 'negotiating' | 'converted' | 'lost'

export interface Lead {
  id: string
  tenant_id: string
  phone: string
  name: string
  email?: string
  location_interest?: string
  budget?: number
  property_type_interest?: string
  message: string
  source: LeadSource
  status: LeadStatus
  conversation_history?: ConversationMessage[]
  last_contacted_at?: string
  created_at: string
  updated_at: string
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  message: string
  timestamp: string
}

export interface LeadUpdatePayload {
  status?: LeadStatus
  phone?: string
  name?: string
  email?: string
  location_interest?: string
  budget?: number
  property_type_interest?: string
  conversation_history?: ConversationMessage[]
  last_contacted_at?: string
}

export interface LeadFilter {
  status?: LeadStatus
  source?: LeadSource
  startDate?: string
  endDate?: string
}
