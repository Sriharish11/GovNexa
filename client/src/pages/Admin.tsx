import { Sidebar } from "@/components/Sidebar";
import { useExams } from "@/hooks/use-exams";
import { CreateExamDialog } from "@/components/CreateExamDialog";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { Edit, Eye, Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { data: exams, isLoading } = useExams();

  // Basic authorization check
  if (!isAuthenticated || !user?.email?.includes("admin")) { // Simplified check
    return (
      <div className="flex h-screen bg-background items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-card p-8 rounded-xl shadow-lg border border-border">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have administrative privileges to view this page.</p>
          <Link href="/">
            <Button className="w-full">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <CreateExamDialog />
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
