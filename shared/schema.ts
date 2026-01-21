import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export Auth Models
export * from "./models/auth";
export * from "./models/chat";

// === EXAM DATA ===
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "UPSC Civil Services 2026"
  organization: text("organization").notNull(), // e.g., "UPSC", "SSC", "IB"
  category: text("category").notNull(), // e.g., "Central", "Banking", "Police"
  
  description: text("description"),
  
  status: text("status").notNull().default("Upcoming"), // Upcoming, Ongoing, Closed
  
  applicationStartDate: timestamp("application_start_date"),
  applicationEndDate: timestamp("application_end_date"),
  examDate: timestamp("exam_date"),
  
  notificationUrl: text("notification_url"), // Link to official PDF
  applyUrl: text("apply_url"), // Link to apply online
  
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// === USER SUBSCRIPTIONS ===
// Users can subscribe to specific categories or organizations to get alerts
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Matches auth.users.id (string)
  type: text("type").notNull(), // "Category" or "Organization"
  value: text("value").notNull(), // e.g., "Banking" or "UPSC"
  createdAt: timestamp("created_at").defaultNow(),
});

// === NOTIFICATIONS ===
// System-generated alerts for users
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").references(() => exams.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // "New", "Reminder", "Update"
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertExamSchema = createInsertSchema(exams).omit({ id: true, lastUpdated: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// === TYPES ===
export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
