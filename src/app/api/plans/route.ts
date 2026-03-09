/**
 * Plans API — إدارة الباقات
 */

import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { PlanService } from "@/services/plan.service";
import { NextRequest, NextResponse } from "next/server";

/** GET: List all plans (public) */
export async function GET() {
  try {
    const plans = await PlanService.getAllPlans();
    return NextResponse.json({ plans });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

/** POST: Create plan (admin only) */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });
    }

    const body = await request.json();
    const plan = await PlanService.createPlan(body);
    if (!plan)
      return NextResponse.json(
        { error: "فشل في إنشاء الباقة" },
        { status: 500 },
      );

    return NextResponse.json({ plan }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
