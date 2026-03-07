/**
 * WhatsApp Webhook Handler
 * Receives messages from UltraMsg API
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { AIService } from "@/services/ai.service";
import { LeadService } from "@/services/lead.service";
import { PropertyService } from "@/services/property.service";
import { TenantService } from "@/services/tenant.service";
import { TenantContext } from "@/types/message";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  console.error("WEBHOOK_SECRET environment variable is not set");
}

// Simple in-memory cache to prevent duplicate message processing
const processedMessages = new Set<string>();
const MAX_CACHE_SIZE = 1000;

// Clean old messages from cache periodically
function addToProcessedCache(messageId: string) {
  if (processedMessages.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries (first 100)
    const iterator = processedMessages.values();
    for (let i = 0; i < 100; i++) {
      const value = iterator.next().value;
      if (value) processedMessages.delete(value);
    }
  }
  processedMessages.add(messageId);
}

/**
 * GET: Webhook verification
 * UltraMsg sends GET requests to verify the webhook URL
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");

  // Simple secret verification
  if (WEBHOOK_SECRET && secret === WEBHOOK_SECRET) {
    console.log("UltraMsg Webhook verified");
    return NextResponse.json({ status: "ok", message: "Webhook verified" });
  }

  // WhatsApp Cloud API verification (fallback)
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (WEBHOOK_SECRET && mode === "subscribe" && token === WEBHOOK_SECRET) {
    console.log("Webhook verified");
    return new NextResponse(challenge || "ok");
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * POST: Handle incoming messages from UltraMsg
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from query
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get("secret");

    // Verify secret
    if (secret !== WEBHOOK_SECRET) {
      console.warn("Invalid webhook secret received");
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    // Parse request body
    const bodyText = await request.text();
    console.log("Webhook received:", bodyText);

    let payload: any;
    try {
      payload = JSON.parse(bodyText);
    } catch {
      // UltraMsg may send form-urlencoded data
      const formData = new URLSearchParams(bodyText);
      payload = {
        data: {
          from: formData.get("from"),
          body: formData.get("body"),
          id: formData.get("id"),
          fromMe: formData.get("fromMe"),
          type: formData.get("type"),
        },
      };
    }

    // Skip outgoing messages early (before parsing)
    if (payload?.data?.fromMe === true || payload?.data?.fromMe === "true") {
      console.log("Skipping outgoing message (fromMe=true)");
      return NextResponse.json({
        success: true,
        message: "Outgoing message ignored",
      });
    }

    // Parse incoming message using UltraMsg format
    const message = WhatsAppService.parseIncomingMessage(payload);

    if (!message) {
      console.log("No valid message in payload");
      return NextResponse.json({
        success: true,
        message: "No message to process",
      });
    }

    // Check if message was already processed (prevent duplicates)
    if (processedMessages.has(message.id)) {
      console.log("Duplicate message skipped:", message.id);
      return NextResponse.json({ success: true, message: "Duplicate ignored" });
    }

    // Add to processed cache
    addToProcessedCache(message.id);

    console.log("Received message:", message);

    // Lookup tenant by webhook secret for multi-tenant routing
    const tenant = await TenantService.getTenantByWebhook(secret!);

    if (!tenant) {
      console.warn("No tenant found for this webhook secret");
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 },
      );
    }

    const defaultAiPersona = {
      agentName: "مساعد مسار العقار",
      responseStyle: "friendly" as const,
      welcomeMessage: "السلام عليكم ورحمة الله وبركاته، أهلاً بك في مسار العقار 🏠",
    };

    const tenantContext: TenantContext = {
      tenantId: tenant.id,
      whatsappNumber: tenant.whatsappNumber,
      aiPersona: tenant.aiPersona || defaultAiPersona,
    };

    // Create or update lead
    const lead = await LeadService.createLeadFromMessage(
      tenant.id,
      message.phone,
      "",
      message.text,
    );

    // Analyze message
    const analysis = AIService.analyzeMessage(message.text, tenantContext);
    console.log("Message analysis:", analysis);

    // Search for matching properties
    let matchedProperties: any[] = [];
    if (analysis.extractedData.propertyType || analysis.extractedData.budget) {
      const searchResult = await PropertyService.searchProperties(tenant.id, {
        type: analysis.extractedData.propertyType as import("@/types/property").PropertyType | undefined,
        minPrice: analysis.extractedData.budget?.min,
        maxPrice: analysis.extractedData.budget?.max,
        city: analysis.extractedData.city,
        bedrooms: analysis.extractedData.bedrooms,
      });
      matchedProperties = searchResult.properties || [];
    }

    // Generate smart reply using GPT-4o-mini
    const response = await AIService.generateSmartReply(
      message.text,
      matchedProperties,
      tenantContext,
    );
    console.log("Generated response:", response.reply);

    // Update lead with preferences if extracted
    if (lead && Object.keys(analysis.extractedData).length > 0) {
      await LeadService.updateLeadPreferences(tenant.id, message.phone, {
        city: analysis.extractedData.city,
        budget: analysis.extractedData.budget,
        propertyType: analysis.extractedData.propertyType,
        bedrooms: analysis.extractedData.bedrooms,
      });
    }

    // Add response to conversation
    if (lead) {
      await LeadService.addMessageToLead(
        tenant.id,
        lead.id,
        response.reply,
        "outgoing",
      );
    }

    // Send reply back to user via UltraMsg
    const sent = await WhatsAppService.sendMessage(
      message.phone,
      response.reply,
      tenant.id,
    );

    if (!sent) {
      console.error("Failed to send WhatsApp reply");
    }

    // Send property images if available (max 3 images)
    if (response.properties && response.properties.length > 0) {
      let imagesSent = 0;
      for (const property of response.properties) {
        if (imagesSent >= 3) break; // Limit to 3 images

        const imageUrl = property.images?.[0] || property.image_url;
        if (imageUrl) {
          const caption = `🏠 ${property.title}\n📍 ${property.city || property.location}\n💰 ${property.price?.toLocaleString()} ريال`;
          await WhatsAppService.sendMediaMessage(
            message.phone,
            imageUrl,
            caption,
            tenant.id,
          );
          imagesSent++;
          // Small delay between image sends
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    // Send suggestions if any
    if (response.suggestions && response.suggestions.length > 0) {
      const suggestionsText =
        "📋 اقتراحات:\n" + response.suggestions.map((s) => `• ${s}`).join("\n");
      await WhatsAppService.sendMessage(
        message.phone,
        suggestionsText,
        tenant.id,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
