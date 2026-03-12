/**
 * Leads List API
 * GET /api/leads/list
 * Returns leads for the authenticated user's tenant
 */

import { supabaseAdmin } from '@/lib/supabase'
import { getServerUser } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's tenant_id
    const { data: userRow } = await supabaseAdmin
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!userRow?.tenant_id) {
      return NextResponse.json({ success: true, leads: [] })
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('id, name, phone, email, status, source, location_interest, budget, property_type_interest, last_contacted_at, created_at, message')
      .eq('tenant_id', userRow.tenant_id)
      .order('last_contacted_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, leads: data || [] })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
