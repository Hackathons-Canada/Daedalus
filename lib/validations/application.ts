import { z } from "zod";

// TODO: Should I trim?
export const HackerApplicationDraftSchema = z
  .object({
    userId: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    age: z.number().int().positive().optional(),
    pronouns: z.string().trim().optional(),
    email: z
      .string()
      .email({ message: "Invalid email provided." })
      .trim()
      .optional(),
    github: z
      .string()
      .url({ message: "Invalid URL provided." })
      .trim()
      .optional(),
    linkedin: z
      .string()
      .url({ message: "Invalid URL provided." })
      .trim()
      .optional(),
    personalWebsite: z
      .string()
      .url({ message: "Invalid URL provided." })
      .trim()
      .optional(),
    resumeUrl: z
      .string()
      .url({ message: "Invalid URL provided." })
      .trim()
      .optional(),
    school: z.string().trim().optional(),
    major: z.string().trim().optional(),
    graduationYear: z.number().int().positive().optional(),
    gender: z.string().trim().optional(),
    race: z.string().trim().optional(),
    country: z.string().trim().optional(),
    shortAnswer1: z.string().trim().optional(),
    shortAnswer2: z.string().trim().optional(),
    technicalInterest1: z.string().trim().optional(),
    technicalInterest2: z.string().trim().optional(),
    technicalInterest3: z.string().trim().optional(),
    mlhCheckbox1: z.boolean().optional(),
    mlhCheckbox2: z.boolean().optional(),
    mlhCheckbox3: z.boolean().optional(),
  })
  .strict();

// TODO could use zod-drizzle
// TODO: what should be optional and what shouldn't
// TODO custom error messages?
export const HackerApplicationSubmissionSchema = z
  .object({
    userId: z.string().trim(),
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    age: z.number().int().positive(),
    pronouns: z.string().trim(),
    email: z.string().email().trim(),
    github: z.string().url().trim().optional(),
    linkedin: z.string().url().trim().optional(),
    personalWebsite: z.string().url().trim().optional(),
    resumeUrl: z.string().url().trim().optional(),
    school: z.string().trim(),
    major: z.string().trim(),
    graduationYear: z.number().int().positive(),
    gender: z.string().trim(),
    race: z.string().trim(),
    country: z.string().trim(),
    shortAnswer1: z.string().trim(),
    shortAnswer2: z.string().trim(),
    technicalInterest1: z.string().trim(),
    technicalInterest2: z.string().trim(),
    technicalInterest3: z.string().trim(),
    mlhCheckbox1: z.boolean(),
    mlhCheckbox2: z.boolean(),
    mlhCheckbox3: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    submissionStatus: z.enum(["draft", "submitted"]).default("draft"),
    id: z.string().trim(),
  })
  .strict();
