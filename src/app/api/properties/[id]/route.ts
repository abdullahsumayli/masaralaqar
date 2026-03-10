/**
 * Property by ID API
 * DELETE /api/properties/[id] - Delete a property
 * PATCH  /api/properties/[id] - Update a property
 */

import { invalidatePropertiesCache } from "@/lib/properties-cache";
import { supabase } from "@/lib/supabase";
import { OfficeService } from "@/services/office.service";
import { PropertyUpdateInput } from "@/types/property";
import { NextRequest, NextResponse } from "next/server";

async function getAuthUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Property delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete property", details: error.message },
        { status: 500 }
      );
    }

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (office?.id) invalidatePropertiesCache(office.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Property delete API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json() as PropertyUpdateInput;

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.district !== undefined) updateData.district = body.district;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.bedrooms !== undefined) updateData.bedrooms = body.bedrooms;
    if (body.bathrooms !== undefined) updateData.bathrooms = body.bathrooms;
    if (body.area !== undefined) updateData.area = body.area;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.license_number !== undefined) updateData.license_number = body.license_number;
    if (body.status !== undefined) updateData.status = body.status;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Property update error:", error);
      return NextResponse.json(
        { error: "Failed to update property", details: error.message },
        { status: 500 }
      );
    }

    const office = await OfficeService.getOfficeByUserId(user.id);
    if (office?.id) invalidatePropertiesCache(office.id);

    return NextResponse.json({ success: true, property: data });
  } catch (error: any) {
    console.error("Property update API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
