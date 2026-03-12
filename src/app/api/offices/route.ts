/**
 * Offices API — إدارة المكاتب العقارية
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { OfficeService } from "@/services/office.service";
import { NextRequest, NextResponse } from "next/server";

/** GET: List offices (admin) or get current user's office */
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);

    if (profile?.role === "admin") {
      const offices = await OfficeService.getAllOffices();
      return NextResponse.json({ offices });
    }

    // Regular user: return their office
    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office) return NextResponse.json({ office: null });

    const details = await OfficeService.getOfficeWithDetails(office.id);
    return NextResponse.json({ office: details });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: Create a new office */
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body = await request.json();
    const { officeName, ownerName, email, phone, city } = body;

    if (!officeName) {
      return NextResponse.json({ error: "اسم المكتب مطلوب" }, { status: 400 });
    }

    const office = await OfficeService.createOffice({
      officeName,
      ownerName,
      email,
      phone,
      city,
    });
    if (!office) {
      return NextResponse.json(
        { error: "فشل في إنشاء المكتب" },
        { status: 500 },
      );
    }

    // Link user to office
    await OfficeService.linkUserToOffice(user.id, office.id);

    return NextResponse.json({ office }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
