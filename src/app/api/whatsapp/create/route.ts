/**
 * POST /api/whatsapp/create — Ensure WAHA session for user's office (multi-tenant)
 */

import { ensureInstanceExists } from "@/integrations/whatsapp";
import { instanceNameForOffice } from "@/lib/whatsapp-session";
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
    const ok = await ensureInstanceExists(
      instanceName,
      "[whatsapp/create]",
    );
    if (!ok) {
      return NextResponse.json(
        { error: "تعذر إنشاء/تجهيز جلسة WAHA" },
        { status: 502 },
      );
    }

    console.log("[whatsapp/create] session ensured:", instanceName);

    return NextResponse.json({
      success: true,
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
