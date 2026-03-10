/**
 * WhatsApp Webhook Handler
 * Receives messages from Evolution API (primary) and UltraMsg (legacy fallback)
 * Integrated with AI Engine for multi-tenant office routing
 */

import { WhatsAppService } from "@/integrations/whatsapp";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { WhatsAppSessionRepository } from "@/repositories/whatsapp-session.repo";
import { AIEngine } from "@/services/ai-engine.service";
import { AIService } from "@/services/ai.service";
import { ConversationService } from "@/services/conversation.service";
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
    return NextResponse.json({ status: "ok", message: "Webhook verified" });
  }

  // WhatsApp Cloud API verification (fallback)
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (WEBHOOK_SECRET && mode === "subscribe" && token === WEBHOOK_SECRET) {
    return new NextResponse(challenge || "ok");
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * POST: Handle incoming messages from Evolution API or UltraMsg
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const bodyText = await request.text();

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

    // ── Evolution API Format ──────────────────────────────────────
    if (payload?.instance && payload?.event) {
      const officeId = (payload.instance as string).replace("office_", "");

      // Handle connection status updates
      if (payload.event === "connection.update") {
        const isOpen = payload.data?.state === "open";
        const session = await WhatsAppSessionRepository.getByOfficeId(officeId);
        if (session) {
          await WhatsAppSessionRepository.updateStatus(
            session.id,
            isOpen ? "connected" : "disconnected",
          );
        }
        return NextResponse.json({ ok: true });
      }

      // Handle incoming messages
      if (payload.event === "messages.upsert") {
        const msg = payload.data?.messages?.[0];
        if (!msg || msg.key?.fromMe) {
          return NextResponse.json({ ok: true });
        }

        const from = msg.key?.remoteJid?.replace("@s.whatsapp.net", "") ?? "";
        const text =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          "";
        const messageId = msg.key?.id || `evo_${Date.now()}`;

        if (!from || !text) {
          return NextResponse.json({ ok: true });
        }

        // Deduplicate
        if (processedMessages.has(messageId)) {
          return NextResponse.json({ ok: true });
        }
        addToProcessedCache(messageId);

        // Get the business phone from DB session for AI Engine routing
        const session = await WhatsAppSessionRepository.getByOfficeId(officeId);
        const businessPhone = session?.phoneNumber || "";

        if (!businessPhone) {
          console.error(
            `[Webhook] No session phone found for office: ${officeId}`,
          );
          return NextResponse.json({ ok: true });
        }

        // Create or update lead
        const lead = await LeadService.createLeadFromMessage(
          officeId,
          from,
          "",
          text,
        );

        // Save incoming message
        if (lead) {
          await ConversationService.saveUserMessage(officeId, lead.id, text);
        }

        // Get conversation history
        const conversationHistory = lead
          ? await ConversationService.getConversationHistory(lead.id, 12)
          : [];

        // Process via AI Engine (office-aware path)
        const engineResult = await AIEngine.processMessage(
          businessPhone,
          { phone: from, text, messageId },
          conversationHistory,
        );

        if (engineResult) {
          // Save assistant reply
          if (lead) {
            await ConversationService.saveAssistantMessage(
              officeId,
              lead.id,
              engineResult.reply,
            );
          }

          // Send reply via Evolution API
          await WhatsAppService.sendMessage(from, engineResult.reply, officeId);

          // Track usage
          await SubscriptionRepository.incrementUsage(
            officeId,
            "whatsapp_message",
          ).catch(() => {});

          // Send property images if available (max 3)
          if (engineResult.properties && engineResult.properties.length > 0) {
            let imagesSent = 0;
            for (const property of engineResult.properties) {
              if (imagesSent >= 3) break;
              const images = (property as any).images;
              const imageUrl =
                (Array.isArray(images) ? images[0] : undefined) ||
                (property as any).image_url;
              if (imageUrl) {
                const caption = `🏠 ${property.title}\n📍 ${property.city || property.location}\n💰 ${property.price?.toLocaleString()} ريال`;
                await WhatsAppService.sendMediaMessage(
                  from,
                  imageUrl,
                  caption,
                  officeId,
                );
                imagesSent++;
                await new Promise((resolve) => setTimeout(resolve, 500));
              }
            }
          }
        }

        return NextResponse.json({ ok: true });
      }

      // Other Evolution events — acknowledge
      return NextResponse.json({ ok: true });
    }

    // ── UltraMsg Legacy Format (fallback) ─────────────────────────
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get("secret");

    // Verify secret for UltraMsg
    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
    }

    // Skip outgoing messages early (before parsing)
    if (payload?.data?.fromMe === true || payload?.data?.fromMe === "true") {
      return NextResponse.json({
        success: true,
        message: "Outgoing message ignored",
      });
    }

    // Parse incoming message using UltraMsg format
    const message = WhatsAppService.parseIncomingMessage(payload);

    if (!message) {
      return NextResponse.json({
        success: true,
        message: "No message to process",
      });
    }

    // Check if message was already processed (prevent duplicates)
    if (processedMessages.has(message.id)) {
      return NextResponse.json({ success: true, message: "Duplicate ignored" });
    }

    // Add to processed cache
    addToProcessedCache(message.id);

    // Lookup tenant by webhook secret for multi-tenant routing
    const tenant = await TenantService.getTenantByWebhook(secret!);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const defaultAiPersona = {
      agentName: "مساعد مسار العقار",
      responseStyle: "friendly" as const,
      welcomeMessage:
        "السلام عليكم ورحمة الله وبركاته، أهلاً بك في مسار العقار 🏠",
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

    // ── MEMORY: save incoming user message ────────────────────────────────
    if (lead) {
      await ConversationService.saveUserMessage(
        tenant.id,
        lead.id,
        message.text,
      );
    }

    // ── MEMORY: fetch last 12 messages for GPT context ────────────────────
    const conversationHistory = lead
      ? await ConversationService.getConversationHistory(lead.id, 12)
      : [];

    // ── AI ENGINE: Process via central AI Engine (office-aware) ─────────
    const engineResult = await AIEngine.processMessageLegacy(
      tenant.id,
      { phone: message.phone, text: message.text, messageId: message.id },
      conversationHistory,
    );

    // Fallback to direct AIService if engine fails
    let response: { reply: string; properties?: any[]; suggestions?: string[] };
    if (engineResult) {
      response = engineResult;
      // Track WhatsApp message usage
      await SubscriptionRepository.incrementUsage(
        tenant.id,
        "whatsapp_message",
      ).catch(() => {});
    } else {
      // Legacy fallback
      const analysis = AIService.analyzeMessage(message.text, tenantContext);
      let matchedProperties: any[] = [];
      if (
        analysis.extractedData.propertyType ||
        analysis.extractedData.budget
      ) {
        const searchResult = await PropertyService.searchProperties(tenant.id, {
          type: analysis.extractedData.propertyType as
            | import("@/types/property").PropertyType
            | undefined,
          minPrice: analysis.extractedData.budget?.min,
          maxPrice: analysis.extractedData.budget?.max,
          city: analysis.extractedData.city,
          bedrooms: analysis.extractedData.bedrooms,
        });
        matchedProperties = searchResult.properties || [];
      }
      response = await AIService.generateSmartReply(
        message.text,
        matchedProperties,
        tenantContext,
        conversationHistory,
      );
    }

    // ── MEMORY: save assistant reply ──────────────────────────────────────
    if (lead) {
      await ConversationService.saveAssistantMessage(
        tenant.id,
        lead.id,
        response.reply,
      );
    }

    // Update lead with preferences if extracted
    const analysis = AIService.analyzeMessage(message.text, tenantContext);
    if (lead && Object.keys(analysis.extractedData).length > 0) {
      await LeadService.updateLeadPreferences(tenant.id, message.phone, {
        city: analysis.extractedData.city,
        budget: analysis.extractedData.budget,
        propertyType: analysis.extractedData.propertyType,
        bedrooms: analysis.extractedData.bedrooms,
      });
    }

    // Add response to legacy conversation_history JSONB (backward compat)
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
