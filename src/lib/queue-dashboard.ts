/**
 * Bull Board Queue Dashboard — BullMQ monitoring via Express adapter
 *
 * Architecture:
 *   Browser ──▶ /admin/queues (Next.js page, admin-only)
 *      │
 *      └──▶ /api/admin/queues (API route)
 *              │
 *              └──▶ Bull Board Express adapter
 *                      │
 *                      └──▶ Redis (whatsapp-messages queue)
 *
 * This module creates the Bull Board server adapter and configures
 * the whatsapp-messages queue for monitoring.
 */

import { getMessageQueue } from "@/queues/message.queue";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

let _serverAdapter: ExpressAdapter | null = null;

/**
 * Get or create the Bull Board Express adapter (singleton).
 * The adapter is an Express middleware that serves the Bull Board UI.
 */
export function getQueueDashboard(): ExpressAdapter {
  if (_serverAdapter) return _serverAdapter;

  _serverAdapter = new ExpressAdapter();
  _serverAdapter.setBasePath("/api/admin/queues");

  const queue = getMessageQueue();

  createBullBoard({
    queues: [new BullMQAdapter(queue)],
    serverAdapter: _serverAdapter,
  });

  return _serverAdapter;
}
