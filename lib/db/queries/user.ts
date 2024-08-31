// Reserved file for user queries that will often be used

import { eq } from "drizzle-orm";

import { db } from "..";
import { users } from "../schema";

export const getUserById = async (userId: number) => {
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
    const user = await db.select().from(users).where(eq(users.email, email));
    return user;
  } catch (error) {
    console.error("Error fetching user in getUserByEmail function: ", error);
    return null;
  }
};
