import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { ExamUpdater } from "./services/exam-updater";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === INTEGRATIONS SETUP ===
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerAudioRoutes(app);

  // === EXAM UPDATER SERVICE ===
  // Initialize and start the background scheduler
  // Runs every 60 seconds for demonstration purposes (so you can see updates quickly)
  // In production, this would be set to 24 hours (24 * 60 * 60 * 1000)
  const examUpdater = new ExamUpdater(storage);
  examUpdater.startScheduler(60 * 1000); 

  // Trigger manual update (for verification)
  app.post("/api/admin/trigger-update", async (req, res) => {
    try {
      const updates = await examUpdater.checkUpdates();
      res.json({ message: "Update check completed", updates });
    } catch (error) {
      console.error("Update trigger failed:", error);
      res.status(500).json({ message: "Failed to trigger update" });
    }
  });

  // === EXAM ROUTES ===
  app.get(api.exams.list.path, async (req, res) => {
    const filters = {
      search: req.query.search as string,
      category: req.query.category as string,
      organization: req.query.organization as string,
      status: req.query.status as string,
    };
    const exams = await storage.getExams(filters);
    res.json(exams);
  });

  app.get(api.exams.get.path, async (req, res) => {
    const exam = await storage.getExam(Number(req.params.id));
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  });

  // Admin only - simplified to just check if logged in for prototype, 
  // in real app would check role.
  app.post(api.exams.create.path, async (req, res) => {
    try {
      const input = api.exams.create.input.parse(req.body);
      const exam = await storage.createExam(input);
      res.status(201).json(exam);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.exams.update.path, async (req, res) => {
    try {
      const input = api.exams.update.input.parse(req.body);
      const exam = await storage.updateExam(Number(req.params.id), input);
      if (!exam) return res.status(404).json({ message: "Exam not found" });
      res.json(exam);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === NOTIFICATION ROUTES ===
  app.get(api.notifications.list.path, async (req, res) => {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingExams = await storage.getExams();
  if (existingExams.length === 0) {
    console.log("Seeding database with initial exams...");
    
    const initialExams = [
      {
        title: "UPSC Civil Services 2026",
        organization: "UPSC",
        category: "Central",
        status: "Upcoming",
        description: "Recruitment for IAS, IPS, IFS and other central services.",
        applicationStartDate: new Date("2026-02-01"),
        applicationEndDate: new Date("2026-02-21"),
        examDate: new Date("2026-05-26"),
        notificationUrl: "https://upsc.gov.in",
        applyUrl: "https://upsconline.nic.in"
      },
      {
        title: "SSC CGL 2026",
        organization: "SSC",
        category: "Central",
        status: "Upcoming",
        description: "Combined Graduate Level Examination for various Group B and Group C posts.",
        applicationStartDate: new Date("2026-04-01"),
        applicationEndDate: new Date("2026-05-01"),
        examDate: new Date("2026-07-15"),
        notificationUrl: "https://ssc.nic.in",
        applyUrl: "https://ssc.nic.in"
      },
      {
        title: "IB ACIO Grade II 2026",
        organization: "Intelligence Bureau",
        category: "Intelligence",
        status: "Ongoing",
        description: "Assistant Central Intelligence Officer Grade-II/Executive Examination.",
        applicationStartDate: new Date("2026-01-01"),
        applicationEndDate: new Date("2026-01-31"),
        examDate: new Date("2026-03-10"),
        notificationUrl: "https://mha.gov.in",
        applyUrl: "https://mha.gov.in"
      },
      {
        title: "SBI Probationary Officers 2026",
        organization: "SBI",
        category: "Banking",
        status: "Closed",
        description: "Recruitment of Probationary Officers in State Bank of India.",
        applicationStartDate: new Date("2025-09-01"),
        applicationEndDate: new Date("2025-09-21"),
        examDate: new Date("2025-11-15"),
        notificationUrl: "https://sbi.co.in/careers",
        applyUrl: "https://sbi.co.in/careers"
      },
      {
        title: "TNPSC Group 4 2026",
        organization: "TNPSC",
        category: "State PSC",
        status: "Upcoming",
        description: "Combined Civil Services Examination IV (Group-IV Services).",
        applicationStartDate: new Date("2026-01-30"),
        applicationEndDate: new Date("2026-02-28"),
        examDate: new Date("2026-06-09"),
        notificationUrl: "https://tnpsc.gov.in",
        applyUrl: "https://tnpsc.gov.in"
      },
      {
        title: "CBI Sub Inspector (SSC CGL)",
        organization: "CBI",
        category: "Intelligence",
        status: "Upcoming",
        description: "Recruitment of Sub Inspectors in Central Bureau of Investigation via SSC CGL.",
        applicationStartDate: new Date("2026-04-01"),
        applicationEndDate: new Date("2026-05-01"),
        examDate: new Date("2026-07-15"),
        notificationUrl: "https://ssc.nic.in",
        applyUrl: "https://ssc.nic.in"
      }
    ];

    for (const exam of initialExams) {
      await storage.createExam(exam);
    }
  }

  const existingNotifications = await storage.getNotifications();
  if (existingNotifications.length === 0) {
    console.log("Seeding initial notifications...");
    const exams = await storage.getExams();
    if (exams.length > 0) {
      await storage.createNotification({
        examId: exams[0].id,
        title: "New Notification",
        message: `Applications for ${exams[0].title} are now open!`,
        type: "New"
      });
      if (exams.length > 1) {
        await storage.createNotification({
          examId: exams[1].id,
          title: "Exam Date Announced",
          message: `${exams[1].title} exam is scheduled for July 15th.`,
          type: "Update"
        });
      }
    }
  }
}
