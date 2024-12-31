import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth";

import { ApiResponse } from "@/types/api";
import {
  getHackerApplicationByUserId,
  submitApplication,
} from "@/lib/db/queries/application";

// TODO figure out how / when submit will be called
// e.g. ensure /save is called before /submit

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.id) {
      return NextResponse.json({
        success: false,
        message: "You must be logged in to submit an application",
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
        message: "You can only submit your own application",
      });
    }

    // TODO ??
    if (currentUser.role !== "unassigned") {
      return NextResponse.json({
        success: false,
        message:
          "You must not have received a decision to submit an application",
      });
    }

    const application = await getHackerApplicationByUserId(userId);
    if (!application || application.submissionStatus !== "draft") {
      return NextResponse.json({
        success: false,
        message: "Application must be saved and not yet submitted to submit",
      });
    }

    const updatedApplication = await submitApplication(userId);

    if (!updatedApplication.success) {
      console.log("Failed to submit application: ", updatedApplication.errors);
      return NextResponse.json({
        success: false,
        message: "Failed to submit application. Please try again.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      data: updatedApplication,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to submit application. Please try again.",
    });
  }
}
