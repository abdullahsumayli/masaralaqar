import { supabase } from './supabase'

export interface Property {
  id?: string
  type: string // شقة، فيلا، أرض، مكتب
  district: string // المنطقة
  price: number
  area: number // المساحة بالمتر
  description: string
}

export interface AgentPersonality {
  name: string // اسم الوكيل
  style: 'formal' | 'friendly' // رسمي أو ودي
  welcomeMessage: string
}

export interface Agent {
  id?: string
  user_id: string
  // Office Info
  office_name: string
  office_logo_url?: string
  city: string
  whatsapp_number: string
  // Properties
  properties: Property[]
  // Agent Personality
  agent_name: string
  response_style: 'formal' | 'friendly'
  welcome_message: string
  // Webhook
  webhook_url?: string
  webhook_secret?: string
  // Metadata
  onboarding_completed: boolean
  created_at?: string
  updated_at?: string
}

// Generate unique webhook URL
export function generateWebhookUrl(agentId: string): string {
  return `https://api.masaralaqar.com/webhook/${agentId}`
}

// Generate webhook secret
export function generateWebhookSecret(): string {
  return 'whsec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Create or update agent
export async function saveAgent(agentData: Partial<Agent>): Promise<{ data: Agent | null; error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Check if agent exists
    const { data: existing } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existing) {
      // Update existing agent
      const { data, error } = await supabase
        .from('agents')
        .update({
          ...agentData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } else {
      // Create new agent
      const webhookSecret = generateWebhookSecret()
      const { data, error } = await supabase
        .from('agents')
        .insert({
          user_id: user.id,
          ...agentData,
          webhook_secret: webhookSecret,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Generate webhook URL with the new agent ID
      if (data) {
        const webhookUrl = generateWebhookUrl(data.id)
        await supabase
          .from('agents')
          .update({ webhook_url: webhookUrl })
          .eq('id', data.id)
        
        data.webhook_url = webhookUrl
      }

      return { data, error: null }
    }
  } catch (error: any) {
    console.error('Error saving agent:', error)
    return { data: null, error: error.message }
  }
}

// Get current user's agent
export async function getAgent(): Promise<{ data: Agent | null; error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

    return { data, error: null }
  } catch (error: any) {
    console.error('Error getting agent:', error)
    return { data: null, error: error.message }
  }
}

// Mark onboarding as completed
export async function completeOnboarding(): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('agents')
      .update({ 
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (error) throw error

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error completing onboarding:', error)
    return { success: false, error: error.message }
  }
}

// Upload office logo
export async function uploadOfficeLogo(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/logo.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('office-logos')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('office-logos')
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (error: any) {
    console.error('Error uploading logo:', error)
    return { url: null, error: error.message }
  }
}

// Get all agents (admin only)
export async function getAllAgents(): Promise<{ data: Agent[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data: data || [], error: null }
  } catch (error: any) {
    console.error('Error getting all agents:', error)
    return { data: [], error: error.message }
  }
}
