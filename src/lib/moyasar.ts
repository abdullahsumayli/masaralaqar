/**
 * Moyasar Payment Gateway Integration
 * Supports credit cards and Apple Pay for Saudi Arabia
 * https://moyasar.com/docs/api/
 */

const MOYASAR_API_KEY = process.env.MOYASAR_API_KEY || "";
const MOYASAR_BASE_URL = "https://api.moyasar.com/v1";
const CALLBACK_URL =
  process.env.MOYASAR_CALLBACK_URL ||
  `${process.env.NEXT_PUBLIC_URL}/api/payments/callback`;

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
