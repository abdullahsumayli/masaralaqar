/**
 * Property Repository
 * Handles all property database operations
 */

import { supabase } from '@/lib/supabase'
import { Property, PropertySearchFilters, PropertySearchResult } from '@/types/property'

export class PropertyRepository {
  /**
   * Search properties by filters
   */
  static async searchProperties(
    tenantId: string,
    filters: PropertySearchFilters
  ): Promise<PropertySearchResult> {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', 'available')

      // Apply filters
      if (filters.city) {
        query = query.ilike('location', `%${filters.city}%`)
      }

      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms)
      }

      if (filters.featured) {
        query = query.eq('featured', true)
      }

      const { data, error, count } = await query.limit(10)

      if (error) {
        console.error('Property search error:', error)
        return { properties: [], total: 0 }
      }

      return {
        properties: (data || []) as Property[],
        total: count || 0,
      }
    } catch (error) {
      console.error('PropertyRepository.searchProperties error:', error)
      return { properties: [], total: 0 }
    }
  }

  /**
   * Get property details by ID
   */
  static async getPropertyById(tenantId: string, propertyId: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('tenant_id', tenantId)
        .single()

      if (error) {
        console.error('Property fetch error:', error)
        return null
      }

      return data as Property
    } catch (error) {
      console.error('PropertyRepository.getPropertyById error:', error)
      return null
    }
  }

  /**
   * Get featured properties
   */
  static async getFeaturedProperties(tenantId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('featured', true)
        .eq('status', 'available')
        .limit(5)

      if (error) {
        console.error('Featured properties fetch error:', error)
        return []
      }

      return data as Property[]
    } catch (error) {
      console.error('PropertyRepository.getFeaturedProperties error:', error)
      return []
    }
  }

  /**
   * Increment property view count
   */
  static async incrementViews(tenantId: string, propertyId: string): Promise<boolean> {
    try {
      const property = await this.getPropertyById(tenantId, propertyId)
      if (!property) return false

      const { error } = await supabase
        .from('properties')
        .update({
          views_count: (property.views_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId)
        .eq('tenant_id', tenantId)

      if (error) {
        console.error('View increment error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('PropertyRepository.incrementViews error:', error)
      return false
    }
  }

  /**
   * Get properties by type
   */
  static async getPropertiesByType(
    tenantId: string,
    type: string
  ): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('type', type)
        .eq('status', 'available')
        .limit(10)

      if (error) {
        console.error('Properties by type fetch error:', error)
        return []
      }

      return data as Property[]
    } catch (error) {
      console.error('PropertyRepository.getPropertiesByType error:', error)
      return []
    }
  }
}
