// Reserved file for user-related queries that will often be used

import { eq } from "drizzle-orm";

import { db } from "..";
import { users } from "../schema";

export const getUserById = async (userId: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  } catch (error) {
    console.error("Error fetching user in getUserByID function: ", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user[0];
  } catch (error) {
    console.error("Error fetching user in getUserByEmail function: ", error);
    return null;
  }
};

export const updateUserHackerApplicationStatus = async (
  userId: string,
  status: ApplicationStatus,
) => {
  try {
    const [user] = await db
      .update(users)
      .set({ applicationStatus: status })
      .where(eq(users.id, userId))
      .returning();
    return user;
  } catch (error) {
    console.error("Error updating user hacker application status: ", error);
    return null;
  }
};
