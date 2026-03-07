/**
 * Property Service
 * High-level property operations
 */

import { PropertyRepository } from "@/repositories/property.repo";
import {
    Property,
    PropertySearchFilters,
    PropertySearchResult,
} from "@/types/property";

export class PropertyService {
  /**
   * Search properties with filters
   */
  static async searchProperties(
    tenantId: string,
    filters: PropertySearchFilters,
  ): Promise<PropertySearchResult> {
    try {
      const result = await PropertyRepository.searchProperties(
        tenantId,
        filters,
      );
      const properties = result.properties || [];

      return {
        properties,
        count: properties.length,
        query: filters,
        totalMatches: result.total || properties.length,
      };
    } catch (error) {
      console.error("PropertyService.searchProperties error:", error);
      return {
        properties: [],
        count: 0,
        query: filters,
        totalMatches: 0,
      };
    }
  }

  /**
   * Get single property details
   */
  static async getPropertyDetails(
    tenantId: string,
    propertyId: string,
  ): Promise<Property | null> {
    try {
      const property = await PropertyRepository.getPropertyById(
        tenantId,
        propertyId,
      );

      if (property) {
        // Increment view count
        await PropertyRepository.incrementViews(tenantId, propertyId);
      }

      return property;
    } catch (error) {
      console.error("PropertyService.getPropertyDetails error:", error);
      return null;
    }
  }

  /**
   * Get featured properties
   */
  static async getFeaturedProperties(
    tenantId: string,
    limit: number = 5,
  ): Promise<Property[]> {
    try {
      return await PropertyRepository.getFeaturedProperties(tenantId, limit);
    } catch (error) {
      console.error("PropertyService.getFeaturedProperties error:", error);
      return [];
    }
  }

  /**
   * Get properties by type
   */
  static async getPropertiesByType(
    tenantId: string,
    type: string,
  ): Promise<Property[]> {
    try {
      return await PropertyRepository.getPropertiesByType(tenantId, type);
    } catch (error) {
      console.error("PropertyService.getPropertiesByType error:", error);
      return [];
    }
  }

  /**
   * Format property for display in WhatsApp
   */
  static formatPropertyForChat(property: Property): string {
    return `🏠 *${property.title}*

📍 ${property.location}
💰 ${property.price.toLocaleString()} ریال سعودي
📐 ${property.area} متر مربع
🛏️ ${property.bedrooms} غرفة نوم
🚿 ${property.bathrooms} حمام

الحالة: ${this.getStatusInArabic(property.status)}
المشاهدات: ${property.views_count}

---
*هل تريد المزيد من التفاصيل أو تحديد موعد زيارة؟*`;
  }

  /**
   * Get Arabic status text
   */
  private static getStatusInArabic(status: string): string {
    const statusMap: Record<string, string> = {
      available: "متاح",
      sold: "مباع",
      rented: "مؤجر",
      archived: "مؤرشف",
    };
    return statusMap[status] || status;
  }
}
