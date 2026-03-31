/**
 * Subscription checkout — card/gateway vs bank transfer only.
 * When false (default): UI hides Moyasar/card/STC; API blocks /api/payment/create.
 * Set NEXT_PUBLIC_ONLINE_PAYMENTS_ENABLED=true after gateway approval.
 */
export function isOnlinePaymentsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ONLINE_PAYMENTS_ENABLED === "true";
}
