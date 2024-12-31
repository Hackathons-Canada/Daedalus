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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required",
      });
    }

    if (currentUser.id !== userId) {
      return NextResponse.json({
        success: false,
        message: "You can only save your own application",
      });
    }

    if (currentUser.role !== "unassigned") {
      return NextResponse.json({
        success: false,
        message:
          "You must not have submitted or been accepted to save an application",
      });
    }

    const validationResult = HackerApplicationDraftSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid application data",
        // error: validationResult.error.errors,
      });
    }

    // TODO: data validation
    // TODO: authentication with user ID
    // CHECK IF ALREADY SUBMITTED

    // TODO update queries
    const updatedApplication = await createOrUpdateApplication(body);
    if (!updatedApplication.success) {
      console.log("Failed to save application: ", updatedApplication.errors);
      return NextResponse.json({
        success: false,
        message: "Failed to save application. Please try again.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application saved successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to save application. Please try again.",
    });
  }
}