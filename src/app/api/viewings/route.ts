/**
 * Viewings API — طلبات المعاينة
 * GET  /api/viewings — قائمة طلبات المعاينة للمكتب
 * POST /api/viewings — إنشاء طلب معاينة أو تحديث حالته
 */

import { ViewingRepository } from "@/repositories/viewing.repo";
import type { ViewingStatus } from "@/types/viewing";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const officeId = searchParams.get("officeId");
    const status = searchParams.get("status") as ViewingStatus | null;

    if (!officeId) {
      return NextResponse.json(
        { success: false, error: "officeId مطلوب" },
        { status: 400 },
      );
    }

    const viewings = await ViewingRepository.getOfficeViewings(
      officeId,
      status || undefined,
    );

    return NextResponse.json({ success: true, viewings });
  } catch (error) {
    console.error("[Viewings GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في جلب طلبات المعاينة" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "updateStatus") {
      return handleUpdateStatus(body);
    }

    // Default: create viewing request
    return handleCreate(body);
  } catch (error) {
    console.error("[Viewings POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في العملية" },
      { status: 500 },
    );
  }
}

async function handleCreate(body: {
  officeId?: string;
  propertyId?: string;
  clientPhone?: string;
  clientName?: string;
  preferredDate?: string;
  notes?: string;
}) {
  const {
    officeId,
    propertyId,
    clientPhone,
    clientName,
    preferredDate,
    notes,
  } = body;

  if (!officeId || !propertyId || !clientPhone) {
    return NextResponse.json(
      { success: false, error: "officeId, propertyId, clientPhone مطلوبة" },
      { status: 400 },
    );
  }

  const viewing = await ViewingRepository.createViewingRequest({
    officeId,
    propertyId,
    clientPhone,
    clientName,
    preferredDate,
    notes,
  });

  if (!viewing) {
    return NextResponse.json(
      { success: false, error: "فشل في إنشاء طلب المعاينة" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, viewing });
}

async function handleUpdateStatus(body: {
  id?: string;
  status?: ViewingStatus;
  notes?: string;
}) {
  const { id, status, notes } = body;

  if (!id || !status) {
    return NextResponse.json(
      { success: false, error: "id و status مطلوبان" },
      { status: 400 },
    );
  }

  const validStatuses: ViewingStatus[] = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { success: false, error: "حالة غير صالحة" },
      { status: 400 },
    );
  }

  const viewing = await ViewingRepository.updateViewingStatus(
    id,
    status,
    notes,
  );

  if (!viewing) {
    return NextResponse.json(
      { success: false, error: "فشل في تحديث حالة المعاينة" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, viewing });
}
