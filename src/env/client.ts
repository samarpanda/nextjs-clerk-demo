import { z } from "zod";
import { createEnv } from "./create-env";

const relativePathSchema = (name: string, defaultValue: string) =>
  z
    .string()
    .trim()
    .min(1, `${name} is required`)
    .startsWith("/", `${name} must start with /`)
    .default(defaultValue);

const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),

  NEXT_PUBLIC_CLERK_SIGN_IN_URL: relativePathSchema(
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "/sign-in",
  ),

  NEXT_PUBLIC_CLERK_SIGN_UP_URL: relativePathSchema(
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
    "/sign-up",
  ),

  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: relativePathSchema(
    "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
    "/dashboard",
  ),

  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: relativePathSchema(
    "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL",
    "/new-user",
  ),
});

export const clientEnv = createEnv(clientSchema, process.env);
export type ClientEnv = z.infer<typeof clientSchema>;
