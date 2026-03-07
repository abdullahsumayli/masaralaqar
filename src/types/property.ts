/**
 * Property Types
 * Defines all property-related type interfaces
 */

export type PropertyType = "apartment" | "villa" | "land" | "commercial";
export type PropertyStatus = "available" | "sold" | "rented" | "archived";

export interface Property {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  price: number; // في الريال
  location: string;
  city?: string;
  area: number; // بالمتر المربع
  type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  image_url?: string;
  images?: string[]; // Array of image URLs
  featured: boolean;
  status: PropertyStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyCreateInput {
  title: string;
  description?: string;
  price: number;
  city: string;
  location: string;
  type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
}

export interface PropertySearchFilters {
  city?: string;
  maxPrice?: number;
  minPrice?: number;
  type?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  area?: {
    min?: number;
    max?: number;
  };
  featured?: boolean;
  status?: PropertyStatus;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  relevanceScore?: number[];
}
