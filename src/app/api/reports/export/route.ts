/**
 * Report Export API — تصدير التقارير بصيغة PDF
 */

import { getServerUser } from "@/lib/supabase-server";
import { OfficeService } from "@/services/office.service";
import { generateReport, ReportType } from "@/services/report.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office) {
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as ReportType | null;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    if (!type || !["leads", "properties", "monthly"].includes(type)) {
      return NextResponse.json(
        { error: "نوع التقرير مطلوب: leads | properties | monthly" },
        { status: 400 },
      );
    }

    const pdf = await generateReport({
      officeId: office.id,
      officeName: office.officeName || "مكتب",
      type,
      from,
      to,
    });

    const filename = `masar_${type}_report_${new Date().toISOString().split("T")[0]}.pdf`;

    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
