/**
 * POST /api/subscription/upgrade
 *
 * Upgrade office subscription to a new plan
 * Input: { new_plan: "starter" | "growth" | "pro" }
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { PlanRepository } from "@/repositories/plan.repo";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user)
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (!profile?.office_id)
      return NextResponse.json(
        { error: "لا يوجد مكتب مرتبط" },
        { status: 400 },
      );

    const body = await request.json().catch(() => ({}));
    const newPlanName = (body.new_plan as string)?.toLowerCase();
    if (!newPlanName || !["starter", "growth", "pro"].includes(newPlanName))
      return NextResponse.json(
        { error: "خطة غير صالحة. اختر: starter, growth, pro" },
        { status: 400 },
      );

    const plan = await PlanRepository.getByName(newPlanName);
    if (!plan)
      return NextResponse.json(
        { error: "الخطة غير موجودة" },
        { status: 404 },
      );

    const sub = await SubscriptionRepository.getByOfficeId(profile.office_id);
    if (!sub)
      return NextResponse.json(
        { error: "لا يوجد اشتراك نشط" },
        { status: 404 },
      );

    const upgraded = await SubscriptionRepository.upgrade(
      sub.id,
      plan.id,
      body.reset_usage === true,
    );

    if (!upgraded)
      return NextResponse.json(
        { error: "فشل في تحديث الاشتراك" },
        { status: 500 },
      );

    return NextResponse.json({
      success: true,
      plan: newPlanName,
      message: "تم ترقية الاشتراك بنجاح",
    });
  } catch (err) {
    console.error("[Subscription Upgrade] error:", err);
    return NextResponse.json(
      { error: "خطأ في الخادم" },
      { status: 500 },
    );
  }
}
