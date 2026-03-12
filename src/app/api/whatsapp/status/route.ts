/**
 * GET /api/whatsapp/status — Check WhatsApp connection state
 * Isolated route: does NOT modify existing whatsapp routes.
 */

import { getConnectionState } from "@/lib/evolution";
import { getServerUser } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let userId: string | undefined;

    // Try session first
    const user = await getServerUser();
    if (user) {
      userId = user.id;
    } else {
      // Fallback: query param
      userId = request.nextUrl.searchParams.get("userId") || undefined;
    }

    if (!userId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const result = await getConnectionState(userId);
    console.log("[whatsapp/status] state for", userId, ":", result);

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    console.error("[whatsapp/status] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطأ في جلب الحالة" },
      { status: 500 },
    );
  }
}
