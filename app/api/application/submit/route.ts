import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/auth";

import { ApiResponse } from "@/types/api";
import {
  createOrUpdateApplication,
  submitApplication,
} from "@/lib/db/queries/application";
import { sendApplicationSubmittedEmail } from "@/lib/emails/ses";
import { HackerApplicationSubmissionSchema } from "@/lib/validations/application";

// TODO figure out how / when submit will be called

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

    if (currentUser.role !== "unassigned") {
      return NextResponse.json({
        success: false,
        message:
          "You must not have received a decision to submit an application",
      });
    }

    const validatedFields = HackerApplicationSubmissionSchema.safeParse(body);

    if (!validatedFields.success) {
      const errorMessages = Object.values(
        validatedFields.error.flatten().fieldErrors,
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

    const { data } = validatedFields;

    // Convert string fields to numbers
    const age = parseInt(data.age);
    const graduationYear = parseInt(data.graduationYear);

    // Convert object fields to strings
    const pronouns = data.pronouns.customValue || data.pronouns.value;
    const school = data.school.customValue || data.school.value;
    const major = data.major.customValue || data.major.value;

    // Create new application data from validated input
    const applicationData = {
      userId: currentUser.id,
      firstName: data.firstName,
      lastName: data.lastName,
      age,
      pronouns,
      email: data.email.toLowerCase(),
      github: data.github,
      linkedin: data.linkedin,
      personalWebsite: data.personalWebsite,
      resumeUrl: data.resumeUrl,
      shareResume: data.shareResume,
      school,
      major,
      levelOfStudy: data.levelOfStudy,
      graduationYear,
      gender: data.gender,
      race: data.race,
      country: data.country,
      shortAnswer1: data.shortAnswer1,
      shortAnswer2: data.shortAnswer2,
      technicalInterests: data.technicalInterests,
      hackathonsAttended: data.hackathonsAttended,
      mlhCheckbox1: data.mlhCheckbox1,
      mlhCheckbox2: data.mlhCheckbox2,
      mlhCheckbox3: data.mlhCheckbox3,
      submissionStatus: "submitted",
      submittedAt: new Date(),
      createdAt: new Date(),
    };

    // Check that the deadline has not passed
    const url = new URL(req.url);
    const response = await fetch(`${url.origin}/api/application/deadline`, {
      next: { revalidate: 0 },
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

    // First create/update the application
    const createResult = await createOrUpdateApplication(applicationData);
    if (!createResult.success) {
      return NextResponse.json({
        success: false,
        message: "Failed to create application. Please try again.",
      });
    }

    // Then submit the application
    if (!createResult.data) {
      return NextResponse.json({
        success: false,
        message: "Failed to create application data. Please try again.",
      });
    }

    const updatedApplication = await submitApplication(createResult.data);

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

    // Send confirmation email
    await sendApplicationSubmittedEmail({
      name: data.firstName,
      email: currentUser.email || data.email,
      subject: "Thanks for applying to Hack Canada!",
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to submit application. Please try again.",
    });
  }
}
