// Reserved file for application queries that will often be used

import { eq, sql } from "drizzle-orm";

import { HackerApplicationSubmissionSchema } from "@/lib/validations/application";

import { db } from "..";
import {
  hackerApplications,
  HackerApplicationsInsertData,
  HackerApplicationsSelectData,
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

export const createOrUpdateApplication = async (
  data: HackerApplicationsInsertData,
) => {
  try {
    const [application] = await db
      .insert(hackerApplications)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [hackerApplications.userId],
        set: {
          ...data,
          createdAt: sql.raw(`excluded.${hackerApplications.createdAt.name}`),
          updatedAt: new Date(),
        },
      })
      .returning();
    return { success: true, data: application };
  } catch (error) {
    return { success: false, errors: [error] };
  }
};

export const submitApplication = async (
  application: HackerApplicationsSelectData,
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
