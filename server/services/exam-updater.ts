import { IStorage } from "../storage";
import { insertExamSchema } from "@shared/schema";

const MOCK_NEW_EXAMS = [
  {
    title: "RBI Grade B 2026",
    organization: "RBI",
    category: "Banking",
    description: "Recruitment of Officers in Grade 'B' (General) - DR, DEPR and DSIM.",
    status: "Upcoming",
    applicationStartDate: new Date("2026-05-01"),
    applicationEndDate: new Date("2026-06-01"),
    examDate: new Date("2026-07-15"),
    notificationUrl: "https://rbi.org.in",
    applyUrl: "https://rbi.org.in"
  },
  {
    title: "SEBI Grade A 2026",
    organization: "SEBI",
    category: "Banking",
    description: "Securities and Exchange Board of India (SEBI) recruitment for Officer Grade A (Assistant Manager).",
    status: "Upcoming",
    applicationStartDate: new Date("2026-03-15"),
    applicationEndDate: new Date("2026-04-15"),
    examDate: new Date("2026-05-20"),
    notificationUrl: "https://sebi.gov.in",
    applyUrl: "https://sebi.gov.in"
  },
  {
    title: "NABARD Grade A 2026",
    organization: "NABARD",
    category: "Banking",
    description: "Recruitment of Assistant Manager in Grade 'A' in the Rural Development Banking Service (RDBS).",
    status: "Upcoming",
    applicationStartDate: new Date("2026-07-01"),
    applicationEndDate: new Date("2026-08-01"),
    examDate: new Date("2026-09-10"),
    notificationUrl: "https://nabard.org",
    applyUrl: "https://nabard.org"
  }
];

export class ExamUpdater {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async checkUpdates() {
    console.log("[ExamUpdater] Checking for updates...");
    const updates = [];
    const exams = await this.storage.getExams();
    const now = new Date();

    // 1. Update Status based on dates
    for (const exam of exams) {
      let newStatus = exam.status;
      
      if (exam.applicationStartDate && exam.applicationEndDate) {
        const start = new Date(exam.applicationStartDate);
        const end = new Date(exam.applicationEndDate);

        if (now < start) {
          newStatus = "Upcoming";
        } else if (now >= start && now <= end) {
          newStatus = "Ongoing";
        } else if (now > end) {
          newStatus = "Closed";
        }
      }

      if (newStatus !== exam.status) {
        console.log(`[ExamUpdater] Updating status for ${exam.title}: ${exam.status} -> ${newStatus}`);
        await this.storage.updateExam(exam.id, { status: newStatus });
        
        // Create notification for status change
        await this.storage.createNotification({
          examId: exam.id,
          title: "Exam Status Updated",
          message: `Status for ${exam.title} has changed to ${newStatus}.`,
          type: "Update"
        });
        updates.push(`${exam.title} status updated to ${newStatus}`);
      }
    }

    // 2. Simulate finding NEW exams (Mock Scraping)
    // In a real app, this would fetch from an external source
    // Here we just add a mock exam if it doesn't exist
    for (const mockExam of MOCK_NEW_EXAMS) {
      const exists = exams.find(e => e.title === mockExam.title);
      if (!exists) {
        // Only add one per check to simulate gradual updates
        if (updates.length === 0 || Math.random() > 0.5) {
          console.log(`[ExamUpdater] Found new exam: ${mockExam.title}`);
          const newExam = await this.storage.createExam(mockExam);
          
          await this.storage.createNotification({
            examId: newExam.id,
            title: "New Exam Alert",
            message: `New notification released: ${newExam.title}`,
            type: "New"
          });
          updates.push(`New exam found: ${newExam.title}`);
          break; // Stop after adding one
        }
      }
    }

    return updates;
  }

  startScheduler(intervalMs: number = 24 * 60 * 60 * 1000) { // Default 24h
    console.log(`[ExamUpdater] Scheduler started with interval ${intervalMs}ms`);
    // Run immediately on start
    this.checkUpdates().catch(err => console.error("[ExamUpdater] Error in initial check:", err));
    
    // Schedule
    setInterval(() => {
      this.checkUpdates().catch(err => console.error("[ExamUpdater] Error in scheduled check:", err));
    }, intervalMs);
  }
}
