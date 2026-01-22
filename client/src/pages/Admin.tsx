import { Sidebar } from "@/components/Sidebar";
import { useExams } from "@/hooks/use-exams";
import { CreateExamDialog } from "@/components/CreateExamDialog";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { Edit, Eye, RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Admin() {
  const { data: exams, isLoading } = useExams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/trigger-update", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to trigger update");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      
      const updates = data.updates || [];
      toast({
        title: "Update Completed",
        description: updates.length > 0 
          ? `Found ${updates.length} updates: ${updates.join(", ")}`
          : "No new updates found.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary">Administration</h1>
              <p className="text-muted-foreground mt-1">Manage exam notifications and system data.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${updateMutation.isPending ? "animate-spin" : ""}`} />
                {updateMutation.isPending ? "Checking..." : "Check for Updates"}
              </Button>
              <CreateExamDialog />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Loading exams...</TableCell>
                  </TableRow>
                ) : exams && exams.length > 0 ? (
                  exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.title}</TableCell>
                      <TableCell>{exam.organization}</TableCell>
                      <TableCell>{exam.category}</TableCell>
                      <TableCell><StatusBadge status={exam.status} /></TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {exam.lastUpdated ? format(new Date(exam.lastUpdated), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/exams/${exam.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-secondary-foreground">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No exams found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
