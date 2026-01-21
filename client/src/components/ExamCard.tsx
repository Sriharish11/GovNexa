import { Link } from "wouter";
import { format } from "date-fns";
import { Calendar, Building, ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Exam } from "@shared/schema";

export function ExamCard({ exam }: { exam: Exam }) {
  return (
    <div className="group relative bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-muted/50 p-2 rounded-lg border border-border">
            <Building className="w-6 h-6 text-primary" />
          </div>
          <StatusBadge status={exam.status} />
        </div>

        <div className="mb-2">
          <p className="text-xs font-bold text-secondary-foreground uppercase tracking-wider mb-1">{exam.organization}</p>
          <h3 className="text-lg font-serif font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {exam.title}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
          {exam.description || "No description available."}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary/70" />
            <span>Last Updated: {exam.lastUpdated ? format(new Date(exam.lastUpdated), 'MMM d, yyyy') : 'N/A'}</span>
          </div>
        </div>
      </div>

      <Link href={`/exams/${exam.id}`}>
        <div className="px-6 py-3 bg-muted/30 group-hover:bg-primary/5 border-t border-border flex items-center justify-between text-sm font-semibold text-primary cursor-pointer transition-colors">
          View Details
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
}
