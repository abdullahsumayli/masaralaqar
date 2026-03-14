/**
 * WhatsApp Message Queue — BullMQ queue definition
 *
 * Architecture:
 *   Webhook (Next.js API) ──enqueue──▶ Redis Queue ──dequeue──▶ Worker Process
 *
 *   The webhook pushes a lightweight job payload into the queue and returns
 *   immediately (< 50ms). The separate worker process picks up jobs, calls
 *   the AI engine, sends the reply, and stores the conversation.
 *
 * Rate control:
 *   Limiter is set to 5 jobs per second per queue to avoid WhatsApp
 *   throttling. Each office's messages go through the same queue but
 *   the worker applies per-instance rate limiting via BullMQ's
 *   built-in rate limiter.
 *
 * Retry strategy:
 *   3 attempts with exponential backoff (2s, 4s, 8s).
 *   After final failure → stored in `failed_messages` table.
 */

import { getRedisConnectionOptions } from "@/lib/redis";
import { Queue } from "bullmq";

// ── Job Payload ─────────────────────────────────────────────

export interface WhatsAppJobPayload {
  /** Unique message ID from Evolution API (idempotency key) */
  messageId: string;
  /** Sender's phone number (without @s.whatsapp.net) */
  phone: string;
  /** Message text content */
  message: string;
  /** Office ID resolved from the Evolution instance name */
  officeId: string;
  /** Business phone number of the office's WhatsApp session */
  businessPhone: string;
  /** ISO timestamp when the message was received */
  timestamp: string;
  /**
   * Routing path: "evolution" for the modern office-based path,
   * "legacy" for the tenant-based webhook secret path.
   */
  route: "evolution" | "legacy";
  /** Only present for legacy route — tenant context */
  tenantId?: string;
  /** Sender name if available */
  senderName?: string;
}

// ── Queue Configuration ─────────────────────────────────────

const QUEUE_NAME = "whatsapp-messages";

/**
 * Default job options applied to every job.
 *   attempts: 3 retries before the job is considered failed
 *   backoff: exponential 2^attempt seconds (2s → 4s → 8s)
 *   removeOnComplete: keep last 500 completed jobs for monitoring
 *   removeOnFail: keep last 1000 failed jobs for debugging
 */
const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 2000,
  },
  removeOnComplete: { count: 500 },
  removeOnFail: { count: 1000 },
};

// ── Queue Instance ──────────────────────────────────────────

let _queue: Queue<WhatsAppJobPayload> | null = null;

/**
 * Get or create the message queue singleton.
 * Uses lazy initialization so the Next.js server only creates
 * a Redis connection when the first message arrives.
 */
export function getMessageQueue(): Queue<WhatsAppJobPayload> {
  if (!_queue) {
    _queue = new Queue<WhatsAppJobPayload>(QUEUE_NAME, {
      connection: getRedisConnectionOptions(),
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    });
  }
  return _queue;
}

/**
 * Enqueue a WhatsApp message for async processing.
 * Called from the webhook handler.
 *
 * @returns The BullMQ Job instance (for monitoring/testing)
 */
export async function enqueueMessage(payload: WhatsAppJobPayload) {
  const queue = getMessageQueue();
  return queue.add("process-message", payload, {
    // Use messageId as the job ID for deduplication.
    // BullMQ will reject duplicate job IDs that are still in the queue.
    jobId: payload.messageId,
  });
}

/** Queue name constant for the worker to reference */
export { QUEUE_NAME };
