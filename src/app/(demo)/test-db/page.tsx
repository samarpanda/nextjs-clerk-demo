import { type NewUser, users } from "@/db/schema";
import { dbWrite } from "@/lib/db";
import { logger } from "@/logger";

async function insertNewUser(uniqueId: string) {
  const insertUser: NewUser = {
    clerkId: `usr_test_${uniqueId}`,
    name: `Test User ${uniqueId}`,
    email: `test.usr.${uniqueId}@example.com`,
    isActive: false,
  };
  const [newUser] = await dbWrite.insert(users).values(insertUser).returning();
  return newUser;
}

export default async function TestDb() {
  const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  try {
    const newUser = await insertNewUser(uniqueId);
    logger.info("Successfully created the new user", newUser);
  } catch (e) {
    logger.error("Failed creating new user", e);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center text-white">
      <div>
        <h1 className="text-6xl">Test Neon DB</h1>
        <p className="text-2xl text-white/60 mb-4">New user code: {uniqueId}</p>
      </div>
    </div>
  );
}
