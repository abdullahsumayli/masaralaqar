/**
 * Unanswered Questions API
 * GET  /api/unanswered-questions?status=pending
 * POST /api/unanswered-questions
 */

import { getCurrentUser } from "@/lib/auth";
import { OfficeService } from "@/services/office.service";
import {
  UnansweredQuestionsRepo,
  type UnansweredQuestionStatus,
} from "@/repositories/unanswered-questions.repo";
import { NextRequest, NextResponse } from "next/server";

const isValidStatus = (s: string | null): s is UnansweredQuestionStatus =>
  s === "pending" || s === "answered" || s === "ignored";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لم يتم العثور على مكتب مرتبط بالحساب" },
        { status: 404 },
      );

    const statusParam = request.nextUrl.searchParams.get("status");
    const status = isValidStatus(statusParam) ? statusParam : undefined;

    const questions = await UnansweredQuestionsRepo.getByOffice(office.id, status);
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("GET /api/unanswered-questions failed:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لم يتم العثور على مكتب مرتبط بالحساب" },
        { status: 404 },
      );

    const body = await request.json().catch(() => ({}));
    const question = (body?.question as string | undefined) ?? "";
    const phone = (body?.phone as string | undefined) ?? null;

    if (!question.trim()) {
      return NextResponse.json({ error: "نص السؤال مطلوب" }, { status: 400 });
    }

    const saved = await UnansweredQuestionsRepo.saveQuestion(
      office.id,
      question,
      phone,
    );

    if (!saved) {
      return NextResponse.json(
        { error: "فشل في حفظ السؤال" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, question: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/unanswered-questions failed:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

