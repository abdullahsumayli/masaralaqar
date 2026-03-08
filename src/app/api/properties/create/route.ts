/**
 * Property Create API
 * POST /api/properties/create
 */

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { PropertyCreateInput } from "@/types/property";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // --- Subscription limit check ---
    // Get user's active subscription
    const { data: subscription } = await supabaseAdmin
      .from("user_subscriptions")
      .select("plan_name, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const planName = subscription?.plan_name || "free";

    // Get plan limits
    const { data: plan } = await supabaseAdmin
      .from("subscription_plans")
      .select("max_properties")
      .eq("name", planName)
      .single();

    const maxProperties = plan?.max_properties ?? 5; // default free limit

    // Count user's current properties via tenant
    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userRow?.tenant_id) {
      const { count } = await supabaseAdmin
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", userRow.tenant_id);

      if (typeof count === "number" && count >= maxProperties) {
        return NextResponse.json(
          {
            error: "subscription_limit_exceeded",
            message: `وصلت للحد الأقصى من العقارات (${maxProperties}) في باقتك الحالية. يرجى الترقية للباقة Pro`,
            current: count,
            limit: maxProperties,
            plan: planName,
          },
          { status: 403 },
        );
      }
    }
    // ---------------------------------

    const body = await request.json();

    const {
      title,
      description,
      price,
      city,
      location,
      type,
      bedrooms,
      bathrooms,
      area,
      images,
      tenant_id,
    } = body as PropertyCreateInput & { tenant_id?: string };

    // Validate required fields
    if (!title || !price || !city || !type) {
      return NextResponse.json(
        { error: "Missing required fields: title, price, city, type" },
        { status: 400 },
      );
    }

    // Use user's tenant if not specified
    const tenantId = tenant_id || userRow?.tenant_id || "default";

    // Create property record
    const { data, error } = await supabase
      .from("properties")
      .insert([
        {
          tenant_id: tenantId,
          title,
          description: description || "",
          price,
          city,
          location: location || city,
          type,
          bedrooms: bedrooms || null,
          bathrooms: bathrooms || null,
          area: area || null,
          images: images || [],
          status: "available",
          featured: false,
          views_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Property creation error:", error);
      return NextResponse.json(
        { error: "Failed to create property", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      property_id: data.id,
      property: data,
    });
  } catch (error: any) {
    console.error("Property create API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
