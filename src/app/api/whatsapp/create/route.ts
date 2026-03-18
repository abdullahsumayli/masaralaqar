/**
 * POST /api/whatsapp/create — Create Evolution instance for user's office (multi-tenant)
 */

import { createInstance, instanceNameForOffice } from "@/lib/evolution";
import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    let userId = user?.id;

    if (!userId) {
      const body = await request.json().catch(() => ({}));
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Resolve the user's office
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("office_id")
      .eq("id", userId)
      .single();

    if (!profile?.office_id) {
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );
    }

    const instanceName = instanceNameForOffice(profile.office_id);
    const result = await createInstance(instanceName);
    console.log(
      "[whatsapp/create] instance created:",
      instanceName,
    );

    return NextResponse.json({
      success: true,
      data: result,
      instanceName,
    });
  } catch (err: unknown) {
    console.error("[whatsapp/create] error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "خطأ في إنشاء الاتصال",
      },
      { status: 500 },
    );
  }
}
