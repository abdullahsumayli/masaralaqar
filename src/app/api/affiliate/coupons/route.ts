/**
 * POST /api/affiliate/coupons — create coupon (affiliate only)
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

    const affiliate = await AffiliateRepository.getByUserId(user.id);
    if (!affiliate) {
      return NextResponse.json({ error: "يجب الانضمام لبرنامج الإحالة أولاً" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const code = (body.code as string)?.trim()?.toUpperCase();
    const discountPercent = Math.min(100, Math.max(1, Number(body.discountPercent) || 10));

    if (!code || code.length < 3) {
      return NextResponse.json({ error: "كود الكوبون مطلوب (3 أحرف على الأقل)" }, { status: 400 });
    }

    const existing = await AffiliateRepository.getCouponByCode(code);
    if (existing) {
      return NextResponse.json({ error: "هذا الكود مستخدم مسبقاً" }, { status: 400 });
    }

    const coupon = await AffiliateRepository.createCoupon(affiliate.id, code, discountPercent);
    if (!coupon) {
      return NextResponse.json({ error: "فشل في إنشاء الكوبون" }, { status: 500 });
    }

    return NextResponse.json({ success: true, coupon: { id: coupon.id, code: coupon.code, discountPercent: coupon.discountPercent } });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
