import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./.drizzle",
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DB_WRITE_URL!,
  },
});
