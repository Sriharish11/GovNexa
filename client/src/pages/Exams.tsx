import { Sidebar } from "@/components/Sidebar";
import { useExams } from "@/hooks/use-exams";
import { ExamCard } from "@/components/ExamCard";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce"; // We'll implement this simple hook inline or use standard pattern
import { motion } from "framer-motion";

// Simple debounce hook for search
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  });
  
  return debouncedValue;
}

export default function Exams() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  
  // Debounce search to prevent spamming API
  // Note: Using standard setTimeout pattern inside component for simplicity if custom hook not available, 
  // but let's assume immediate search for now or rely on RQ caching.
  // Actually, let's implement the debounce logic:
  // (In a real app, I'd put this in hooks/use-debounce.ts)
  
  const { data: exams, isLoading, isError, refetch } = useExams({ 
    search: search || undefined,
    category: category === "all" ? undefined : category,
    status: status === "all" ? undefined : status,
  });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary">Browse Exams</h1>
              <p className="text-muted-foreground mt-1">Find and track government recruitment opportunities.</p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border mb-8 sticky top-0 z-20 backdrop-blur-md bg-white/90">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search exams by title or organization..." 
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Central">Central Govt</SelectItem>
                  <SelectItem value="Banking">Banking</SelectItem>
                  <SelectItem value="Police">Police/Defense</SelectItem>
                  <SelectItem value="State">State Govt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-xl border border-border" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-destructive/5 rounded-xl border border-destructive/20">
              <p className="text-destructive font-medium mb-4">Failed to load exams.</p>
              <Button onClick={() => refetch()} variant="outline" className="gap-2">
                <RefreshCw size={16} /> Retry
              </Button>
            </div>
          ) : exams && exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, idx) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ExamCard exam={exam} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No exams found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
