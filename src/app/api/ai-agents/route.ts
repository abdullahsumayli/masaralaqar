/**
 * AI Agents API — إدارة وكلاء الذكاء الاصطناعي
 */

import { getCurrentUser } from "@/lib/auth";
import { AIAgentService } from "@/services/ai-agent.service";
import { OfficeService } from "@/services/office.service";
import { NextRequest, NextResponse } from "next/server";

/** GET: Get AI agent for current user's office */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );

    const agent = await AIAgentService.getAgentByOfficeId(office.id);
    return NextResponse.json({ agent });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** PUT: Update AI agent for current user's office */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (!office)
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 404 },
      );

    const body = await request.json();
    const allowedFields = [
      "agentName",
      "greetingMessage",
      "officeDescription",
      "tone",
      "language",
      "workingHours",
      "customInstructions",
    ];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const agent = await AIAgentService.updateAgent(office.id, updateData);
    if (!agent)
      return NextResponse.json({ error: "فشل في التحديث" }, { status: 500 });

    return NextResponse.json({ agent });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
