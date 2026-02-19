import { supabase } from './supabase'

export interface Lead {
  id?: string
  name: string
  phone: string
  email: string
  subject?: string
  message?: string
  source?: string
  status?: 'new' | 'contacted' | 'trial_started' | 'converted' | 'lost'
  created_at?: string
}

// Create a new lead
export async function createLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<{ data: Lead | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...lead,
        status: 'new',
        source: lead.source || 'website',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error creating lead:', error)
    return { data: null, error: error.message }
  }
}

// Get all leads (admin only)
export async function getAllLeads(): Promise<{ data: Lead[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data: data || [], error: null }
  } catch (error: any) {
    console.error('Error getting leads:', error)
    return { data: [], error: error.message }
  }
}

// Update lead status
export async function updateLeadStatus(id: string, status: Lead['status']): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)

    if (error) throw error

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error updating lead:', error)
    return { success: false, error: error.message }
  }
}

// Check if email already exists
export async function checkExistingLead(email: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single()

    return !!data
  } catch {
    return false
  }
}
