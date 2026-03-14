/**
 * Sentry Error Tracking — centralized error capture
 *
 * Architecture:
 *   ┌───────────────┐
 *   │  Webhook      │──┐
 *   │  Worker       │──┤   captureError()
 *   │  AI Engine    │──├──────────────────▶ Sentry.io
 *   │  Payments     │──┤
 *   │  Redis        │──┘
 *   └───────────────┘
 *
 * Usage:
 *   import { captureError, captureMessage } from "@/lib/sentry";
 *   captureError(error, { module: "Webhook", action: "processMessage" });
 *
 * Environment variables:
 *   SENTRY_DSN          — Sentry project DSN
 *   SENTRY_ENVIRONMENT  — e.g. "production", "staging"
 */

import { logger } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";

const MODULE = "Sentry";

let _initialized = false;

/**
 * Initialize Sentry SDK. Safe to call multiple times — only runs once.
 */
export function initSentry(): void {
  if (_initialized) return;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    logger.warn(MODULE, "SENTRY_DSN not set — error tracking disabled");
    return;
  }

  Sentry.init({
    dsn,
    environment:
      process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    debug: process.env.NODE_ENV !== "production",
    // Reduce noise from third-party scripts
    ignoreErrors: [
      "ResizeObserver loop",
      "Loading chunk",
      "Non-Error promise rejection",
    ],
  });

  _initialized = true;
  logger.info(MODULE, "Sentry initialized", {
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  });
}

/**
 * Capture an error with structured context.
 * Logs locally AND sends to Sentry if configured.
 */
export function captureError(
  error: unknown,
  context?: {
    module?: string;
    action?: string;
    userId?: string;
    officeId?: string;
    extra?: Record<string, unknown>;
  },
): void {
  const err = error instanceof Error ? error : new Error(String(error));

  // Always log locally
  logger.error(
    context?.module || MODULE,
    context?.action || "unhandled-error",
    err,
    {
      userId: context?.userId,
      officeId: context?.officeId,
      ...context?.extra,
    },
  );

  // Send to Sentry if initialized
  if (_initialized) {
    Sentry.withScope((scope) => {
      if (context?.module) scope.setTag("module", context.module);
      if (context?.action) scope.setTag("action", context.action);
      if (context?.userId) scope.setUser({ id: context.userId });
      if (context?.officeId) scope.setTag("officeId", context.officeId);
      if (context?.extra) scope.setExtras(context.extra);
      Sentry.captureException(err);
    });
  }
}

/**
 * Capture a non-error message (warnings, notable events).
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>,
): void {
  logger.info(MODULE, message, context);

  if (_initialized) {
    Sentry.withScope((scope) => {
      if (context) scope.setExtras(context);
      Sentry.captureMessage(message, level);
    });
  }
}
