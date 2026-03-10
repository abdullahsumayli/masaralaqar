/**
 * Property Knowledge API — توليد المعرفة العقارية
 * POST: Generate knowledge for a property (or batch)
 * GET: Get knowledge for a property
 */

import { supabaseAdmin } from "@/lib/supabase";
import { PropertyKnowledgeService } from "@/services/property-knowledge.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get("propertyId");

  if (!propertyId) {
    return NextResponse.json(
      { error: "propertyId is required" },
      { status: 400 },
    );
  }

  const knowledge = await PropertyKnowledgeService.getKnowledge(propertyId);
  return NextResponse.json({ knowledge });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, officeId, generateAll } = body;

    // Generate for all properties in an office
    if (generateAll && officeId) {
      const { data: properties } = await supabaseAdmin
        .from("properties")
        .select("*")
        .or(`office_id.eq.${officeId},tenant_id.eq.${officeId}`)
        .eq("status", "available")
        .limit(100);

      if (!properties || properties.length === 0) {
        return NextResponse.json({
          generated: 0,
          message: "No properties found",
        });
      }

      const mapped = properties.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        type: p.type,
        price: Number(p.price),
        city: p.city || p.location || "",
        location: p.location,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: Number(p.area) || 0,
        features: p.features,
        images: p.images,
      }));

      const count = await PropertyKnowledgeService.generateBatch(mapped);
      return NextResponse.json({ generated: count, total: properties.length });
    }

    // Generate for a single property
    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId or officeId+generateAll required" },
        { status: 400 },
      );
    }

    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    const knowledge = await PropertyKnowledgeService.generateKnowledge({
      id: property.id,
      title: property.title,
      description: property.description || "",
      type: property.type,
      price: Number(property.price),
      city: property.city || property.location || "",
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: Number(property.area) || 0,
      features: property.features,
      images: property.images,
    });

    return NextResponse.json({ knowledge });
  } catch (error) {
    console.error("Property knowledge API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
