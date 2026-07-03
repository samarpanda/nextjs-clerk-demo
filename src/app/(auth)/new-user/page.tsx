import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { type NewUser, users } from "@/db/schema";
import { NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL } from "@/env/client";
import { dbWrite } from "@/lib/db";
import { logger } from "@/logger";

async function createNewUser() {
  const user = await currentUser();
  logger.info("Clerk user", user);

  const [match] = await dbWrite
    .select()
    .from(users)
    .where(eq(users.clerkId, user?.id as string));

  if (!match) {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      logger.error("Clerk user doesn't have a primary email id");
      throw new Error("Clerk user doesn't have a primary email id");
    }
    const insertUser: NewUser = {
      clerkId: user?.id,
      name: user?.fullName ?? user?.username ?? email,
      email,
    };

    const [newUser] = await dbWrite
      .insert(users)
      .values(insertUser)
      .returning();

    logger.info("Successfully created the new user", newUser);
  }
  logger.info("Navigating to /dashboard", user);
  redirect(NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL);
}

const NewUser = async () => {
  await createNewUser();
  return <div>...loading</div>;
};

export default NewUser;
