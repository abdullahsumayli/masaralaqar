/**
 * Tenant-Office Compatibility Layer
 *
 * The system historically used "tenant_id" to represent offices/organizations.
 * The modern system uses "office_id", but the database still has tenant_id columns.
 *
 * This module provides helpers to resolve between the two systems:
 * - office_id is the canonical identifier (offices table)
 * - tenant_id is the legacy identifier (tenants table)
 * - offices.legacy_tenant_id links them together
 *
 * Usage: When looking up data, always query with both:
 *   .or(`office_id.eq.${id},tenant_id.eq.${id}`)
 */

import { supabaseAdmin } from "@/lib/supabase";

/**
 * Resolve an office_id from either an office_id or a tenant_id.
 * Returns the canonical office_id, or null if not found.
 */
export async function resolveOfficeId(
  idOrTenantId: string,
): Promise<string | null> {
  // First, try direct lookup as office_id
  const { data: office } = await supabaseAdmin
    .from("offices")
    .select("id")
    .eq("id", idOrTenantId)
    .single();

  if (office) return office.id;

  // Try legacy_tenant_id mapping
  const { data: legacyOffice } = await supabaseAdmin
    .from("offices")
    .select("id")
    .eq("legacy_tenant_id", idOrTenantId)
    .single();

  if (legacyOffice) return legacyOffice.id;

  return null;
}

/**
 * Resolve a tenant_id from an office_id (for backward-compatible queries).
 */
export async function resolveTenantId(
  officeId: string,
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("offices")
    .select("legacy_tenant_id")
    .eq("id", officeId)
    .single();

  return data?.legacy_tenant_id || officeId;
}

/**
 * Build a Supabase OR filter that matches both office_id and tenant_id columns.
 * Use this when querying tables that may have data under either identifier.
 */
export function dualIdFilter(id: string): string {
  return `office_id.eq.${id},tenant_id.eq.${id}`;
}
