import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import winston, {
  createLogger,
  format,
  type Logger,
  transports,
} from "winston";
import "winston-daily-rotate-file";
import { v7 as uuidv7 } from "uuid";

const LOG_DIR = path.resolve("./.logs");
const APP_STAGE = (process.env.APP_STAGE ?? "").trim().toUpperCase();
const IS_MULTILINE_STAGE = APP_STAGE === "DEV" || APP_STAGE === "QA";
const LOG_LEVEL =
  process.env.LOG_LEVEL ?? (IS_MULTILINE_STAGE ? "debug" : "info");
const LOG_TO_FILE = process.env.LOG_TO_FILE === "true";

const { combine, errors, json, timestamp, colorize, printf } = format;

const IST_OFFSET_MINUTES = 330; // IST is  UTC+05:30
// Zero-padding helpers for stable, sortable timestamps.
// We avoid locale-based formatting so logs stay consistent across environments.
const pad2 = (n: number) => String(n).padStart(2, "0");
const pad3 = (n: number) => String(n).padStart(3, "0");
const istTimestamp = () => {
  const d = new Date(Date.now() + IST_OFFSET_MINUTES * 60_000);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}T${pad2(
    d.getUTCHours(),
  )}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}.${pad3(d.getUTCMilliseconds())}`;
};

let logDirInitialized = false;

const ensureLogDirectoryExists = (dir: fs.PathLike) => {
  if (logDirInitialized) return;
  logDirInitialized = true;

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {
    // Logger isn't initialized yet; avoid recursive logger failures.
    console.error("Error creating log directory", e);
  }
};

const devConsoleFormat = printf(
  ({ timestamp, level, message, stack, ...meta }) => {
    const metaKeys = Object.keys(meta);
    const metaSuffix = metaKeys.length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";

    const ts = typeof timestamp === "string" ? timestamp : String(timestamp);
    const lvl = typeof level === "string" ? level : String(level);
    const msg = typeof message === "string" ? message : String(message);
    const st = typeof stack === "string" ? `\n${stack}` : "";

    return `${ts} [${lvl}] ${msg}${st}${metaSuffix}`;
  },
);

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "grey",
  },
};

winston.addColors(customLevels.colors);

const prodJsonFormat = combine(
  errors({ stack: true }),
  timestamp({ format: istTimestamp }),
  json(),
);

const devPrettyFormat = combine(
  colorize({ all: true }),
  errors({ stack: true }),
  timestamp({ format: istTimestamp }),
  devConsoleFormat,
);

const createDailyRotateFileTransport = (
  serviceName: string,
  type: string,
  level?: string,
) => {
  return new transports.DailyRotateFile({
    level,
    datePattern: "YYYY-MM-DD",
    filename: path.join(LOG_DIR, `${serviceName}-${type}-%DATE%.log`),
    format: prodJsonFormat,
    maxSize: "100m",
    maxFiles: "10d",
    zippedArchive: true,
  });
};

const createWinstonLogger = (serviceName: string): Logger => {
  const loggerTransports: winston.transport[] = [
    new transports.Console({
      level: LOG_LEVEL,
      format: IS_MULTILINE_STAGE ? devPrettyFormat : prodJsonFormat,
    }),
  ];

  const exceptionHandlers: winston.transport[] = [];
  const rejectionHandlers: winston.transport[] = [];

  if (LOG_TO_FILE) {
    ensureLogDirectoryExists(LOG_DIR);

    loggerTransports.push(
      createDailyRotateFileTransport(serviceName, "combined"),
      createDailyRotateFileTransport(serviceName, "error", "error"),
    );

    exceptionHandlers.push(
      createDailyRotateFileTransport(serviceName, "exceptions", "error"),
    );

    rejectionHandlers.push(
      createDailyRotateFileTransport(serviceName, "rejections", "error"),
    );
  }

  return createLogger({
    level: LOG_LEVEL,
    levels: customLevels.levels,
    defaultMeta: {
      service: serviceName,
      pid: process.pid,
      host: os.hostname(),
      logVersion: 1,
    },
    exceptionHandlers,
    rejectionHandlers,
    exitOnError: false,
    transports: loggerTransports,
  });
};

const loggers: Record<string, Logger | undefined> = {};

const getLogger = (serviceName: string = "app"): Logger => {
  const existing = loggers[serviceName];
  if (existing) return existing;

  const loggerInstance = createWinstonLogger(serviceName);
  loggers[serviceName] = loggerInstance;

  return loggerInstance;
};

export const appLogger = getLogger("app");
export const logger = appLogger;
export default getLogger;

/**
 * Create a child logger with a correlationId for request/job tracing.
 * If you pass `correlationId`, it will be used as-is; otherwise a UUID is generated.
 */
export const getCorrelationLogger = (
  serviceName: string = "app",
  correlationId?: string,
): Logger => {
  const cid = correlationId ?? uuidv7();

  return getLogger(serviceName).child({ correlationId: cid, traceId: cid });
};

export const withTiming = async <T>(
  log: Logger,
  message: string,
  fn: () => Promise<T>,
): Promise<T> => {
  const start = Date.now();
  try {
    const result = await fn();
    log.info(message, { durationMs: Date.now() - start });
    return result;
  } catch (error) {
    log.error(message, { durationMs: Date.now() - start, error });
    throw error;
  }
};
