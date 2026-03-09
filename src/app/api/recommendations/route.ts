/**
 * Recommendations API — لوحة تحليلات التوصيات للمكتب
 * GET: Get recommendation analytics for the logged-in office
 */

import { createClient } from "@supabase/supabase-js";
import {
  ClientActionRepository,
  ClientContextRepository,
} from "@/repositories/client-context.repo";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Get user's office from auth
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's office
    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("office_id, tenant_id")
      .eq("id", user.id)
      .single();

    const officeId = userRow?.office_id || userRow?.tenant_id;
    if (!officeId) {
      return NextResponse.json(
        { error: "No office linked" },
        { status: 403 },
      );
    }

    // Gather analytics in parallel
    const [
      topRequestedResult,
      topRecommendedResult,
      conversionResult,
      recommendationResult,
    ] = await Promise.all([
      ClientActionRepository.getTopProperties(officeId, "inquiry", 10),
      ClientActionRepository.getTopProperties(officeId, "recommendation_shown", 10),
      ClientActionRepository.getConversionStats(officeId),
      ClientActionRepository.getRecommendationStats(officeId),
    ]);

    // Enrich top properties with titles
    const allPropertyIds = [
      ...topRequestedResult.map((r) => r.propertyId),
      ...topRecommendedResult.map((r) => r.propertyId),
    ];
    const uniqueIds = [...new Set(allPropertyIds)];

    let propertyNames: Record<string, string> = {};
    if (uniqueIds.length > 0) {
      const { data: props } = await supabaseAdmin
        .from("properties")
        .select("id, title")
        .in("id", uniqueIds);
      if (props) {
        propertyNames = Object.fromEntries(
          props.map((p) => [p.id, p.title]),
        );
      }
    }

    const topRequested = topRequestedResult.map((r) => ({
      ...r,
      title: propertyNames[r.propertyId] || "عقار محذوف",
    }));

    const topRecommended = topRecommendedResult.map((r) => ({
      ...r,
      title: propertyNames[r.propertyId] || "عقار محذوف",
    }));

    return NextResponse.json({
      topRequested,
      topRecommended,
      conversion: conversionResult,
      recommendations: recommendationResult,
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
