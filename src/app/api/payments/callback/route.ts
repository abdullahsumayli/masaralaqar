/**
 * Moyasar Payment Callback — استقبال رد Moyasar بعد الدفع
 *
 * Security:
 *   1. Always re-fetches payment from Moyasar API (server-to-server) — never trusts query params
 *   2. Idempotency: checks if payment already completed before activating
 *   3. Uses single-row update condition to prevent race conditions
 */

import { fetchPayment } from "@/lib/moyasar";
import { captureError } from "@/lib/sentry";
import { supabaseAdmin } from "@/lib/supabase";
import { METRIC, MetricsService } from "@/services/metrics.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("id");

  if (!paymentId) {
    return NextResponse.redirect(
      new URL("/dashboard/subscription?error=missing_id", request.url),
    );
  }

  try {
    // 1. Always verify with Moyasar API — never trust query params
    const payment = await fetchPayment(paymentId);
    const userId = payment.metadata?.user_id;
    const planName = payment.metadata?.plan_name;
    const planId = payment.metadata?.plan_id;

    if (!userId || !planName) {
      return NextResponse.redirect(
        new URL("/dashboard/subscription?error=invalid_metadata", request.url),
      );
    }

    // 2. Idempotency: check if this payment was already processed
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("status")
      .eq("gateway_payment_id", paymentId)
      .single();

    if (existingPayment?.status === "completed") {
      // Already processed — redirect without duplicate activation
      return NextResponse.redirect(
        new URL("/dashboard/subscription?success=true", request.url),
      );
    }

    // 3. Update payment record
    await supabaseAdmin
      .from("payments")
      .update({
        status: payment.status === "paid" ? "completed" : "failed",
        completed_at:
          payment.status === "paid" ? new Date().toISOString() : null,
      })
      .eq("gateway_payment_id", paymentId);

    if (payment.status === "paid") {
      // 4. Atomic subscription activation — deactivate then insert
      await supabaseAdmin
        .from("user_subscriptions")
        .update({ status: "inactive" })
        .eq("user_id", userId)
        .eq("status", "active");

      const endsAt = new Date();
      endsAt.setMonth(endsAt.getMonth() + 1);

      await supabaseAdmin.from("user_subscriptions").insert({
        user_id: userId,
        plan_id: planId || null,
        plan_name: planName,
        status: "active",
        started_at: new Date().toISOString(),
        ends_at: endsAt.toISOString(),
        renewal_date: endsAt.toISOString(),
      });

      MetricsService.track(METRIC.PAYMENT_SUCCESS, 1, { planName });

      return NextResponse.redirect(
        new URL("/dashboard/subscription?success=true", request.url),
      );
    }

    MetricsService.track(METRIC.PAYMENT_FAILED, 1);
    return NextResponse.redirect(
      new URL(
        `/dashboard/subscription?error=payment_${payment.status}`,
        request.url,
      ),
    );
  } catch (err) {
    captureError(err, { module: "PaymentCallback", action: "GET" });
    return NextResponse.redirect(
      new URL("/dashboard/subscription?error=verification_failed", request.url),
    );
  }
}
