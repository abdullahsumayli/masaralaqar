/**
 * Payment Creation API — إنشاء عملية دفع عبر Moyasar
 */

import { getUserProfile } from "@/lib/auth";
import { createPayment, sarToHalalas } from "@/lib/moyasar";
import { captureError } from "@/lib/sentry";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerUser } from "@/lib/supabase-server";
import { METRIC, MetricsService } from "@/services/metrics.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const profile = (await getUserProfile(user.id)) as Record<
      string,
      unknown
    > | null;
    const body = await request.json();
    const { planName, source } = body as {
      planName?: string;
      source?: {
        type: string;
        name?: string;
        number?: string;
        cvc?: string;
        month?: string;
        year?: string;
        token?: string;
      };
    };

    if (!planName || !source) {
      return NextResponse.json(
        { error: "الخطة وطريقة الدفع مطلوبة" },
        { status: 400 },
      );
    }

    // Fetch plan details
    const { data: plan } = await supabaseAdmin
      .from("subscription_plans")
      .select("*")
      .eq("name", planName)
      .single();

    if (!plan || !plan.price_sar) {
      return NextResponse.json(
        { error: "الخطة غير موجودة أو مجانية" },
        { status: 400 },
      );
    }

    // Create Moyasar payment
    const payment = await createPayment({
      amount: sarToHalalas(plan.price_sar),
      description: `اشتراك ${plan.name} — مسار العقار`,
      source: source as Parameters<typeof createPayment>[0]["source"],
      metadata: {
        user_id: user.id,
        plan_name: planName,
        plan_id: plan.id,
        email: user.email || "",
      },
    });

    // Save payment record
    await supabaseAdmin.from("payments").insert({
      office_id: profile?.office_id || null,
      user_id: user.id,
      gateway: "moyasar",
      gateway_payment_id: payment.id,
      amount_sar: plan.price_sar,
      currency: "SAR",
      status: payment.status === "paid" ? "completed" : "pending",
      plan_name: planName,
      metadata: {
        moyasar_id: payment.id,
        source_type: payment.source?.type,
        source_company: payment.source?.company,
      },
    });

    // If payment is immediately successful (rare for card)
    if (payment.status === "paid") {
      await activateSubscription(user.id, planName, plan.id);
      MetricsService.track(METRIC.PAYMENT_SUCCESS, 1, { planName });
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        transaction_url: payment.source?.transaction_url,
      },
    });
  } catch (err) {
    captureError(err, { module: "Payments", action: "createPayment" });
    MetricsService.track(METRIC.PAYMENT_FAILED, 1);
    const message = err instanceof Error ? err.message : "خطأ في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function activateSubscription(
  userId: string,
  planName: string,
  planId: string,
) {
  // Check if an active subscription already exists (idempotency guard)
  const { data: existing } = await supabaseAdmin
    .from("user_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("plan_name", planName)
    .eq("status", "active")
    .limit(1);

  if (existing && existing.length > 0) {
    return; // Already activated — prevent duplicate
  }

  // Deactivate current subscription
  await supabaseAdmin
    .from("user_subscriptions")
    .update({ status: "inactive" })
    .eq("user_id", userId)
    .eq("status", "active");

  // Create new active subscription
  const endsAt = new Date();
  endsAt.setMonth(endsAt.getMonth() + 1); // Monthly

  await supabaseAdmin.from("user_subscriptions").insert({
    user_id: userId,
    plan_id: planId,
    plan_name: planName,
    status: "active",
    started_at: new Date().toISOString(),
    ends_at: endsAt.toISOString(),
    renewal_date: endsAt.toISOString(),
  });
}
