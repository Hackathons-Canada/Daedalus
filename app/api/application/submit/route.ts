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

    // TODO correct role checking?
    if (currentUser.role !== "unassigned") {
      return NextResponse.json({
        success: false,
        message:
          "You must not have received a decision to submit an application",
      });
    }

    const application = await getHackerApplicationByUserId(userId);
    if (!application) {
      return NextResponse.json({
        success: false,
        message: "Application must have been started and saved to submit",
      });
    }

    if (application.submissionStatus !== "draft") {
      return NextResponse.json({
        success: false,
        message: "Application has already been submitted",
      });
    }

    const updatedApplication = await submitApplication(application);

    if (!updatedApplication.success) {
      console.error(
        "Error submitting application: ",
        updatedApplication.errors,
      );
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
