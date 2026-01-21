import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Exams from "@/pages/Exams";
import ExamDetail from "@/pages/ExamDetail";
import Subscriptions from "@/pages/Subscriptions";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/exams" component={Exams} />
      <Route path="/exams/:id" component={ExamDetail} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
