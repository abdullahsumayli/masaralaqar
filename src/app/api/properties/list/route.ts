/**
 * Property List API
 * GET /api/properties/list
 */

import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const tenant_id = searchParams.get("tenant_id") || "default";
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const budget = searchParams.get("budget");
    const bedrooms = searchParams.get("bedrooms");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Build query
    let query = supabaseAdmin
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(Math.min(limit, 50)); // Max 50 properties

    // Apply tenant filter if not default
    if (tenant_id && tenant_id !== "default") {
      query = query.eq("tenant_id", tenant_id);
    }

    // Apply city filter
    if (city) {
      query = query.or(`city.ilike.%${city}%,location.ilike.%${city}%`);
    }

    // Apply type filter
    if (type) {
      query = query.eq("type", type);
    }

    // Apply budget filter (max price)
    if (budget) {
      const budgetNum = parseInt(budget, 10);
      if (!isNaN(budgetNum)) {
        query = query.lte("price", budgetNum);
      }
    }

    // Apply bedrooms filter
    if (bedrooms) {
      const bedroomsNum = parseInt(bedrooms, 10);
      if (!isNaN(bedroomsNum)) {
        query = query.eq("bedrooms", bedroomsNum);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Property list error:", error);
      return NextResponse.json(
        { error: "Failed to fetch properties", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      properties: data || [],
      count: data?.length || 0,
      filters: {
        tenant_id,
        city,
        type,
        budget,
        bedrooms,
      },
    });
  } catch (error: any) {
    console.error("Property list API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
