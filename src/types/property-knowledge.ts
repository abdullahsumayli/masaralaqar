/**
 * Property Knowledge Types — المعرفة العقارية
 */

export interface PropertyKnowledge {
  id: string;
  propertyId: string;
  familyScore: number;
  investmentScore: number;
  luxuryScore: number;
  locationSummary: string;
  advantages: string[];
  targetAudience: string[];
  nearbyFacilities: string[];
  aiDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyKnowledgeInput {
  propertyId: string;
  familyScore: number;
  investmentScore: number;
  luxuryScore: number;
  locationSummary: string;
  advantages: string[];
  targetAudience?: string[];
  nearbyFacilities?: string[];
  aiDescription?: string;
}
