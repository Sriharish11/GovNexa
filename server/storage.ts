import { db } from "./db";
import { exams, notifications, InsertExam, InsertNotification } from "@shared/schema";
import { eq, desc, and, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Exams
  getExams(filters?: { search?: string; category?: string; organization?: string; status?: string }): Promise<typeof exams.$inferSelect[]>;
  getExam(id: number): Promise<typeof exams.$inferSelect | undefined>;
  createExam(exam: InsertExam): Promise<typeof exams.$inferSelect>;
  updateExam(id: number, updates: Partial<InsertExam>): Promise<typeof exams.$inferSelect | undefined>;
  
  // Notifications
  getNotifications(): Promise<typeof notifications.$inferSelect[]>;
  createNotification(notification: InsertNotification): Promise<typeof notifications.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  async getExams(filters?: { search?: string; category?: string; organization?: string; status?: string }) {
    let query = db.select().from(exams).$dynamic();
    
    const conditions = [];
    
    if (filters?.search) {
      conditions.push(
        or(
          ilike(exams.title, `%${filters.search}%`),
          ilike(exams.organization, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.category) {
      conditions.push(eq(exams.category, filters.category));
    }
    
    if (filters?.organization) {
      conditions.push(eq(exams.organization, filters.organization));
    }
    
    if (filters?.status) {
      conditions.push(eq(exams.status, filters.status));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(exams.lastUpdated));
  }

  async getExam(id: number) {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam;
  }

  async createExam(exam: InsertExam) {
    const [newExam] = await db.insert(exams).values(exam).returning();
    return newExam;
  }

  async updateExam(id: number, updates: Partial<InsertExam>) {
    const [updated] = await db.update(exams).set({ ...updates, lastUpdated: new Date() }).where(eq(exams.id, id)).returning();
    return updated;
  }
  
  async getNotifications() {
    return db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(50);
  }

  async createNotification(notification: InsertNotification) {
    const [newNotif] = await db.insert(notifications).values(notification).returning();
    return newNotif;
  }
}

export const storage = new DatabaseStorage();
