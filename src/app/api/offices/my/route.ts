/**
 * GET /api/offices/my
 * Returns the current user's office info (id, name, etc.)
 * Used by client components that need the real officeId
 */

import { getServerUser } from "@/lib/supabase-server";
import { OfficeService } from "@/services/office.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office) {
      return NextResponse.json({ error: "لا يوجد مكتب مرتبط بهذا الحساب" }, { status: 404 });
    }

    return NextResponse.json({ success: true, office });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
