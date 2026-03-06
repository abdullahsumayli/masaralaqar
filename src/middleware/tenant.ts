/**
 * Tenant Middleware
 * Attaches tenant context to requests
 */

import { NextRequest, NextResponse } from 'next/server'
import { TenantService } from '@/services/tenant.service'

/**
 * Middleware to extract tenant information from request
 */
export async function withTenantContext(request: NextRequest, tenantId?: string) {
  try {
    // Try to get tenant ID from multiple sources
    let finalTenantId = tenantId

    // 1. From header
    if (!finalTenantId) {
      finalTenantId = request.headers.get('x-tenant-id') || undefined
    }

    // 2. From query parameter
    if (!finalTenantId) {
      finalTenantId = request.nextUrl.searchParams.get('tenantId') || undefined
    }

    // 3. From webhook secret (for WhatsApp)
    if (!finalTenantId) {
      const secret = request.nextUrl.searchParams.get('secret')
      if (secret) {
        const tenant = await TenantService.getTenantByWebhook(secret)
        if (tenant) {
          finalTenantId = tenant.id
        }
      }
    }

    if (!finalTenantId) {
      return {
        error: 'Unable to determine tenant',
        status: 400,
      }
    }

    // Fetch tenant information
    const tenant = await TenantService.getTenantById(finalTenantId)

    if (!tenant) {
      return {
        error: 'Tenant not found',
        status: 404,
      }
    }

    return {
      tenant,
      tenantId: finalTenantId,
      error: null,
    }
  } catch (error) {
    console.error('Tenant middleware error:', error)
    return {
      error: 'Middleware error',
      status: 500,
    }
  }
}

/**
 * Helper to attach tenant to response
 */
export function attachTenantContext(response: NextResponse, tenantId: string): NextResponse {
  response.headers.set('x-tenant-id', tenantId)
  return response
}
