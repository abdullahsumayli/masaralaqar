/**
 * AI Listing Types — أنواع الإعلانات الذكية
 */

export interface AIListing {
  id: string;
  officeId: string;
  propertyId: string;
  title: string;
  marketingDescription: string;
  bulletFeatures: string[];
  targetAudience: string[];
  seoKeywords: string[];
  adCopyShort: string;
  imageAnalysis: ImageAnalysisResult;
  createdAt: string;
  updatedAt: string;
}

export interface AIListingInput {
  officeId: string;
  propertyId: string;
  title: string;
  marketingDescription: string;
  bulletFeatures: string[];
  targetAudience: string[];
  seoKeywords: string[];
  adCopyShort: string;
  imageAnalysis?: ImageAnalysisResult;
}

export interface ImageAnalysisResult {
  hasModernKitchen?: boolean;
  hasBalcony?: boolean;
  hasView?: boolean;
  hasParking?: boolean;
  finishLevel?: "basic" | "standard" | "premium" | "luxury";
  detectedFeatures?: string[];
  analyzed?: boolean;
}

export type ExportFormat =
  | "whatsapp"
  | "twitter"
  | "instagram"
  | "portal"
  | "seo";
