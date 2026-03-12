/**
 * Office Detail API — تفاصيل المكتب
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { OfficeService } from "@/services/office.service";
import { NextRequest, NextResponse } from "next/server";

/** GET: Get office details */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const { id } = await params;
    const details = await OfficeService.getOfficeWithDetails(id);
    if (!details)
      return NextResponse.json({ error: "المكتب غير موجود" }, { status: 404 });

    return NextResponse.json({ office: details });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** PATCH: Update office */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const updated = await OfficeService.updateOffice(id, body);
    if (!updated)
      return NextResponse.json({ error: "فشل في التحديث" }, { status: 500 });

    return NextResponse.json({ office: updated });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** DELETE: Delete office (admin only) */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const { id } = await params;
    const deleted = await OfficeService.deleteOffice(id);
    if (!deleted)
      return NextResponse.json({ error: "فشل في الحذف" }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
