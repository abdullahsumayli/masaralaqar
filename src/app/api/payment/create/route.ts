/**
 * POST /api/payment/create
 *
 * Create Moyasar invoice for subscription — returns checkout URL for redirect
 * Input: { plan: "starter" | "growth" | "pro" }
 * Prevents bypass: plan upgrade only after successful payment (handled in callback)
 */

import crypto from "crypto";
import { getServerUser } from "@/lib/supabase-server";
import { getUserProfile } from "@/lib/auth";
import { createInvoice, sarToHalalas } from "@/lib/moyasar";
import { PlanRepository } from "@/repositories/plan.repo";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
    const planName = (body.plan as string)?.toLowerCase();
    if (!planName || !["starter", "growth", "pro"].includes(planName))
      return NextResponse.json(
        { error: "خطة غير صالحة. اختر: starter, growth, pro" },
        { status: 400 },
      );

    const plan = await PlanRepository.getByName(planName);
    if (!plan)
      return NextResponse.json(
        { error: "الخطة غير موجودة" },
        { status: 404 },
      );

    const sub = await SubscriptionRepository.getByOfficeId(profile.office_id);
    const overageSar = sub?.overageAmountSar ?? 0;
    const amountSar = plan.price + overageSar;

    if (amountSar <= 0)
      return NextResponse.json(
        { error: "الخطة مجانية — لا تحتاج دفعاً" },
        { status: 400 },
      );

    const amountHalalas = sarToHalalas(amountSar);
    if (amountHalalas < 100)
      return NextResponse.json(
        { error: "الحد الأدنى للدفع 1 ريال" },
        { status: 400 },
      );

    const ref = crypto.randomUUID();

    const description =
      overageSar > 0
        ? `اشتراك ${plan.nameAr || plan.name} + استخدام إضافي ${overageSar.toFixed(2)} ر.س — MQ`
        : `اشتراك ${plan.nameAr || plan.name} — MQ`;

    const invoice = await createInvoice({
      amount: amountHalalas,
      currency: "SAR",
      description,
      success_url: `${BASE_URL}/api/payment/callback?ref=${ref}&success=1`,
      back_url: `${BASE_URL}/dashboard/billing?canceled=1`,
      callback_url: `${BASE_URL}/api/payment/callback`,
      metadata: {
        office_id: profile.office_id,
        user_id: user.id,
        plan_name: planName,
        plan_id: plan.id,
        ref,
      },
    });

    await supabaseAdmin.from("payments").insert({
      office_id: profile.office_id,
      plan_id: plan.id,
      amount_sar: amountSar,
      description,
      currency: "SAR",
      status: "initiated",
      gateway: "moyasar",
      gateway_invoice_id: invoice.id,
      payment_method: "creditcard",
      metadata: {
        user_id: user.id,
        plan_name: planName,
        invoice_id: invoice.id,
        ref,
        overage_amount_sar: overageSar,
      },
    });

    return NextResponse.json({
      success: true,
      url: invoice.url,
      payment_id: invoice.id,
      status: "pending",
    });
  } catch (err) {
    console.error("[Payment Create] error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "فشل في إنشاء عملية الدفع",
      },
      { status: 500 },
    );
  }
}
