import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth";

import { ApiResponse } from "@/types/api";
import { createOrUpdateApplication } from "@/lib/db/queries/application";
import { HackerApplicationDraftSchema } from "@/lib/validations/application";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.id) {
      return NextResponse.json({
        success: false,
        message: "You must be logged in to save an application",
      });
    }

    const body = await req.json();

    if (currentUser.role !== "unassigned") {
      return NextResponse.json({
        success: false,
        message:
          "You must not have submitted or been accepted to save an application",
      });
    }

    const validationResult = HackerApplicationDraftSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Invalid application data", validationResult.error);

      const errorMessages = Object.values(
        validationResult.error.flatten().fieldErrors,
      )
        .flat()
        .join(", ");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid application data",
          error: errorMessages,
        },
        { status: 400 },
      );
    }

    // Convert string fields to numbers
    const age = validationResult.data.age
      ? parseInt(validationResult.data.age)
      : null;
    const graduationYear = validationResult.data.graduationYear
      ? parseInt(validationResult.data.graduationYear)
      : null;

    const applicationData = {
      ...validationResult.data,
      age,
      graduationYear,
      pronouns:
        validationResult.data.pronouns.customValue ||
        validationResult.data.pronouns.value,
      school:
        validationResult.data.school.customValue ||
        validationResult.data.school.value,
      major:
        validationResult.data.major.customValue ||
        validationResult.data.major.value,
      userId: currentUser.id,
      submissionStatus: "draft",
    };

    // Check that the deadline has not passed
    const url = new URL(req.url);
    const response = await fetch(`${url.origin}/api/application/deadline`, {
      next: { revalidate: 5 * 60 }, // Cache for 5m
    });
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch application deadline",
      });
    }

    const {
      data: { deadline },
    } = await response.json();

    if (!deadline) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch application deadline",
      });
    }

    if (new Date() > new Date(deadline)) {
      return NextResponse.json({
        success: false,
        message: "The deadline to save your application has passed",
      });
    }

    const updatedApplication = await createOrUpdateApplication(applicationData);
    if (!updatedApplication.success) {
      return NextResponse.json({
        success: false,
        message: "Failed to save application. Please try again.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application saved successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to save application. Please try again.",
    });
  }
}
