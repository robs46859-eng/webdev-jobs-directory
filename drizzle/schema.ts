import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing Manus OAuth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * CRM leads table for Captivate med spa outreach.
 * Each row = one lead with 3-step email sequence.
 */
export const crmLeads = mysqlTable("crm_leads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  companyName: varchar("companyName", { length: 256 }),
  jobTitle: varchar("jobTitle", { length: 256 }),
  website: varchar("website", { length: 512 }),
  location: varchar("location", { length: 256 }),
  linkedin: varchar("linkedin", { length: 512 }),
  subject1: varchar("subject1", { length: 512 }),
  body1: text("body1"),
  subject2: varchar("subject2", { length: 512 }),
  body2: text("body2"),
  subject3: varchar("subject3", { length: 512 }),
  body3: text("body3"),
  status: mysqlEnum("status", ["new", "step1_sent", "step2_sent", "step3_sent", "replied", "booked", "unsubscribed"]).default("new").notNull(),
  lastContactedAt: timestamp("lastContactedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrmLead = typeof crmLeads.$inferSelect;
export type InsertCrmLead = typeof crmLeads.$inferInsert;

/**
 * YouTube integration credentials
 */
export const youtubeCredentials = mysqlTable("youtube_credentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId")
    .notNull()
    .references(() => users.id),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  expiryDate: timestamp("expiryDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type YoutubeCredential = typeof youtubeCredentials.$inferSelect;
export type InsertYoutubeCredential = typeof youtubeCredentials.$inferInsert;
