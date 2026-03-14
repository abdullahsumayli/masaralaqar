/**
 * Centralized Logger — structured logging for production
 *
 * Architecture:
 *   ┌──────────┐    ┌────────────┐    ┌──────────────┐
 *   │ Services  │───▶│   Logger   │───▶│  Console/File │
 *   │ Webhook   │    │ (this file)│    │  + Sentry     │
 *   │ Worker    │    └────────────┘    └──────────────┘
 *   │ Payments  │
 *   └──────────┘
 *
 * Log format (JSON in production, readable in dev):
 *   { timestamp, level, service, event, status, duration, ...metadata }
 *
 * Destinations:
 *   - console   (always — development & production)
 *   - file logs  (production — written to logs/ directory)
 */

import * as fs from "fs";
import * as path from "path";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "info" : "debug");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// File logging setup for production
let logStream: fs.WriteStream | null = null;

function getLogStream(): fs.WriteStream | null {
  if (!IS_PRODUCTION) return null;
  if (logStream) return logStream;

  try {
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const date = new Date().toISOString().slice(0, 10);
    logStream = fs.createWriteStream(path.join(logsDir, `masar-${date}.log`), {
      flags: "a",
    });
    return logStream;
  } catch {
    return null;
  }
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  event: string;
  status?: "success" | "error" | "pending";
  duration?: number;
  [key: string]: unknown;
}

function buildEntry(
  level: LogLevel,
  module: string,
  message: string,
  meta?: Record<string, unknown>,
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    service: module,
    event: message,
    ...meta,
  };
}

function writeLog(entry: LogEntry): void {
  const json = JSON.stringify(entry);

  // Console output
  if (IS_PRODUCTION) {
    // JSON format for production log aggregation
    switch (entry.level) {
      case "error":
        console.error(json);
        break;
      case "warn":
        console.warn(json);
        break;
      case "debug":
        console.debug(json);
        break;
      default:
        console.info(json);
    }
  } else {
    // Readable format for development
    const readable = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.service}] ${entry.event}${
      Object.keys(entry).length > 4
        ? " " +
          JSON.stringify(
            Object.fromEntries(
              Object.entries(entry).filter(
                ([k]) =>
                  !["timestamp", "level", "service", "event"].includes(k),
              ),
            ),
          )
        : ""
    }`;
    switch (entry.level) {
      case "error":
        console.error(readable);
        break;
      case "warn":
        console.warn(readable);
        break;
      case "debug":
        console.debug(readable);
        break;
      default:
        console.info(readable);
    }
  }

  // File output in production
  const stream = getLogStream();
  if (stream) {
    stream.write(json + "\n");
  }
}

export const logger = {
  debug(module: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("debug"))
      writeLog(buildEntry("debug", module, message, meta));
  },

  info(module: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("info")) writeLog(buildEntry("info", module, message, meta));
  },

  warn(module: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("warn")) writeLog(buildEntry("warn", module, message, meta));
  },

  error(
    module: string,
    message: string,
    error?: unknown,
    meta?: Record<string, unknown>,
  ) {
    if (!shouldLog("error")) return;
    const errorInfo =
      error instanceof Error
        ? { errorMessage: error.message, stack: error.stack }
        : error
          ? { errorMessage: String(error) }
          : {};
    writeLog(
      buildEntry("error", module, message, {
        status: "error",
        ...errorInfo,
        ...meta,
      }),
    );
  },

  /**
   * Time a function and log its duration.
   * Usage: const result = await logger.timed("AI", "generate-reply", () => ai.generate(...))
   */
  async timed<T>(
    module: string,
    event: string,
    fn: () => Promise<T>,
    meta?: Record<string, unknown>,
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      if (shouldLog("info")) {
        writeLog(
          buildEntry("info", module, event, {
            status: "success",
            duration,
            ...meta,
          }),
        );
      }
      return result;
    } catch (err) {
      const duration = Date.now() - start;
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (shouldLog("error")) {
        writeLog(
          buildEntry("error", module, event, {
            status: "error",
            duration,
            errorMessage: errorMsg,
            ...meta,
          }),
        );
      }
      throw err;
    }
  },
};
