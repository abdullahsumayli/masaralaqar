/**
 * Viewing Request Types — أنواع طلبات المعاينة
 */

export type ViewingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface ViewingRequest {
  id: string;
  officeId: string;
  propertyId: string;
  clientPhone: string;
  clientName: string;
  preferredDate: string | null;
  status: ViewingStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ViewingRequestInput {
  officeId: string;
  propertyId: string;
  clientPhone: string;
  clientName?: string;
  preferredDate?: string;
  notes?: string;
}
