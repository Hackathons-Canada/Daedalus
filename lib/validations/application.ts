import { z } from "zod";

export const HackerApplicationDraftSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    age: z
      .string()
      .min(1, { message: "Invalid age provided." })
      .max(3, { message: "Invalid age provided." })
      .refine(
        (value) => {
          const age = parseInt(value);
          return age >= 1 && age <= 111;
        },
        {
          message: "Invalid age provided.",
        },
      )
      .optional(),
    pronouns: z
      .object({
        value: z.string().trim().optional(),
        customValue: z.string().trim().optional(),
      })
      .refine(
        (data) => {
          if (data.value === "Other (please specify)") {
            return data.customValue && data.customValue.trim().length > 0;
          }
          return true;
        },
        {
          message: "Please specify your pronouns.",
          path: ["customValue"],
        },
      ),
    email: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => value === "" || z.string().email().safeParse(value).success,
        {
          message: "Invalid email address.",
        },
      ),
    github: z
      .string()
      .trim()
      .optional()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid URL provided.",
      }),
    linkedin: z
      .string()
      .trim()
      .optional()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid URL provided.",
      }),
    personalWebsite: z
      .string()
      .trim()
      .optional()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid URL provided.",
      }),
    resumeUrl: z.string().trim().optional(),
    shareResume: z.boolean().optional(),
    school: z
      .object({
        value: z.string().trim().optional(),
        customValue: z.string().trim().optional(),
      })
      .refine(
        (data) => {
          if (data.value === "Other (please specify)") {
            return data.customValue && data.customValue.trim().length > 0;
          }
          return true;
        },
        {
          message: "Please specify your school/university.",
          path: ["customValue"],
        },
      ),
    major: z
      .object({
        value: z.string().trim().optional(),
        customValue: z.string().trim().optional(),
      })
      .refine(
        (data) => {
          if (data.value === "Other (please specify)") {
            return data.customValue && data.customValue.trim().length > 0;
          }
          return true;
        },
        {
          message: "Please specify your major / field of study.",
          path: ["customValue"],
        },
      ),
    levelOfStudy: z.string().trim().optional(),
    graduationYear: z
      .string()
      .min(4, { message: "Invalid year provided." })
      .max(4, { message: "Invalid year provided." })
      .refine(
        (value) => {
          const year = parseInt(value);
          return year >= 2000 && year <= 2077;
        },
        {
          message: "Invalid year provided.",
        },
      )
      .optional(),
    gender: z.string().trim().optional(),
    race: z.string().trim().optional(),
    country: z.string().trim().optional(),
    shortAnswer1: z.string().trim().optional(),
    shortAnswer2: z.string().trim().optional(),
    technicalInterests: z.string().trim().optional(),
    hackathonsAttended: z.string().optional(),
    mlhCheckbox1: z.boolean().optional(),
    mlhCheckbox2: z.boolean().optional(),
    mlhCheckbox3: z.boolean().optional(),
  })
  .strict();

export const HackerApplicationSubmissionSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: "First name is required" }),
    lastName: z.string().trim().min(1, { message: "Last name is required" }),
    age: z
      .string()
      .min(1, { message: "Invalid age provided." })
      .max(3, { message: "Invalid age provided." })
      .refine(
        (value) => {
          const age = parseInt(value);
          return age >= 1 && age <= 111;
        },
        {
          message: "Invalid age provided.",
        },
      ),
    pronouns: z
      .object({
        value: z.string().trim(),
        customValue: z.string().trim().optional(),
      })
      .refine(
        (data) => {
          if (data.value === "Other (please specify)") {
            return data.customValue && data.customValue.trim().length > 0;
          }
          return true;
        },
        {
          message: "Please specify your pronouns.",
          path: ["customValue"],
        },
      ),
    email: z.string().trim().email({ message: "Invalid email address" }),
    github: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid URL provided.",
      }),
    linkedin: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid URL provided.",
      }),
    personalWebsite: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid URL provided.",
      }),
    resumeUrl: z.string().trim(),
    shareResume: z.boolean(),
    school: z
      .object({
        value: z.string().trim(),
        customValue: z.string().trim().optional(),
      })
      .refine(
        (data) => {
          if (data.value === "Other (please specify)") {
            return data.customValue && data.customValue.trim().length > 0;
          }
          return true;
        },
        {
          message: "Please specify your school/university.",
          path: ["customValue"],
        },
      ),
    major: z
      .object({
        value: z.string().trim(),
        customValue: z.string().trim().optional(),
      })
      .refine(
        (data) => {
          if (data.value === "Other (please specify)") {
            return data.customValue && data.customValue.trim().length > 0;
          }
          return true;
        },
        {
          message: "Please specify your major / field of study.",
          path: ["customValue"],
        },
      ),
    levelOfStudy: z.string().trim(),
    graduationYear: z
      .string()
      .min(4, { message: "Invalid year provided." })
      .max(4, { message: "Invalid year provided." })
      .refine(
        (value) => {
          const year = parseInt(value);
          return year >= 2000 && year <= 2077;
        },
        {
          message: "Invalid year provided.",
        },
      ),
    gender: z.string().trim(),
    race: z.string().trim(),
    country: z.string().trim(),
    shortAnswer1: z
      .string()
      .trim()
      .min(1, { message: "This field is required" }),
    shortAnswer2: z
      .string()
      .trim()
      .min(1, { message: "This field is required" }),
    technicalInterests: z.string().trim(),
    hackathonsAttended: z.string(),
    mlhCheckbox1: z.boolean(),
    mlhCheckbox2: z.boolean(),
    mlhCheckbox3: z.boolean(),
  })
  .strict();

export type THackerApplicationDraft = z.infer<
  typeof HackerApplicationDraftSchema
>;
export type THackerApplicationSubmission = z.infer<
  typeof HackerApplicationSubmissionSchema
>;
