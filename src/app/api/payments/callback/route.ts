/**
 * Moyasar Payment Callback — استقبال رد Moyasar بعد الدفع
 */

import { fetchPayment } from "@/lib/moyasar";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("id");
  const status = searchParams.get("status");

  if (!paymentId) {
    return NextResponse.redirect(
      new URL("/dashboard/subscription?error=missing_id", request.url),
    );
  }

  try {
    // Verify with Moyasar API
    const payment = await fetchPayment(paymentId);
    const userId = payment.metadata?.user_id;
    const planName = payment.metadata?.plan_name;
    const planId = payment.metadata?.plan_id;

    if (!userId || !planName) {
      return NextResponse.redirect(
        new URL("/dashboard/subscription?error=invalid_metadata", request.url),
      );
    }

    // Update payment record
    await supabaseAdmin
      .from("payments")
      .update({
        status: payment.status === "paid" ? "completed" : "failed",
        completed_at:
          payment.status === "paid" ? new Date().toISOString() : null,
      })
      .eq("gateway_payment_id", paymentId);

    if (payment.status === "paid") {
      // Deactivate old subscription
      await supabaseAdmin
        .from("user_subscriptions")
        .update({ status: "inactive" })
        .eq("user_id", userId)
        .eq("status", "active");

      // Activate new subscription
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

      return NextResponse.redirect(
        new URL("/dashboard/subscription?success=true", request.url),
      );
    }

    return NextResponse.redirect(
      new URL(
        `/dashboard/subscription?error=payment_${status || "failed"}`,
        request.url,
      ),
    );
  } catch {
    return NextResponse.redirect(
      new URL("/dashboard/subscription?error=verification_failed", request.url),
    );
  }
}
