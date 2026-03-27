/**
 * GET /api/billing/usage
 *
 * Returns current plan, usage bar (messages_used / message_limit), remaining quota
 */

import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { getUsageSummary } from "@/services/usage.service";
import { NextResponse } from "next/server";

export async function GET() {
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

    const sub = await SubscriptionRepository.getByOfficeId(profile.office_id);
    const usage = await getUsageSummary(profile.office_id);

    if (!sub)
      return NextResponse.json({
        success: true,
        subscription: null,
        usage: null,
        planName: "free",
      });

    const planName = sub.plan?.name ?? "free";
    const limit = sub.messageLimit ?? sub.plan?.maxAiMessages ?? 300;

    return NextResponse.json({
      success: true,
      subscription: {
        planName,
        planNameAr: sub.plan?.nameAr ?? "مجانية",
        price: sub.plan?.price ?? 0,
        maxInstances: sub.plan?.maxInstances ?? 1,
        features: sub.plan?.features ?? [],
      },
      usage: usage
        ? {
            messagesUsed: usage.messagesUsed,
            messageLimit: usage.messageLimit,
            percentUsed: usage.percentUsed,
            isAtLimit: usage.isAtLimit,
            isNearLimit: usage.isNearLimit,
            overageMessages: sub.overageMessages,
            overageAmountSar: sub.overageAmountSar,
          }
        : {
            messagesUsed: sub.aiMessagesUsed,
            messageLimit: limit,
            percentUsed:
              limit > 0 ? Math.min(100, (sub.aiMessagesUsed / limit) * 100) : 0,
            isAtLimit: limit > 0 && sub.aiMessagesUsed >= limit,
            isNearLimit:
              limit > 0 && (sub.aiMessagesUsed / limit) * 100 >= 80,
            overageMessages: sub.overageMessages,
            overageAmountSar: sub.overageAmountSar,
          },
    });
  } catch (err) {
    console.error("[Billing Usage] error:", err);
    return NextResponse.json(
      { error: "خطأ في جلب البيانات" },
      { status: 500 },
    );
  }
}
