/**
 * POST /api/partner/generate-link
 * Returns the referral link for the partner. Idempotent.
 */

import { AffiliateRepository } from "@/repositories/affiliate.repo";
import { getServerUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const affiliate = await AffiliateRepository.getByUserId(user.id);
    if (!affiliate) {
      return NextResponse.json({ error: "حساب الشريك غير موجود" }, { status: 403 });
    }

    const baseUrl =
      typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
        ? process.env.NEXT_PUBLIC_SITE_URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "https://masaralaqar.com";
    const referralLink = `${baseUrl}/auth/signup?ref=${affiliate.referralCode}`;

    return NextResponse.json({ referralLink, referralCode: affiliate.referralCode });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
