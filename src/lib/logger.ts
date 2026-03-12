/**
 * Centralized Logger — structured logging for production
 */

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

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatLog(
  level: LogLevel,
  module: string,
  message: string,
  meta?: Record<string, unknown>,
): string {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] [${module}] ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
}

export const logger = {
  debug(module: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("debug"))
      console.debug(formatLog("debug", module, message, meta));
  },

  info(module: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("info"))
      console.info(formatLog("info", module, message, meta));
  },

  warn(module: string, message: string, meta?: Record<string, unknown>) {
    if (shouldLog("warn"))
      console.warn(formatLog("warn", module, message, meta));
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
    console.error(
      formatLog("error", module, message, { ...errorInfo, ...meta }),
    );
  },
};
