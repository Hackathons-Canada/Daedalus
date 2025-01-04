import { z } from "zod";

export const HackerApplicationDraftSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    age: z
      .string()
      .refine(
        (value) => {
          if (!value) return true;
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
      .refine(
        (val) => {
          if (val === "") return true;
          if (typeof val !== "string") return false;
          try {
            const url = new URL(val);
            return (
              url.hostname === "github.com" &&
              url.pathname.split("/").filter(Boolean).length >= 1
            );
          } catch {
            return false;
          }
        },
        {
          message:
            "Please provide a valid GitHub profile URL (e.g., https://github.com/username)",
        },
      ),
    linkedin: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => {
          if (val === "") return true;
          if (typeof val !== "string") return false;
          try {
            const url = new URL(val);
            return (
              url.hostname === "www.linkedin.com" &&
              /^\/in\/[a-zA-Z0-9-]+(\/)?$/.test(url.pathname)
            );
          } catch {
            return false;
          }
        },
        {
          message:
            "Please provide a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)",
        },
      ),
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
      .refine(
        (value) => {
          if (!value) return true;
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
          return age >= 1 && age <= 123;
        },
        {
          message: "Invalid age provided.",
        },
      ),
    pronouns: z
      .object({
        value: z.string().trim().min(1, { message: "Pronouns are required" }),
        customValue: z
          .string()
          .trim()
          .max(50, {
            message: "Pronouns must be 50 characters or less.",
          })
          .optional(),
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
      .refine(
        (val) => {
          if (val === "") return true;
          if (typeof val !== "string") return false;
          try {
            const url = new URL(val);
            return (
              url.hostname === "github.com" &&
              url.pathname.split("/").filter(Boolean).length >= 1
            );
          } catch {
            return false;
          }
        },
        {
          message:
            "Please provide a valid GitHub profile URL (e.g., https://github.com/username)",
        },
      ),
    linkedin: z
      .string()
      .trim()
      .refine(
        (val) => {
          if (val === "") return true;
          if (typeof val !== "string") return false;
          try {
            const url = new URL(val);
            return (
              url.hostname === "www.linkedin.com" &&
              /^\/in\/[a-zA-Z0-9-]+(\/)?$/.test(url.pathname)
            );
          } catch {
            return false;
          }
        },
        {
          message:
            "Please provide a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)",
        },
      ),
    personalWebsite: z
      .string()
      .trim()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Invalid URL provided.",
      }),
    resumeUrl: z.string().trim().min(1, { message: "Please upload a resume" }),
    shareResume: z.boolean(),
    school: z
      .object({
        value: z.string().trim().min(1, { message: "School is required" }),
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
        value: z.string().trim().min(1, { message: "Major/Field is required" }),
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
    levelOfStudy: z
      .string()
      .trim()
      .min(1, { message: "Level of study is required" }),
    graduationYear: z
      .string()
      .min(1, { message: "Invalid year provided." })
      .refine(
        (value) => {
          const year = parseInt(value);
          return year >= 1900 && year <= 2077;
        },
        {
          message: "Invalid year provided.",
        },
      ),
    gender: z.string().trim().min(1, { message: "Gender is required" }),
    race: z.string().trim().min(1, { message: "Race is required" }),
    country: z.string().trim().min(1, { message: "Country is required" }),
    shortAnswer1: z.string().trim().min(32, {
      message: "Your answer must be at least 32 characters in length.",
    }),
    shortAnswer2: z.string().trim().min(32, {
      message: "Your answer must be at least 32 characters in length.",
    }),
    technicalInterests: z.string().trim(),
    hackathonsAttended: z
      .string()
      .min(1, { message: "Invalid value provided." })
      .max(3, { message: "Invalid value provided." })
      .refine(
        (value) => {
          const attended = parseInt(value);
          return attended >= 0 && attended <= 2077;
        },
        {
          message: "Invalid value provided.",
        },
      ),
    mlhCheckbox1: z
      .boolean({ required_error: "You must agree to the MLH Code of Conduct." })
      .refine((val) => val === true, {
        message: "You must agree to the MLH Code of Conduct.",
      }),
    mlhCheckbox2: z
      .boolean({ required_error: "You must agree to the MLH Privacy Policy." })
      .refine((val) => val === true, {
        message: "You must agree to the MLH Privacy Policy and Contest Terms.",
      }),
    mlhCheckbox3: z.boolean(),
  })
  .strict();

export type THackerApplicationDraft = z.infer<
  typeof HackerApplicationDraftSchema
>;
export type THackerApplicationSubmission = z.infer<
  typeof HackerApplicationSubmissionSchema
>;
