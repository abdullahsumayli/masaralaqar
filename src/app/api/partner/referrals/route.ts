/**
 * GET /api/partner/referrals
 * List referred offices with status and commission earned.
 */

import { AffiliateRepository } from "@/repositories/affiliate.repo";
import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const affiliate = await AffiliateRepository.getByUserId(user.id);
    if (!affiliate) {
      return NextResponse.json({ error: "حساب الشريك غير موجود" }, { status: 403 });
    }

    const referrals = await AffiliateRepository.getReferralsByAffiliateId(affiliate.id);
    const commissions = await AffiliateRepository.getCommissionsByAffiliateId(affiliate.id);

    const referredUserIds = referrals.map((r) => r.referredUserId);
    let usersData: { id: string; name?: string; email?: string; company?: string; office_id?: string }[] = [];
    if (referredUserIds.length > 0) {
      const { data } = await supabaseAdmin
        .from("users")
        .select("id, name, email, company, office_id")
        .in("id", referredUserIds);
      usersData = data ?? [];
    }

    const officeIds = usersData.map((u) => u.office_id).filter(Boolean) as string[];
    let officesMap: Record<string, { name: string }> = {};
    if (officeIds.length > 0) {
      const { data } = await supabaseAdmin
        .from("offices")
        .select("id, name")
        .in("id", officeIds);
      if (data) {
        officesMap = Object.fromEntries(data.map((o) => [o.id, { name: o.name || "—" }]));
      }
    }

    const commissionByReferral: Record<string, number> = {};
    for (const c of commissions) {
      const ref = referrals.find((r) => r.id === c.referralId);
      if (ref) {
        commissionByReferral[ref.id] = (commissionByReferral[ref.id] ?? 0) + c.amount;
      }
    }

    const hasActiveSub: Record<string, boolean> = {};
    if (referredUserIds.length > 0) {
      const { data } = await supabaseAdmin
        .from("user_subscriptions")
        .select("user_id")
        .in("user_id", referredUserIds)
        .eq("status", "active");
      if (data) {
        for (const row of data) {
          hasActiveSub[row.user_id] = true;
        }
      }
    }

    const items = referrals.map((r) => {
      const u = usersData.find((x) => x.id === r.referredUserId);
      const officeName = u?.office_id ? officesMap[u.office_id]?.name ?? u?.company ?? u?.name ?? "—" : u?.company ?? u?.name ?? "—";
      const commissionEarned = commissionByReferral[r.id] ?? 0;
      const status = hasActiveSub[r.referredUserId] ? "subscribed" : "registered";

      return {
        id: r.id,
        officeName,
        referredUserId: r.referredUserId,
        status,
        commissionEarned,
        createdAt: r.createdAt,
      };
    });

    return NextResponse.json({ referrals: items });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
