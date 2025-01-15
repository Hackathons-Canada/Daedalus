import { sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  password: text("password"),
  role: text("role").default("unassigned").notNull(),
  applicationStatus: text("applicationStatus").notNull().default("not_applied"),
  rsvpAt: integer("rsvpAt", { mode: "timestamp_ms" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const passwordResetTokens = sqliteTable("passwordResetToken", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text("token"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
});

export const accounts = sqliteTable("account", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const authenticators = sqliteTable("authenticator", {
  credentialID: text("credentialID").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: integer("credentialBackedUp", {
    mode: "boolean",
  }).notNull(),
  transports: text("transports"),
});

export const emailVerificationTokens = sqliteTable("emailVerificationToken", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const hackerApplications = sqliteTable("hackerApplication", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text("firstName"),
  lastName: text("lastName"),
  age: integer("age"),
  pronouns: text("pronouns"),
  email: text("email"),
  github: text("github"),
  linkedin: text("linkedin"),
  personalWebsite: text("personalWebsite"),
  resumeUrl: text("resume"),
  shareResume: integer("shareResume", { mode: "boolean" }),
  school: text("school"),
  major: text("major"),
  levelOfStudy: text("levelOfStudy"),
  graduationYear: integer("graduationYear"),
  gender: text("gender"),
  race: text("race"),
  country: text("country"),
  shortAnswer1: text("shortAnswer1"),
  shortAnswer2: text("shortAnswer2"),
  technicalInterests: text("technicalInterests"),
  hackathonsAttended: text("hackathonsAttended"),
  mlhCheckbox1: integer("mlhCheckbox1", { mode: "boolean" }),
  mlhCheckbox2: integer("mlhCheckbox2", { mode: "boolean" }),
  mlhCheckbox3: integer("mlhCheckbox3", { mode: "boolean" }),
  submissionStatus: text("submissionStatus").notNull().default("draft"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  internalResult: text("internalResult").default("pending"),
  internalNotes: text("internalNotes"),
});

export type HackerApplicationsInsertData =
  typeof hackerApplications.$inferInsert;

export type HackerApplicationsSelectData =
  typeof hackerApplications.$inferSelect;

export const userActionLog = sqliteTable("user_action_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("userId")
    .unique()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  actionType: text("action_type").notNull(), // Type of action (e.g., 'SEARCH', 'CLICK', 'LOGIN')
  actionDetails: blob("action_details", { mode: "json" }), // e.g. { searchQuery: 'foo', search_id: 1234 }
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
