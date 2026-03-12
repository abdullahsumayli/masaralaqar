/**
 * GET /api/whatsapp/qr — Get QR code for user's instance
 * Isolated route: does NOT modify existing whatsapp routes.
 */

import { getQRCode } from "@/lib/getQR";
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

    const result = await getQRCode(userId);
    console.log("[whatsapp/qr] QR fetched for", userId);

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    console.error("[whatsapp/qr] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "خطأ في جلب QR" },
      { status: 500 },
    );
  }
}
