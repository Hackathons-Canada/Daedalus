import { NextApiRequest, NextApiResponse } from "next";

import { db } from "@/lib/db";
import { userActionLog } from "@/lib/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId, actionType, actionDetails, ipAddress, userAgent } =
      req.body;

    try {
      // Insert the event into the user_action_log table
      await db.insert(userActionLog).values({
        userId: userId, // Use 0 for anonymous users
        actionType,
        actionDetails,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      });

      res.status(200).json({ message: "Event logged successfully!" });
    } catch (error) {
      console.error("Failed to log event:", error);
      res.status(500).json({ message: "Failed to log event" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
