/**
 * Payment Callback — Moyasar redirect + webhook
 *
 * GET: User redirect from success_url (?ref=xxx&success=1)
 *      → Fetch invoice, verify paid, activate subscription, redirect to billing
 *
 * POST: Webhook from Moyasar (callback_url)
 *      → Verify signature, activate subscription
 *
 * Security: Always verify with Moyasar API; never trust client params for activation
 */

import { fetchInvoice, verifyWebhookSignature } from "@/lib/moyasar";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

async function activateSubscriptionFromPayment(
  officeId: string,
  planId: string,
  planName: string,
): Promise<boolean> {
  const now = new Date();
  const cycleEnd = new Date(now);
  cycleEnd.setMonth(cycleEnd.getMonth() + 1);

  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("office_id", officeId)
    .in("status", ["active", "trial"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: plan } = await supabaseAdmin
    .from("plans")
    .select("max_ai_messages")
    .eq("id", planId)
    .single();

  const messageLimit = (plan?.max_ai_messages as number) ?? 300;

  if (existing) {
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        plan_id: planId,
        status: "active",
        message_limit: messageLimit,
        ai_messages_used: 0,
        whatsapp_messages_used: 0,
        overage_messages: 0,
        overage_amount_sar: 0,
        billing_cycle_start: now.toISOString(),
        billing_cycle_end: cycleEnd.toISOString(),
        start_date: now.toISOString(),
        end_date: cycleEnd.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("id", existing.id);

    return !error;
  }

  const { error } = await supabaseAdmin.from("subscriptions").insert({
    office_id: officeId,
    plan_id: planId,
    status: "active",
    message_limit: messageLimit,
    billing_cycle_start: now.toISOString(),
    billing_cycle_end: cycleEnd.toISOString(),
    start_date: now.toISOString(),
    end_date: cycleEnd.toISOString(),
  });

  return !error;
}

/** GET: Redirect from Moyasar success_url */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  const success = searchParams.get("success");
  const invoiceId = searchParams.get("invoice_id");

  if (!ref && !invoiceId) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=missing_ref", BASE_URL),
    );
  }

  try {
    let invoiceIdToFetch = invoiceId;

    if (!invoiceIdToFetch && ref) {
      const { data: payments } = await supabaseAdmin
        .from("payments")
        .select("gateway_invoice_id, metadata")
        .eq("gateway", "moyasar")
        .eq("status", "initiated")
        .limit(10);

      const payment = (payments ?? []).find(
        (p) => (p.metadata as { ref?: string })?.ref === ref,
      );
      invoiceIdToFetch =
        payment?.gateway_invoice_id ??
        (payment?.metadata as { invoice_id?: string })?.invoice_id;
    }

    if (!invoiceIdToFetch) {
      return NextResponse.redirect(
        new URL("/dashboard/billing?error=payment_not_found", BASE_URL),
      );
    }

    const invoice = await fetchInvoice(invoiceIdToFetch);

    if (invoice.status !== "paid") {
      return NextResponse.redirect(
        new URL(
          `/dashboard/billing?error=payment_${invoice.status}`,
          BASE_URL,
        ),
      );
    }

    const officeId = invoice.metadata?.office_id;
    const planId = invoice.metadata?.plan_id;
    const planName = invoice.metadata?.plan_name;

    if (!officeId || !planId || !planName) {
      return NextResponse.redirect(
        new URL("/dashboard/billing?error=invalid_metadata", BASE_URL),
      );
    }

    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("gateway_invoice_id", invoiceIdToFetch)
      .eq("status", "paid")
      .single();

    if (existingPayment) {
      return NextResponse.redirect(
        new URL("/dashboard/billing?success=true", BASE_URL),
      );
    }

    const activated = await activateSubscriptionFromPayment(
      officeId,
      planId,
      planName,
    );

    if (!activated) {
      return NextResponse.redirect(
        new URL("/dashboard/billing?error=activation_failed", BASE_URL),
      );
    }

    await supabaseAdmin
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("gateway_invoice_id", invoiceIdToFetch);

    return NextResponse.redirect(
      new URL("/dashboard/billing?success=true", BASE_URL),
    );
  } catch (err) {
    console.error("[Payment Callback GET] error:", err);
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=verification_failed", BASE_URL),
    );
  }
}

/** POST: Webhook from Moyasar */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.MOYASAR_WEBHOOK_SECRET || "";
  const rawBody = await request.text();
  const signature = request.headers.get("x-moyasar-signature") || null;

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (webhookSecret && !verifyWebhookSignature(payload, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const eventType = payload.type as string;
  const data = payload.data as Record<string, unknown> | undefined;

  if (eventType !== "invoice_paid" && eventType !== "payment_paid") {
    return NextResponse.json({ received: true });
  }

  const invoice = (data?.object ?? data ?? payload) as {
    id?: string;
    status?: string;
    metadata?: Record<string, string>;
  };

  if (!invoice || invoice.status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const invoiceId = invoice.id;
  const officeId = invoice.metadata?.office_id;
  const planId = invoice.metadata?.plan_id;
  const planName = invoice.metadata?.plan_name;

  if (!invoiceId || !officeId || !planId || !planName) {
    return NextResponse.json({ received: true });
  }

  const { data: existing } = await supabaseAdmin
    .from("payments")
    .select("id")
    .eq("gateway_invoice_id", invoiceId)
    .eq("status", "paid")
    .single();

  if (existing) {
    return NextResponse.json({ received: true });
  }

  await activateSubscriptionFromPayment(officeId, planId, planName);

  await supabaseAdmin
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("gateway_invoice_id", invoiceId);

  return NextResponse.json({ received: true });
}
