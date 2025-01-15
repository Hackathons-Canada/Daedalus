/**
 * Log a user action event on the client side.
 * @param userId - The ID of the user performing the action (use 0 or null for anonymous users).
 * @param actionType - The type of action (e.g., 'SEARCH', 'CLICK', 'LOGIN').
 * @param actionDetails - Additional details about the action (e.g., search query, clicked item).
 */
export const logEventClient = async ({
  userId,
  actionType,
  actionDetails,
}: {
  userId: number | null;
  actionType: string;
  actionDetails: Record<string, any>;
}) => {
  try {
    // Send the log to the server via a Route Handler
    await fetch("/api/log-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        actionType,
        actionDetails,
      }),
    });

    console.log("Event logged successfully!");
  } catch (error) {
    console.error("Failed to log event:", error);
  }
};
