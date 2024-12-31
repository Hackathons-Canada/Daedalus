type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  status: ApplicationStatus;
};

type ApplicationStatus =
  | "not_applied"
  | "pending"
  | "accepted"
  | "rejected"
  | "waitlisted"
  | "cancelled";

type UserRole =
  | "admin"
  | "hacker"
  | "organizer"
  | "unassigned"
  | "mentor"
  | "volunteer"
  | "judge";

type SubmissionStatus = "draft" | "submitted";

type HackerApplication = {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email: string;
  github?: string;
  linkedin?: string;
  personalWebsite?: string;
  resumeUrl?: string;
  school?: string;
  major?: string;
  graduationYear?: number;
  gender?: string;
  race?: string;
  submissionStatus: SubmissionStatus;
  createdAt?: number;
  updatedAt?: number;
};
