import { Sidebar } from "@/components/Sidebar";
import { useNotifications } from "@/hooks/use-notifications";
import { useExams } from "@/hooks/use-exams";
import { Bell, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";
import { motion } from "framer-motion";

export default function Home() {
  const { data: notifications } = useNotifications();
  const { data: recentExams } = useExams({ status: "Open" });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8 mb-8 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white">
                GovNexa Central Portal
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-6">
                Your official source for government recruitment notifications, exam schedules, and results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/exams">
                  <div className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-secondary/90 transition-all cursor-pointer">
                    Browse Active Exams
                  </div>
                </Link>
                <Link href="/subscriptions">
                  <div className="px-6 py-3 bg-white/10 text-white border border-white/20 font-semibold rounded-lg hover:bg-white/20 transition-all cursor-pointer">
                    Manage Alerts
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Abstract Decorative Pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Latest Updates Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" /> Latest Updates
                </h2>
              </div>

              {notifications && notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map((notif, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={notif.id}
                      className="bg-card p-4 rounded-xl border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-foreground">{notif.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notif.createdAt && format(new Date(notif.createdAt), "MMM d")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-8 text-center border border-dashed border-border">
                  <p className="text-muted-foreground">No recent notifications.</p>
                </div>
              )}
            </div>

            {/* Upcoming Deadlines Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" /> Active Deadlines
                </h2>
                <Link href="/exams">
                  <span className="text-sm text-primary font-medium hover:underline cursor-pointer">View All</span>
                </Link>
              </div>

              {recentExams ? (
                <div className="space-y-3">
                  {recentExams.slice(0, 4).map((exam, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={exam.id}
                      className="bg-card p-4 rounded-xl border border-border shadow-sm group hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-primary/70">{exam.organization}</span>
                        <StatusBadge status={exam.status} />
                      </div>
                      <Link href={`/exams/${exam.id}`}>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer mb-2 line-clamp-2">
                          {exam.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-border/50">
                        <span className="text-muted-foreground">Apply by:</span>
                        <span className="font-semibold text-destructive">
                          {exam.applicationEndDate ? format(new Date(exam.applicationEndDate), "MMM d, yyyy") : "TBA"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="animate-pulse h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
