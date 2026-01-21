import { Button } from "@/components/ui/button";
import { LogIn, ShieldCheck } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary transform -skew-y-6 origin-top-left translate-y-[-20%] z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl z-0" />

      <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl border border-border p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
            <ShieldCheck className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome to GovNexa</h1>
          <p className="text-muted-foreground">
            The official portal for government recruitment notifications and exam alerts.
          </p>
        </div>

        <div className="space-y-4">
          <a href="/api/login" className="block w-full">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg h-12 shadow-md transition-all hover:scale-[1.02]">
              <LogIn className="mr-2 w-5 h-5" /> Sign In with Replit
            </Button>
          </a>
          
          <div className="text-center text-xs text-muted-foreground mt-6">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
