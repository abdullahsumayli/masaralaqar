/**
 * AI Listings API
 * POST /api/ai-listings/generate — Generate listing for a property
 * GET  /api/ai-listings — Get listings for office
 * POST /api/ai-listings/export — Export a listing in a specific format
 * POST /api/ai-listings/batch — Batch generate listings
 */

import { supabaseAdmin } from "@/lib/supabase";
import { getServerUser } from "@/lib/supabase-server";
import { AIListingRepository } from "@/repositories/ai-listing.repo";
import { PropertyKnowledgeRepository } from "@/repositories/property-knowledge.repo";
import { ListingGeneratorService } from "@/services/listing-generator.service";
import { PropertyKnowledgeService } from "@/services/property-knowledge.service";
import type { ExportFormat } from "@/types/ai-listing";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 },
      );
    }

    const { searchParams } = request.nextUrl;
    const propertyId = searchParams.get("propertyId");
    const officeId = searchParams.get("officeId");

    if (propertyId) {
      const listing = await AIListingRepository.getByPropertyId(propertyId);
      if (!listing) {
        return NextResponse.json(
          { success: false, error: "لم يتم العثور على إعلان لهذا العقار" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, listing });
    }

    if (officeId) {
      const listings = await AIListingRepository.getByOfficeId(officeId);
      return NextResponse.json({ success: true, listings });
    }

    return NextResponse.json(
      { success: false, error: "يجب تحديد propertyId أو officeId" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[AI Listings GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في جلب الإعلانات" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { action } = body;

    // ── Route to the appropriate handler ──
    switch (action) {
      case "generate":
        return handleGenerate(body);
      case "export":
        return handleExport(body);
      case "batch":
        return handleBatch(body);
      default:
        // Default to generate
        return handleGenerate(body);
    }
  } catch (error) {
    console.error("[AI Listings POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في العملية" },
      { status: 500 },
    );
  }
}

// ── Generate a single listing ──
async function handleGenerate(body: {
  propertyId?: string;
  officeId?: string;
}) {
  const { propertyId, officeId } = body;

  if (!propertyId) {
    return NextResponse.json(
      { success: false, error: "propertyId مطلوب" },
      { status: 400 },
    );
  }

  // Load property
  const { data: property, error: propError } = await supabaseAdmin
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (propError || !property) {
    return NextResponse.json(
      { success: false, error: "لم يتم العثور على العقار" },
      { status: 404 },
    );
  }

  const resolvedOfficeId =
    officeId || property.office_id || property.tenant_id || "default";

  // Load or generate property knowledge
  let knowledge = await PropertyKnowledgeRepository.getByPropertyId(propertyId);
  if (!knowledge) {
    knowledge = await PropertyKnowledgeService.generateKnowledge({
      id: property.id,
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      city: property.city,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      features: property.features,
      images: property.images,
    });
  }

  // Load agent settings if available
  let agentSettings;
  try {
    const { data: agent } = await supabaseAdmin
      .from("ai_agents")
      .select("agent_name, tone, office_description")
      .eq("office_id", resolvedOfficeId)
      .single();

    if (agent) {
      agentSettings = {
        agentName: agent.agent_name,
        tone: agent.tone,
        officeDescription: agent.office_description,
      };
    }
  } catch {
    // Agent table may not exist — continue without agent settings
  }

  const listing = await ListingGeneratorService.generate(
    {
      id: property.id,
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      city: property.city,
      location: property.location,
      district: property.district,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      features: property.features,
      images: property.images,
      license_number: property.license_number,
    },
    resolvedOfficeId,
    knowledge,
    agentSettings,
  );

  if (!listing) {
    return NextResponse.json(
      { success: false, error: "فشل في إنشاء الإعلان" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, listing });
}

// ── Export a listing ──
async function handleExport(body: {
  propertyId?: string;
  format?: ExportFormat;
}) {
  const { propertyId, format } = body;

  if (!propertyId || !format) {
    return NextResponse.json(
      { success: false, error: "propertyId و format مطلوبان" },
      { status: 400 },
    );
  }

  const validFormats: ExportFormat[] = [
    "whatsapp",
    "twitter",
    "instagram",
    "portal",
    "seo",
  ];
  if (!validFormats.includes(format)) {
    return NextResponse.json(
      { success: false, error: "صيغة التصدير غير صالحة" },
      { status: 400 },
    );
  }

  const listing = await AIListingRepository.getByPropertyId(propertyId);
  if (!listing) {
    return NextResponse.json(
      { success: false, error: "لم يتم العثور على إعلان. أنشئ الإعلان أولاً." },
      { status: 404 },
    );
  }

  const { data: property } = await supabaseAdmin
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (!property) {
    return NextResponse.json(
      { success: false, error: "لم يتم العثور على العقار" },
      { status: 404 },
    );
  }

  const exported = ListingGeneratorService.formatForExport(
    listing,
    {
      id: property.id,
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      city: property.city,
      location: property.location,
      district: property.district,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      images: property.images,
      license_number: property.license_number,
    },
    format,
  );

  return NextResponse.json({ success: true, format, content: exported });
}

// ── Batch generate listings ──
async function handleBatch(body: { officeId?: string; limit?: number }) {
  const { officeId, limit } = body;

  if (!officeId) {
    return NextResponse.json(
      { success: false, error: "officeId مطلوب" },
      { status: 400 },
    );
  }

  const maxLimit = Math.min(limit || 50, 100);

  // Load properties without existing listings
  const { data: properties } = await supabaseAdmin
    .from("properties")
    .select("*")
    .or(`office_id.eq.${officeId},tenant_id.eq.${officeId}`)
    .eq("status", "available")
    .limit(maxLimit);

  if (!properties || properties.length === 0) {
    return NextResponse.json({
      success: true,
      message: "لا توجد عقارات لإنشاء إعلانات لها",
      result: { success: 0, failed: 0 },
    });
  }

  // Load knowledge for all properties
  const propertyIds = properties.map((p: { id: string }) => p.id);
  const knowledgeMap =
    await PropertyKnowledgeService.getKnowledgeBatch(propertyIds);

  const result = await ListingGeneratorService.generateBatch(
    properties.map((p: Record<string, unknown>) => ({
      id: p.id as string,
      title: p.title as string,
      description: p.description as string,
      type: p.type as string,
      price: p.price as number,
      city: p.city as string,
      location: p.location as string,
      district: p.district as string,
      bedrooms: p.bedrooms as number,
      bathrooms: p.bathrooms as number,
      area: p.area as number,
      features: p.features as string[],
      images: p.images as string[],
      license_number: p.license_number as string,
    })),
    officeId,
    knowledgeMap,
  );

  return NextResponse.json({
    success: true,
    message: `تم إنشاء ${result.success} إعلان`,
    result,
  });
}
