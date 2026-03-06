/**
 * Property Create API
 * POST /api/properties/create
 */

import { supabase } from '@/lib/supabase'
import { PropertyCreateInput } from '@/types/property'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      price,
      city,
      location,
      type,
      bedrooms,
      bathrooms,
      area,
      images,
      tenant_id,
    } = body as PropertyCreateInput & { tenant_id?: string }

    // Validate required fields
    if (!title || !price || !city || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price, city, type' },
        { status: 400 }
      )
    }

    // Use default tenant if not specified
    const tenantId = tenant_id || 'default'

    // Create property record
    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
          tenant_id: tenantId,
          title,
          description: description || '',
          price,
          city,
          location: location || city,
          type,
          bedrooms: bedrooms || null,
          bathrooms: bathrooms || null,
          area: area || null,
          images: images || [],
          status: 'available',
          featured: false,
          views_count: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Property creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create property', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      property_id: data.id,
      property: data,
    })
  } catch (error: any) {
    console.error('Property create API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
