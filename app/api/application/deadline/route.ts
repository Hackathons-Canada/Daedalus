import { NextRequest, NextResponse } from "next/server";

import { ApiResponse } from "@/types/api";
import { hackerApplicationDeadline } from "@/config/applications";

// NOTE: when fetching, make sure to set next: {revalidate: 0}

export const revalidate = 0;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  // TODO: Need to check whether the user is logged in?

  return NextResponse.json({
    success: true,
    message: "Successfully retrieved the application deadline.",
    data: {
      deadline: hackerApplicationDeadline.toISOString(),
    },
  });
}
