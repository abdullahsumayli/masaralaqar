/**
 * WhatsApp Message Worker — BullMQ worker process
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  ARCHITECTURE                                               ║
 * ║                                                              ║
 * ║  This file runs as a SEPARATE Node.js process from Next.js.  ║
 * ║                                                              ║
 * ║  Flow:                                                       ║
 * ║  Webhook → Redis Queue → THIS WORKER → AI Engine → Reply     ║
 * ║                                                              ║
 * ║  Start with:  npm run worker                                  ║
 * ║  Or:          npx tsx src/workers/message.worker.ts           ║
 * ║                                                              ║
 * ║  The worker dequeues jobs from the "whatsapp-messages" queue, ║
 * ║  processes them through the AI engine, sends replies via      ║
 * ║  Evolution API, and stores conversations in Supabase.         ║
 * ║                                                              ║
 * ║  Retry: 3 attempts, exponential backoff (2s → 4s → 8s)      ║
 * ║  Rate:  max 5 messages/second to avoid WhatsApp throttling   ║
 * ║  Dead letter: failed jobs → failed_messages table            ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { logger } from "@/lib/logger";
import { getRedisConnectionOptions } from "@/lib/redis";
import { captureError, initSentry } from "@/lib/sentry";
import { QUEUE_NAME, type WhatsAppJobPayload } from "@/queues/message.queue";
import { METRIC, MetricsService } from "@/services/metrics.service";
import { Job, Worker } from "bullmq";

// ── Service imports ─────────────────────────────────────────
import { WhatsAppService } from "@/integrations/whatsapp";
import { supabaseAdmin } from "@/lib/supabase";
import { SubscriptionRepository } from "@/repositories/subscription.repo";
import { AIEngine } from "@/services/ai-engine.service";
import { AIService } from "@/services/ai.service";
import { ConversationService } from "@/services/conversation.service";
import { LeadService } from "@/services/lead.service";
import { PropertyService } from "@/services/property.service";
import { TenantService } from "@/services/tenant.service";
import type { TenantContext } from "@/types/message";
import type { Property, PropertyType } from "@/types/property";

// Initialize Sentry for the worker process
initSentry();

const MODULE = "MessageWorker";

// ── Per-instance rate limiter (5 msg/sec per office instance) ──

const instanceTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 1000;
const RATE_LIMIT_MAX = 5;

async function waitForRateLimit(officeId: string): Promise<void> {
  const now = Date.now();
  const timestamps = instanceTimestamps.get(officeId) || [];

  // Remove timestamps outside the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    // Wait until the oldest timestamp expires
    const waitMs = RATE_LIMIT_WINDOW_MS - (now - recent[0]);
    if (waitMs > 0) {
      logger.debug(
        MODULE,
        `Rate limit: waiting ${waitMs}ms for office ${officeId}`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    // Recalculate after waiting
    const afterWait = recent.filter(
      (t) => Date.now() - t < RATE_LIMIT_WINDOW_MS,
    );
    afterWait.push(Date.now());
    instanceTimestamps.set(officeId, afterWait);
  } else {
    recent.push(now);
    instanceTimestamps.set(officeId, recent);
  }
}

// ── Job Processor ───────────────────────────────────────────

async function processJob(job: Job<WhatsAppJobPayload>): Promise<void> {
  const {
    messageId,
    phone,
    message,
    officeId,
    businessPhone,
    route,
    tenantId,
  } = job.data;

  logger.info(MODULE, `Processing job ${job.id}`, {
    messageId,
    phone,
    officeId,
    route,
    attempt: job.attemptsMade + 1,
  });

  // Track queue wait time
  const queueWaitMs = Date.now() - job.timestamp;
  MetricsService.trackTiming(METRIC.QUEUE_WAIT_TIME, queueWaitMs, { officeId });

  // Check subscription limits before processing
  const limitCheck = await SubscriptionRepository.checkLimit(
    officeId,
    "whatsapp_message",
  );
  if (!limitCheck.allowed) {
    logger.warn(
      MODULE,
      `Office ${officeId} exceeded WhatsApp message limit (${limitCheck.used}/${limitCheck.limit})`,
    );
    // Send a polite limit-exceeded message to the customer
    await WhatsAppService.sendMessage(
      phone,
      "عذراً، تم الوصول للحد الأقصى من الرسائل لهذا المكتب. يرجى التواصل مباشرة.",
      officeId,
    ).catch(() => {});
    return;
  }

  // Apply per-instance rate limiting
  await waitForRateLimit(officeId);

  const jobStart = Date.now();
  if (route === "evolution") {
    await processEvolutionMessage(job.data);
  } else {
    await processLegacyMessage(job.data);
  }

  MetricsService.track(METRIC.MESSAGES_PROCESSED, 1, { officeId, route });
  logger.info(MODULE, `Job ${job.id} completed`, {
    messageId,
    officeId,
    durationMs: Date.now() - jobStart,
  });
}

// ── Evolution API Path (modern office-based routing) ────────

async function processEvolutionMessage(
  data: WhatsAppJobPayload,
): Promise<void> {
  const { phone, message, officeId, businessPhone, messageId } = data;

  // 1. Create or update lead (evolution path: officeId, not tenantId)
  const lead = await LeadService.createLeadFromMessage(
    officeId,  // used as tenantId fallback
    phone,
    data.senderName || "",
    message,
    "whatsapp",
    officeId,  // explicit officeId for office_id column
  );

  // 2. Save incoming message
  if (lead) {
    await ConversationService.saveUserMessage(officeId, lead.id, message, officeId);
  }

  // 3. Get conversation history for AI context
  const conversationHistory = lead
    ? await ConversationService.getConversationHistory(lead.id, 12)
    : [];

  // 4. Process via AI Engine (with latency tracking)
  const aiStart = Date.now();
  const engineResult = await AIEngine.processMessage(
    businessPhone,
    { phone, text: message, messageId },
    conversationHistory,
  );
  MetricsService.trackTiming(METRIC.AI_RESPONSE_TIME, Date.now() - aiStart, {
    officeId,
  });

  if (!engineResult) {
    logger.warn(MODULE, "AI Engine returned null — sending fallback", {
      officeId,
      phone,
    });
    await WhatsAppService.sendMessage(
      phone,
      "مرحباً! شكراً لتواصلك. سيتم الرد عليك في أقرب وقت ممكن.",
      officeId,
    ).catch(() => {});
    return;
  }

  // 5. Save assistant reply
  if (lead) {
    await ConversationService.saveAssistantMessage(
      officeId,
      lead.id,
      engineResult.reply,
      officeId,
    );
  }

  // 6. Send reply via Evolution API
  const sent = await WhatsAppService.sendMessage(
    phone,
    engineResult.reply,
    officeId,
  );
  if (!sent) {
    throw new Error(
      `Failed to send WhatsApp reply to ${phone} for office ${officeId}`,
    );
  }

  // 7. Track usage
  await SubscriptionRepository.incrementUsage(
    officeId,
    "whatsapp_message",
  ).catch(() => {});

  // 8. Send property images (max 3)
  if (engineResult.properties?.length) {
    let imagesSent = 0;
    for (const property of engineResult.properties) {
      if (imagesSent >= 3) break;
      const images = property.images;
      const imageUrl =
        (Array.isArray(images) ? images[0] : undefined) || property.image_url;
      if (imageUrl) {
        const caption = `🏠 ${property.title}\n📍 ${property.city || property.location}\n💰 ${(property.price as number)?.toLocaleString()} ريال`;
        await WhatsAppService.sendMediaMessage(
          phone,
          imageUrl as string,
          caption,
          officeId,
        );
        imagesSent++;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }
}

// ── Legacy Path (tenant-based webhook secret routing) ───────

async function processLegacyMessage(data: WhatsAppJobPayload): Promise<void> {
  const { phone, message, officeId, messageId, tenantId } = data;

  if (!tenantId) {
    throw new Error("Legacy route requires tenantId");
  }

  // 1. Resolve tenant
  const tenant = await TenantService.getTenantById(tenantId);
  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantId}`);
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

  // 2. Create or update lead
  const lead = await LeadService.createLeadFromMessage(
    tenant.id,
    phone,
    "",
    message,
  );

  // 3. Save incoming message
  if (lead) {
    await ConversationService.saveUserMessage(tenant.id, lead.id, message);
  }

  // 4. Get conversation history
  const conversationHistory = lead
    ? await ConversationService.getConversationHistory(lead.id, 12)
    : [];

  // 5. AI Engine (legacy path)
  const engineResult = await AIEngine.processMessageLegacy(
    tenant.id,
    { phone, text: message, messageId },
    conversationHistory,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let response: { reply: string; properties?: any[]; suggestions?: string[] };
  if (engineResult) {
    response = engineResult;
    await SubscriptionRepository.incrementUsage(
      tenant.id,
      "whatsapp_message",
    ).catch(() => {});
  } else {
    // Fallback to direct AIService
    const analysis = AIService.analyzeMessage(message, tenantContext);
    let matchedProperties: Property[] = [];
    if (analysis.extractedData.propertyType || analysis.extractedData.budget) {
      const searchResult = await PropertyService.searchProperties(tenant.id, {
        type: analysis.extractedData.propertyType as PropertyType | undefined,
        minPrice: analysis.extractedData.budget?.min,
        maxPrice: analysis.extractedData.budget?.max,
        city: analysis.extractedData.city,
        bedrooms: analysis.extractedData.bedrooms,
      });
      matchedProperties = (searchResult.properties || []) as Property[];
    }
    response = await AIService.generateSmartReply(
      message,
      matchedProperties,
      tenantContext,
      conversationHistory,
    );
  }

  // 6. Save assistant reply
  if (lead) {
    await ConversationService.saveAssistantMessage(
      tenant.id,
      lead.id,
      response.reply,
    );
  }

  // 7. Update lead preferences
  const analysis = AIService.analyzeMessage(message, tenantContext);
  if (lead && Object.keys(analysis.extractedData).length > 0) {
    await LeadService.updateLeadPreferences(tenant.id, phone, {
      city: analysis.extractedData.city,
      budget: analysis.extractedData.budget,
      propertyType: analysis.extractedData.propertyType,
      bedrooms: analysis.extractedData.bedrooms,
    });
  }

  // 8. Legacy conversation_history JSONB (backward compat)
  if (lead) {
    await LeadService.addMessageToLead(
      tenant.id,
      lead.id,
      response.reply,
      "outgoing",
    );
  }

  // 9. Send reply
  const sent = await WhatsAppService.sendMessage(
    phone,
    response.reply,
    tenant.id,
  );
  if (!sent) {
    throw new Error(
      `Failed to send WhatsApp reply to ${phone} for tenant ${tenant.id}`,
    );
  }

  // 10. Send property images (max 3)
  if (response.properties?.length) {
    let imagesSent = 0;
    for (const property of response.properties) {
      if (imagesSent >= 3) break;
      const images = property.images;
      const imageUrl =
        (Array.isArray(images) ? images[0] : undefined) || property.image_url;
      if (imageUrl) {
        const caption = `🏠 ${property.title}\n📍 ${property.city || property.location}\n💰 ${(property.price as number)?.toLocaleString()} ريال`;
        await WhatsAppService.sendMediaMessage(
          phone,
          imageUrl as string,
          caption,
          tenant.id,
        );
        imagesSent++;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  // 11. Send suggestions
  if (response.suggestions?.length) {
    const suggestionsText =
      "📋 اقتراحات:\n" + response.suggestions.map((s) => `• ${s}`).join("\n");
    await WhatsAppService.sendMessage(phone, suggestionsText, tenant.id);
  }
}

// ── Dead Letter Handler ─────────────────────────────────────

async function handleFailedJob(
  job: Job<WhatsAppJobPayload> | undefined,
  error: Error,
): Promise<void> {
  if (!job) return;

  logger.error(
    MODULE,
    `Job ${job.id} failed permanently after ${job.attemptsMade} attempts`,
    error,
    {
      messageId: job.data.messageId,
      officeId: job.data.officeId,
      phone: job.data.phone,
    },
  );

  captureError(error, {
    module: MODULE,
    action: "handleFailedJob",
    officeId: job.data.officeId,
    extra: { messageId: job.data.messageId, attempts: job.attemptsMade },
  });
  MetricsService.track(METRIC.FAILED_MESSAGES, 1, {
    officeId: job.data.officeId,
  });

  // Persist to failed_messages table for operator review
  try {
    await supabaseAdmin.from("failed_messages").insert({
      message_id: job.data.messageId,
      phone: job.data.phone,
      message_text: job.data.message,
      office_id: job.data.officeId,
      route: job.data.route,
      tenant_id: job.data.tenantId || null,
      error_message: error.message,
      error_stack: error.stack?.slice(0, 2000),
      attempts: job.attemptsMade,
      job_data: job.data,
    });
    logger.info(MODULE, `Stored failed job ${job.id} in failed_messages`);
  } catch (dbError) {
    logger.error(MODULE, "Failed to store dead letter in DB", dbError);
  }
}

// ── Worker Startup ──────────────────────────────────────────

logger.info(MODULE, "Starting WhatsApp message worker...");

const worker = new Worker<WhatsAppJobPayload>(QUEUE_NAME, processJob, {
  connection: getRedisConnectionOptions(),
  // Rate control: process up to 5 jobs per second
  limiter: {
    max: 5,
    duration: 1000,
  },
  // Process one job at a time per worker instance
  // Scale horizontally by running multiple worker processes
  concurrency: 3,
});

// ── Event Listeners (monitoring) ────────────────────────────

worker.on("completed", (job) => {
  logger.info(MODULE, `✓ Job completed`, {
    jobId: job.id,
    messageId: job.data.messageId,
    officeId: job.data.officeId,
    duration: Date.now() - job.timestamp,
  });
});

worker.on("failed", (job, error) => {
  if (!job) return;

  if (job.attemptsMade < (job.opts.attempts || 3)) {
    // Will be retried
    logger.warn(
      MODULE,
      `Job ${job.id} failed (attempt ${job.attemptsMade}), will retry`,
      {
        messageId: job.data.messageId,
        error: error.message,
      },
    );
  } else {
    // Final failure → dead letter
    handleFailedJob(job, error);
  }
});

worker.on("error", (error) => {
  logger.error(MODULE, "Worker error", error);
  captureError(error, { module: MODULE, action: "worker-error" });
});

worker.on("stalled", (jobId) => {
  logger.warn(MODULE, `Job ${jobId} stalled — will be re-processed`);
});

// ── Graceful Shutdown ───────────────────────────────────────

async function shutdown(signal: string) {
  logger.info(MODULE, `Received ${signal}, shutting down gracefully...`);
  await worker.close();
  logger.info(MODULE, "Worker stopped");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

logger.info(MODULE, `Worker running — listening to queue "${QUEUE_NAME}"`, {
  concurrency: 3,
  rateLimitMax: 5,
  rateLimitDuration: "1000ms",
  retryAttempts: 3,
});
