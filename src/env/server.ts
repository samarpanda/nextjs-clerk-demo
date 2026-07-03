import { z } from "zod";
import { createEnv } from "./create-env";

const serverSchema = z.object({
  DB_READ_URL: z.url("Database READ URL must be a valid URL"),
  DB_WRITE_URL: z.url("Database WRITE URL must be a valid URL"),
  CLERK_SECRET_KEY: z.string().trim().min(1, "CLERK Secret key required"),
  CLERK_TELEMETRY_DISABLED: z.enum(["0", "1"]).default("1"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_STAGE: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "error", "warn"]).default("debug"),
  LOG_TO_FILE: z
    .preprocess((v) => {
      if (typeof v === "string") {
        const val = v.trim().toLowerCase();
        if (val === "true") return true;
        if (val === "false") return false;
      }
      return v;
    }, z.boolean())
    .default(false),
  PORT: z.coerce.number().positive().default(3000),
});

export const serverEnv = createEnv(serverSchema, process.env);
export type ServerEnv = z.infer<typeof serverSchema>;

export const { DB_READ_URL, DB_WRITE_URL, CLERK_SECRET_KEY, PORT } = serverEnv;
