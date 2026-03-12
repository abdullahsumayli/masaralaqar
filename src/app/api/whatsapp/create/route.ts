/**
 * POST /api/whatsapp/create — Create Evolution instance for user
 * Isolated route: does NOT modify existing whatsapp routes.
 */

import { createInstance } from "@/lib/evolution";
import { getServerUser } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let userId: string | undefined;

    // Try session first
    const user = await getServerUser();
    if (user) {
      userId = user.id;
    } else {
      // Fallback: read from body
      const body = await request.json().catch(() => ({}));
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const result = await createInstance(userId);
    console.log("[whatsapp/create] instance created for", userId);

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    console.error("[whatsapp/create] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطأ في إنشاء الاتصال" },
      { status: 500 },
    );
  }
}
