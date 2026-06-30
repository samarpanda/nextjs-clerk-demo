import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .$defaultFn(() => uuidv4())
      .primaryKey()
      .notNull(),
    clerkId: text("clerk_id").notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updateAt: timestamp("updated_at", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    unique("users_email_key").on(table.email),
    index("users_clerk_id_idx").on(table.clerkId),
    index("users_is_active_idx").on(table.isActive),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
