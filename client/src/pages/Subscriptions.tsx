import { Sidebar } from "@/components/Sidebar";
import { useSubscriptions, useCreateSubscription, useDeleteSubscription } from "@/hooks/use-subscriptions";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, Plus, Shield, Landmark, Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  { id: "Central", label: "Central Govt", icon: Briefcase, color: "text-blue-600 bg-blue-100" },
  { id: "Banking", label: "Banking & Finance", icon: Landmark, color: "text-green-600 bg-green-100" },
  { id: "Police", label: "Police & Defense", icon: Shield, color: "text-red-600 bg-red-100" },
  { id: "State", label: "State Govt", icon: GraduationCap, color: "text-orange-600 bg-orange-100" },
];

export default function Subscriptions() {
  const { user, isAuthenticated } = useAuth();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const createSub = useCreateSubscription();
  const deleteSub = useDeleteSubscription();

  const handleToggle = (type: "Category", value: string) => {
    const existing = subscriptions?.find(s => s.type === type && s.value === value);
    if (existing) {
      deleteSub.mutate(existing.id);
    } else {
      createSub.mutate({ type, value });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <Bell className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Manage Alerts</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-lg">
            Sign in to subscribe to exam categories and get notified about new opportunities instantly.
          </p>
          <a href="/api/login">
            <Button size="lg" className="bg-primary text-primary-foreground">Sign In to Continue</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-primary">My Subscriptions</h1>
            <p className="text-muted-foreground mt-2">
              Customize your alert preferences. You will receive notifications for selected categories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary" /> Exam Categories
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat, idx) => {
                  const isSubscribed = subscriptions?.some(s => s.type === "Category" && s.value === cat.id);
                  const Icon = cat.icon;
                  
                  return (
                    <motion.div 
                      key={cat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group",
                        isSubscribed 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border bg-card hover:border-primary/50"
                      )}
                      onClick={() => handleToggle("Category", cat.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-lg", cat.color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{cat.label}</h3>
                          <p className="text-xs text-muted-foreground">
                            {isSubscribed ? "Notifications Active" : "Click to Subscribe"}
                          </p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSubscribed ? "bg-primary border-primary" : "border-muted-foreground/30"
                      )}>
                        {isSubscribed && <Plus className="w-4 h-4 text-white transform rotate-45" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Custom/Organization Subscriptions */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-secondary" /> Active Subscriptions
              </h2>
              
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : subscriptions && subscriptions.length > 0 ? (
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="divide-y divide-border">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {sub.type}: <span className="text-foreground font-bold">{sub.value}</span>
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => deleteSub.mutate(sub.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-muted/20 rounded-xl border border-dashed border-border text-center">
                  <p className="text-muted-foreground">You haven't subscribed to any specific alerts yet.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
