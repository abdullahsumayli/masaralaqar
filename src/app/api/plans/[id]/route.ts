/**
 * PATCH /api/plans/[id] — Update a plan (admin only)
 * DELETE /api/plans/[id] — Delete a plan (admin only)
 */

import { getServerUser } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";
import { PlanService } from "@/services/plan.service";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const user = await getServerUser();
  if (!user) return null;
  const { data } = await supabaseAdmin.from("users").select("role").eq("id", user.id).single();
  if (data?.role !== "admin") return null;
  return user;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });

  try {
    const body = await request.json();
    const plan = await PlanService.updatePlan(params.id, body);
    if (!plan) return NextResponse.json({ error: "الباقة غير موجودة" }, { status: 404 });
    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 });

  try {
    const ok = await PlanService.deletePlan(params.id);
    if (!ok) return NextResponse.json({ error: "فشل في الحذف" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
