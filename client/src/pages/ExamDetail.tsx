import { Sidebar } from "@/components/Sidebar";
import { useExam } from "@/hooks/use-exams";
import { useRoute, Link } from "wouter";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  ArrowLeft, 
  Share2, 
  ShieldCheck,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ExamDetail() {
  const [, params] = useRoute("/exams/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: exam, isLoading, isError } = useExam(id);

  if (isLoading) return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  );

  if (isError || !exam) return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Exam Not Found</h2>
        <p className="text-gray-600 mb-6">The exam notification you are looking for does not exist.</p>
        <Link href="/exams">
          <Button>Back to Browse</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <Link href="/exams">
            <div className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Exams
            </div>
          </Link>

          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            {/* Header Banner */}
            <div className="bg-primary/5 p-8 border-b border-border/50">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-secondary-foreground tracking-wide uppercase">
                      {exam.organization}
                    </span>
                    <StatusBadge status={exam.status} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 leading-tight">
                    {exam.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-border/50">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>{exam.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-border/50">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Updated {exam.lastUpdated ? format(new Date(exam.lastUpdated), "MMM d, yyyy") : ""}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Key Dates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-muted/20 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Application Start</p>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    {exam.applicationStartDate ? format(new Date(exam.applicationStartDate), "MMM d, yyyy") : "TBA"}
                  </p>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Application Deadline</p>
                  <p className="font-semibold text-destructive flex items-center gap-2">
                    <Clock className="w-4 h-4 text-destructive/70" />
                    {exam.applicationEndDate ? format(new Date(exam.applicationEndDate), "MMM d, yyyy") : "TBA"}
                  </p>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Exam Date</p>
                  <p className="font-semibold text-primary flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    {exam.examDate ? format(new Date(exam.examDate), "MMM d, yyyy") : "TBA"}
                  </p>
                </div>
              </div>

              <div className="prose prose-blue max-w-none mb-8 text-muted-foreground">
                <h3 className="text-foreground font-serif text-xl mb-4">Description</h3>
                <p className="whitespace-pre-wrap leading-relaxed">{exam.description || "No detailed description provided."}</p>
              </div>

              <Separator className="my-8" />

              <div className="flex flex-col sm:flex-row gap-4">
                {exam.applyUrl && (
                  <a href={exam.applyUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                      Apply Online <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                )}
                
                {exam.notificationUrl && (
                  <a href={exam.notificationUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full h-12 text-base border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50">
                      Official Notification <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
