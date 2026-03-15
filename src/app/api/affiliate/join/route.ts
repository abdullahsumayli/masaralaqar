/**
 * POST /api/affiliate/join
 * Register current user as affiliate; generate unique referral code. Idempotent if already affiliate.
 */

import { AffiliateRepository } from "@/repositories/affiliate.repo";
import { getServerUser } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    let affiliate = await AffiliateRepository.getByUserId(user.id);
    if (affiliate) {
      return NextResponse.json({
        success: true,
        referralCode: affiliate.referralCode,
        alreadyJoined: true,
      });
    }

    let code = generateReferralCode();
    for (let attempt = 0; attempt < 10; attempt++) {
      const existing = await AffiliateRepository.getByReferralCode(code);
      if (!existing) break;
      code = generateReferralCode();
    }

    affiliate = await AffiliateRepository.createAffiliate(user.id, code, null);
    if (!affiliate) {
      return NextResponse.json({ error: "فشل في إنشاء حساب الإحالة" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      referralCode: affiliate.referralCode,
      alreadyJoined: false,
    });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
