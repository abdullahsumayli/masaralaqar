/**
 * POST /api/affiliate/validate-coupon
 * Validate coupon code. Returns { valid, discountPercent } (no affiliate leak).
 */

import { AffiliateRepository } from "@/repositories/affiliate.repo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const code = (body.code as string)?.trim()?.toUpperCase();
    if (!code) {
      return NextResponse.json({ valid: false });
    }
    const coupon = await AffiliateRepository.getCouponByCode(code);
    if (!coupon || !coupon.active) {
      return NextResponse.json({ valid: false });
    }
    return NextResponse.json({
      valid: true,
      discountPercent: coupon.discountPercent,
      code: coupon.code,
    });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
