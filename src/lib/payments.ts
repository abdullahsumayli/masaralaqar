'use client'

import { supabase } from './supabase'

// Types
export interface SubscriptionPlan {
  id: string
  name: 'free' | 'basic' | 'pro'
  price_sar: number | null
  description: string | null
  features: string[] | null
  max_properties: number | null
  max_leads: number | null
  max_storage_gb: number | null
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string | null
  plan_name: 'free' | 'basic' | 'pro'
  status: 'active' | 'pending' | 'inactive' | 'cancelled'
  started_at: string
  ends_at: string | null
  renewal_date: string | null
  created_at: string
  updated_at: string
}

export interface BankTransfer {
  id: string
  user_id: string
  subscription_id: string | null
  amount_sar: number
  plan_name: string
  status: 'pending' | 'verified' | 'rejected' | 'cancelled'
  payment_method: string
  bank_name?: string
  account_number?: string
  transfer_date?: string
  reference_number?: string
  verified_by?: string | null
  verified_at?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string
  payment_id?: string | null
  subscription_id?: string | null
  invoice_number: string
  amount_sar: number
  description?: string | null
  issued_at: string
  due_date?: string | null
  paid_at?: string | null
  status: 'draft' | 'issued' | 'paid' | 'overdue'
  created_at: string
  updated_at: string
}

// Subscription Plans
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price_sar', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getSubscriptionPlan(planName: string): Promise<SubscriptionPlan | null> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('name', planName)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// User Subscriptions
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function createUserSubscription(
  userId: string,
  planName: string,
  planId?: string | null
): Promise<UserSubscription> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      plan_name: planName,
      status: 'active',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserSubscription(
  subscriptionId: string,
  updates: Partial<UserSubscription>
): Promise<UserSubscription> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Bank Transfers
export async function submitBankTransfer(
  userId: string,
  paymentData: {
    amount_sar: number
    plan_name: string
    bank_name: string
    account_number: string
    transfer_date: string
    reference_number: string
    subscription_id?: string
  }
): Promise<BankTransfer> {
  const { data, error } = await supabase
    .from('bank_transfers')
    .insert({
      user_id: userId,
      ...paymentData,
      status: 'pending',
      payment_method: 'bank_transfer',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserBankTransfers(userId: string): Promise<BankTransfer[]> {
  const { data, error } = await supabase
    .from('bank_transfers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getBankTransfer(transferId: string): Promise<BankTransfer | null> {
  const { data, error } = await supabase
    .from('bank_transfers')
    .select('*')
    .eq('id', transferId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// Admin: Get all transfers
export async function getAllBankTransfers(
  status?: string,
  limit?: number,
  offset?: number
): Promise<{ data: BankTransfer[]; count: number }> {
  let query = supabase.from('bank_transfers').select('*', { count: 'exact' })

  if (status) {
    query = query.eq('status', status)
  }

  if (limit) {
    query = query.limit(limit)
  }

  if (offset) {
    query = query.range(offset, offset + (limit || 10) - 1)
  }

  const { data, error, count } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return { data: data || [], count: count || 0 }
}

// Admin: Verify payment
export async function verifyBankTransfer(
  transferId: string,
  verified: boolean,
  adminId: string,
  notes?: string
): Promise<BankTransfer> {
  const updateData: any = {
    status: verified ? 'verified' : 'rejected',
    verified_by: adminId,
    verified_at: new Date().toISOString(),
  }

  if (notes) {
    updateData.notes = notes
  }

  const { data, error } = await supabase
    .from('bank_transfers')
    .update(updateData)
    .eq('id', transferId)
    .select()
    .single()

  if (error) throw error

  // If verified, activate subscription
  if (verified && data.subscription_id) {
    await updateUserSubscription(data.subscription_id, {
      status: 'active',
    })
  }

  return data
}

// Invoices
export async function createInvoice(
  userId: string,
  invoiceData: {
    amount_sar: number
    description?: string
    due_date?: string
    payment_id?: string
    subscription_id?: string
  }
): Promise<Invoice> {
  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}`

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: userId,
      invoice_number: invoiceNumber,
      ...invoiceData,
      status: 'issued',
      issued_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function markInvoicePaid(invoiceId: string): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Calculate subscription validity
export function isSubscriptionValid(subscription: UserSubscription): boolean {
  if (!subscription) return false
  if (subscription.status !== 'active') return false
  if (!subscription.renewal_date) return true // No expiry

  const renewalDate = new Date(subscription.renewal_date)
  return renewalDate > new Date()
}

// Check if user can use feature based on plan
export function hasFeature(plan: SubscriptionPlan | null, feature: string): boolean {
  if (!plan) return false
  if (!plan.features) return false
  return plan.features.includes(feature)
}

export function canCreateProperties(plan: SubscriptionPlan | null, current: number): boolean {
  if (!plan || !plan.max_properties) return false
  return current < plan.max_properties
}

export function canCreateLeads(plan: SubscriptionPlan | null, current: number): boolean {
  if (!plan || !plan.max_leads) return false
  return current < plan.max_leads
}
