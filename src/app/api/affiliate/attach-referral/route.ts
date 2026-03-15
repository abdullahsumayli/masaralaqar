/**
 * POST /api/affiliate/attach-referral
 * Attach referral to the current user (after signup). Accepts referralCode or couponCode.
 * Prevents self-referral and duplicates.
 */

import { AffiliateRepository } from "@/repositories/affiliate.repo";
import { getServerUser } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const referralCode = (body.referralCode as string)?.trim()?.toUpperCase();
    const couponCode = (body.couponCode as string)?.trim()?.toUpperCase();

    let affiliateId: string | null = null;
    if (referralCode) {
      const affiliate = await AffiliateRepository.getByReferralCode(referralCode);
      if (affiliate) affiliateId = affiliate.id;
    }
    if (!affiliateId && couponCode) {
      const coupon = await AffiliateRepository.getCouponByCode(couponCode);
      if (coupon) affiliateId = coupon.affiliateId;
    }

    if (!affiliateId) {
      return NextResponse.json({ error: "كود إحالة أو كوبون غير صالح" }, { status: 400 });
    }

    const affiliate = await AffiliateRepository.getById(affiliateId);
    if (!affiliate) {
      return NextResponse.json({ error: "كود إحالة غير صالح" }, { status: 400 });
    }

    if (affiliate.userId === user.id) {
      return NextResponse.json({ error: "لا يمكن استخدام كود الإحالة الخاص بك" }, { status: 400 });
    }

    const existing = await AffiliateRepository.getReferralByReferredUserId(user.id);
    if (existing) {
      return NextResponse.json({ error: "تم ربط إحالة مسبقاً" }, { status: 400 });
    }

    const referral = await AffiliateRepository.createReferral(affiliateId, user.id);
    if (!referral) {
      return NextResponse.json({ error: "فشل في حفظ الإحالة" }, { status: 500 });
    }

    return NextResponse.json({ success: true, referralId: referral.id });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
