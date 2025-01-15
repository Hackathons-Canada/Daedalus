import { NextRequest, NextResponse } from "next/server";

import { ApiResponse } from "@/types/api";

// NOTE: when fetching from the frontend, make sure to set next: {revalidate: 60 * 5}

export const revalidate = 0;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {

  // TODO set correctly
  const hackerApplicationDeadline = new Date("2025-02-30T23:59:00-05:00");

  return NextResponse.json({
    success: true,
    message: "Successfully retrieved the application deadline.",
    data: {
      deadline: hackerApplicationDeadline.toISOString(),
    },
  });
}
