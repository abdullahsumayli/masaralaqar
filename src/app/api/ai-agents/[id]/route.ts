/**
 * AI Agent Detail API — تفاصيل وكيل الذكاء الاصطناعي
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { AIAgentService } from "@/services/ai-agent.service";
import { NextRequest, NextResponse } from "next/server";

/** GET: Get AI agent by ID (admin) */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const { id } = await params;
    const agent = await AIAgentService.getAgentById(id);
    if (!agent)
      return NextResponse.json({ error: "الوكيل غير موجود" }, { status: 404 });

    return NextResponse.json({ agent });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** PATCH: Update AI agent by office_id (admin) */
export async function PATCH(
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

    const { id: officeId } = await params;
    const body = await request.json();

    const agent = await AIAgentService.updateAgent(officeId, body);
    if (!agent)
      return NextResponse.json({ error: "فشل في التحديث" }, { status: 500 });

    return NextResponse.json({ agent });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
