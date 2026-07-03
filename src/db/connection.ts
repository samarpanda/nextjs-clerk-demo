import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

import { DB_READ_URL, DB_WRITE_URL } from "@/env/server";
import { logger } from "@/logger";
import * as schema from "./schema";

const { Pool } = pkg;
const PG_APP_NAME = "NEXTJS_CLERK_DEMO";
const PG_TIMEOUT_MS = 5000;
const DB_WRITE_MAX_POOL_LIMIT = 5;
const DB_READ_MAX_POOL_LIMIT = 10;

type DbGlobal = {
  poolWrite?: pkg.Pool;
  poolRead?: pkg.Pool;
  dbWrite?: ReturnType<typeof drizzle<typeof schema>>;
  dbRead?: ReturnType<typeof drizzle<typeof schema>>;
};

const globalForDb = globalThis as unknown as DbGlobal;

function createWritePool() {
  const poolWrite = new Pool({
    connectionString: DB_WRITE_URL,
    application_name: `${PG_APP_NAME}:write`,
    statement_timeout: PG_TIMEOUT_MS,
    max: DB_WRITE_MAX_POOL_LIMIT,
  });
  poolWrite.on("connect", (client) => {
    void (async () => {
      try {
        await client.query("SET idle_in_transaction_session_timeout = 300000");
      } catch (e) {
        logger.warn("Failed to set transaction_session_timeout", { error: e });
      }
    })();
  });

  return poolWrite;
}

function createReadPool() {
  const poolRead = new Pool({
    connectionString: DB_READ_URL,
    application_name: `${PG_APP_NAME}:read`,
    statement_timeout: PG_TIMEOUT_MS,
    max: DB_READ_MAX_POOL_LIMIT,
  });
  poolRead.on("connect", (client) => {
    void (async () => {
      try {
        await client.query("SET default_transaction_read_only = on");
        await client.query("SET idle_in_transaction_session_timeout = 120000");
      } catch (e) {
        logger.warn("Failed to configure read session", { error: e });
      }
    })();
  });

  return poolRead;
}

const poolWrite = globalForDb.poolWrite ?? createWritePool();
const poolRead = globalForDb.poolRead ?? createReadPool();

globalForDb.poolWrite = poolWrite;
globalForDb.poolRead = poolRead;

export const dbWrite =
  globalForDb.dbWrite ?? drizzle(poolWrite, { schema, casing: "snake_case" });
export const dbRead =
  globalForDb.dbRead ?? drizzle(poolRead, { schema, casing: "snake_case" });

globalForDb.dbWrite = dbWrite;
globalForDb.dbRead = dbRead;

export const db = dbWrite;

export const warmupConnections = async (): Promise<void> => {
  try {
    await Promise.all([
      (async () => {
        const client = await poolWrite.connect();
        try {
          await client.query("SELECT 1");
        } finally {
          client.release();
        }
      })(),
      (async () => {
        const client = await poolRead.connect();
        try {
          await client.query("SELECT 1");
        } finally {
          client.release();
        }
      })(),
    ]);
    logger.info("Database connections warmed up successfully");
  } catch (error) {
    logger.error("Connection warmup failed", { error });
  }
};

export const getPoolStats = () => {
  return {
    write: {
      totalCount: poolWrite.totalCount,
      idleCount: poolWrite.idleCount,
      waitingCount: poolWrite.waitingCount,
    },
    read: {
      totalCount: poolRead.totalCount,
      idleCount: poolRead.idleCount,
      waitingCount: poolRead.waitingCount,
    },
  };
};

export const closePools = async (): Promise<void> => {
  try {
    await Promise.all([poolWrite.end(), poolRead.end()]);
    globalForDb.poolWrite = undefined;
    globalForDb.poolRead = undefined;
    globalForDb.dbWrite = undefined;
    globalForDb.dbRead = undefined;

    logger.info("Database pools closed gracefully");
  } catch (error) {
    logger.error("Error closing database pools", { error });
  }
};
