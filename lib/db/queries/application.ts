// Reserved file for application queries that will often be used

import { eq } from "drizzle-orm";

import { HackerApplicationSubmissionSchema } from "@/lib/validations/application";

import { db } from "..";
import {
  HackerApplicationInsertData,
  hackerApplications,
  HackerApplicationSelectData,
} from "../schema";
import { updateUserHackerApplicationStatus } from "./user";

export const getHackerApplicationByUserId = async (userId: string) => {
  try {
    const [application] = await db
      .select()
      .from(hackerApplications)
      .where(eq(hackerApplications.userId, userId));
    return application;
  } catch (error) {
    console.error(
      "Error fetching application in getApplicationByID function: ",
      error,
    );
    return null;
  }
};

// TODO ENSURE USER USES THEIR OWN ID LOGGED IN WITH

// TODO should we include the detailed errors in response
export const createOrUpdateApplication = async (
  data: HackerApplicationInsertData,
) => {
  // TODO: Proper error handling
  try {
    // TODO better way of handling?
    if (data.createdAt) {
      data.createdAt = new Date(data.createdAt);
    }
    if (data.updatedAt) {
      data.updatedAt = new Date(data.updatedAt);
    }

    const [application] = await db
      .insert(hackerApplications)
      .values(data)
      .onConflictDoUpdate({
        target: [hackerApplications.userId],
        set: data,
      })
      .returning();
    return { success: true, data: application };
  } catch (error) {
    return { success: false, errors: [error] };
  }
};

export const submitApplication = async (
  application: HackerApplicationSelectData,
) => {
  try {
    const result = HackerApplicationSubmissionSchema.safeParse(application);
    if (!result.success) {
      return { success: false, errors: result.error.errors };
    }

    const { userId } = application;

    const updatedUser = await updateUserHackerApplicationStatus(
      userId,
      "pending",
    );

    const updatedApplication = await db
      .update(hackerApplications)
      .set({
        submissionStatus: "submitted",
      })
      .where(eq(hackerApplications.userId, userId))
      .returning();

    return { success: true, data: updatedApplication };
  } catch (error) {
    return { success: false, errors: [error] };
  }
};
