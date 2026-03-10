/**
 * Unanswered Question Detail API
 * PATCH  /api/unanswered-questions/:id   { answer: string }
 * DELETE /api/unanswered-questions/:id   -> status = ignored
 */

import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { OfficeService } from "@/services/office.service";
import { UnansweredQuestionsRepo } from "@/repositories/unanswered-questions.repo";
import { NextRequest, NextResponse } from "next/server";

async function assertOwnership(userId: string, id: string): Promise<{
  ok: boolean;
  officeId?: string;
  error?: NextResponse;
}> {
  const office = await OfficeService.getOfficeByUserId(userId);
  if (!office) {
    return {
      ok: false,
      error: NextResponse.json(
        { error: "لم يتم العثور على مكتب مرتبط بالحساب" },
        { status: 404 },
      ),
    };
  }

  const { data, error } = await supabaseAdmin
    .from("unanswered_questions")
    .select("id, office_id")
    .eq("id", id)
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: NextResponse.json({ error: "السؤال غير موجود" }, { status: 404 }),
    };
  }

  if ((data.office_id as string) !== office.id) {
    return {
      ok: false,
      error: NextResponse.json({ error: "غير مصرح" }, { status: 403 }),
    };
  }

  return { ok: true, officeId: office.id };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const { id } = await params;
    const ownership = await assertOwnership(user.id, id);
    if (!ownership.ok) return ownership.error!;

    const body = await request.json().catch(() => ({}));
    const answer = (body?.answer as string | undefined) ?? "";

    if (!answer.trim()) {
      return NextResponse.json({ error: "نص الإجابة مطلوب" }, { status: 400 });
    }

    const ok = await UnansweredQuestionsRepo.addAnswer(id, answer.trim());
    if (!ok) {
      return NextResponse.json({ error: "فشل في حفظ الإجابة" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/unanswered-questions/[id] failed:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const { id } = await params;
    const ownership = await assertOwnership(user.id, id);
    if (!ownership.ok) return ownership.error!;

    const ok = await UnansweredQuestionsRepo.ignore(id);
    if (!ok) {
      return NextResponse.json({ error: "فشل في تجاهل السؤال" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/unanswered-questions/[id] failed:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

