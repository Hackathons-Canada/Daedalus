import { headers } from "next/headers";

import { db } from "@/lib/db";
import { userActionLog } from "@/lib/db/schema";

/**
 * Log a user action event on the server side.
 * @param userId - The ID of the user performing the action (use 0 or null for anonymous users).
 * @param actionType - The type of action (e.g., 'SEARCH', 'CLICK', 'LOGIN').
 * @param actionDetails - Additional details about the action (e.g., search query, clicked item).
 */
export const logEventServer = async ({
  userId,
  actionType,
  actionDetails,
}: {
  userId: string | null;
  actionType: string;
  actionDetails: Record<string, any>;
}) => {
  try {
    // Extract headers
    const headersList = headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    if (!userId) {
      userId = "0";
    }

    // Insert the event into the user_action_log table
    await db.insert(userActionLog).values({
      userId: userId,
      actionType,
      actionDetails,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });

    console.log("Event logged successfully!");
  } catch (error) {
    console.error("Failed to log event:", error);
  }
};
