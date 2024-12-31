import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth";

import { ApiResponse } from "@/types/api";
import { submitApplication } from "@/lib/db/queries/application";

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

    if (currentUser.role !== "unassigned") {
      return NextResponse.json({
        success: false,
        message:
          "You must not have submitted or been accepted to submit an application",
      });
    }

    // const validationResult = HackerApplicationDraftSchema.safeParse(body);
    // if (!validationResult.success) {
    //     return NextResponse.json({
    //         success: false,
    //         message: "Invalid application data",
    //         // error: validationResult.error.errors,
    //     });
    // }

    // TODO: data validation
    // TODO: authentication with user ID
    // CHECK IF ALREADY SUBMITTED

    // TODO update queries
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
