/**
 * POST /api/payments/bank-transfer
 * Submit a bank transfer payment request
 */

import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const {
      planName,
      amountSar,
      bankName,
      transferDate,
      referenceNumber,
      phone,
    } = body as {
      planName: string;
      amountSar: number;
      bankName: string;
      transferDate: string;
      referenceNumber: string;
      phone?: string;
    };

    if (!planName || !amountSar || !bankName || !referenceNumber) {
      return NextResponse.json(
        { error: "بيانات ناقصة: يرجى ملء جميع الحقول المطلوبة" },
        { status: 400 },
      );
    }

    // Check for duplicate reference number
    const { data: existing } = await supabaseAdmin
      .from("bank_transfers")
      .select("id")
      .eq("reference_number", referenceNumber)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "رقم المرجع هذا مستخدم مسبقاً" },
        { status: 409 },
      );
    }

    // Create a pending subscription
    const { data: sub } = await supabaseAdmin
      .from("user_subscriptions")
      .insert({
        user_id: user.id,
        plan_name: planName,
        status: "pending",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    // Save transfer record
    const { data: transfer, error: transferError } = await supabaseAdmin
      .from("bank_transfers")
      .insert({
        user_id: user.id,
        subscription_id: sub?.id || null,
        amount_sar: amountSar,
        plan_name: planName,
        status: "pending",
        payment_method: "bank_transfer",
        bank_name: bankName,
        transfer_date: transferDate,
        reference_number: referenceNumber,
        ...(phone && { account_number: phone }),
      })
      .select()
      .single();

    if (transferError) throw transferError;

    // Log payment attempt
    await supabaseAdmin.from("payments").insert({
      user_id: user.id,
      gateway: "bank_transfer",
      gateway_payment_id: transfer.id,
      amount_sar: amountSar,
      currency: "SAR",
      status: "pending",
      plan_name: planName,
      metadata: {
        reference_number: referenceNumber,
        bank_name: bankName,
        transfer_date: transferDate,
      },
    }).throwOnError();

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      message: "تم استلام طلب التحويل. سيتم مراجعته وتفعيل الاشتراك خلال 24 ساعة.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ في الخادم";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
