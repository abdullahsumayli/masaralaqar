/**
 * GET /api/affiliate/validate?code=XXX
 * Validate referral code (public). Returns { valid: boolean, code?: string }.
 */

import { AffiliateRepository } from "@/repositories/affiliate.repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code || !code.trim()) {
    return NextResponse.json({ valid: false });
  }
  const affiliate = await AffiliateRepository.getByReferralCode(code.trim());
  return NextResponse.json({
    valid: !!affiliate,
    code: affiliate ? affiliate.referralCode : undefined,
  });
}
