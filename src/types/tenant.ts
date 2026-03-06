/**
 * Tenant Types
 * Defines all tenant/organization related types
 */

export interface Tenant {
  id: string
  name: string
  officeName: string
  whatsappNumber: string
  webhookSecret: string
  webhookUrl?: string
  aiPersona: {
    agentName: string
    responseStyle: 'formal' | 'friendly'
    welcomeMessage: string
  }
  openaiApiKey?: string // Should be encrypted
  createdAt: string
  updatedAt: string
}

export interface TenantConfig {
  tenantId: string
  whatsappNumber: string
  webhookSecret: string
  aiPersona: {
    agentName: string
    responseStyle: 'formal' | 'friendly'
    welcomeMessage: string
  }
}
