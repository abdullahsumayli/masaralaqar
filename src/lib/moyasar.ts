/**
 * Moyasar Payment Gateway Integration
 * Supports credit cards and Apple Pay for Saudi Arabia
 * https://moyasar.com/docs/api/
 */

const MOYASAR_API_KEY = process.env.MOYASAR_API_KEY || "";
const MOYASAR_BASE_URL = "https://api.moyasar.com/v1";
const CALLBACK_URL =
  process.env.MOYASAR_CALLBACK_URL ||
  `${process.env.NEXT_PUBLIC_URL || "https://masaralaqar.com"}/api/payments/callback`;

export interface MoyasarPaymentRequest {
  amount: number; // Amount in halalas (1 SAR = 100 halalas)
  currency?: string;
  description: string;
  callback_url?: string;
  source: {
    type: "creditcard" | "applepay" | "stcpay";
    name?: string;
    number?: string;
    cvc?: string;
    month?: string;
    year?: string;
    token?: string;
  };
  metadata?: Record<string, string>;
}

export interface MoyasarPayment {
  id: string;
  status:
    | "initiated"
    | "paid"
    | "failed"
    | "authorized"
    | "captured"
    | "refunded"
    | "voided";
  amount: number;
  fee: number;
  currency: string;
  refunded: number;
  description: string;
  ip: string;
  callback_url: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, string>;
  source: {
    type: string;
    company: string;
    name: string;
    number: string;
    message: string;
    transaction_url?: string;
  };
}

function authHeader(): Record<string, string> {
  const encoded = Buffer.from(`${MOYASAR_API_KEY}:`).toString("base64");
  return {
    Authorization: `Basic ${encoded}`,
    "Content-Type": "application/json",
  };
}

/** Create a new payment */
export async function createPayment(
  request: MoyasarPaymentRequest,
): Promise<MoyasarPayment> {
  const res = await fetch(`${MOYASAR_BASE_URL}/payments`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      ...request,
      currency: request.currency || "SAR",
      callback_url: request.callback_url || CALLBACK_URL,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Moyasar error: ${res.status}`);
  }

  return res.json();
}

/** Fetch payment details by ID */
export async function fetchPayment(paymentId: string): Promise<MoyasarPayment> {
  const res = await fetch(
    `${MOYASAR_BASE_URL}/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: authHeader(),
    },
  );

  if (!res.ok) {
    throw new Error(`Moyasar fetch error: ${res.status}`);
  }

  return res.json();
}

/** Refund a payment (partial or full) */
export async function refundPayment(
  paymentId: string,
  amount?: number,
): Promise<MoyasarPayment> {
  const body: Record<string, unknown> = {};
  if (amount) body.amount = amount;

  const res = await fetch(
    `${MOYASAR_BASE_URL}/payments/${encodeURIComponent(paymentId)}/refund`,
    {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    throw new Error(`Moyasar refund error: ${res.status}`);
  }

  return res.json();
}

/** Convert SAR to halalas */
export function sarToHalalas(sar: number): number {
  return Math.round(sar * 100);
}

// ── Invoice API (redirect flow) ─────────────────────────────────

export interface MoyasarInvoiceRequest {
  amount: number; // halalas
  currency?: string;
  description: string;
  callback_url?: string;
  success_url?: string;
  back_url?: string;
  expired_at?: string;
  metadata?: Record<string, string>;
}

export interface MoyasarInvoice {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  url: string;
  callback_url: string | null;
  success_url: string | null;
  back_url: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, string>;
}

/** Create invoice — returns checkout URL for redirect */
export async function createInvoice(
  request: MoyasarInvoiceRequest,
): Promise<MoyasarInvoice> {
  const baseUrl =
    process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${MOYASAR_BASE_URL}/invoices`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      amount: request.amount,
      currency: request.currency || "SAR",
      description: request.description,
      callback_url: request.callback_url || `${baseUrl}/api/payment/callback`,
      success_url: request.success_url,
      back_url: request.back_url,
      expired_at: request.expired_at,
      metadata: request.metadata,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Moyasar invoice error: ${res.status}`);
  }

  return res.json();
}

/** Fetch invoice by ID */
export async function fetchInvoice(
  invoiceId: string,
): Promise<MoyasarInvoice> {
  const res = await fetch(
    `${MOYASAR_BASE_URL}/invoices/${encodeURIComponent(invoiceId)}`,
    { headers: authHeader() },
  );

  if (!res.ok) {
    throw new Error(`Moyasar fetch invoice error: ${res.status}`);
  }

  return res.json();
}

/** Verify webhook — Moyasar sends secret_token in payload; must match MOYASAR_WEBHOOK_SECRET */
export function verifyWebhookSignature(
  payload: string | object,
  secret: string,
): boolean {
  if (!secret) return false;
  const body = typeof payload === "string" ? JSON.parse(payload) : payload;
  const token = (body as { secret_token?: string }).secret_token;
  return token === secret;
}
