import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Building2, 
  Bell, 
  Home, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/exams", label: "Browse Exams", icon: Building2 },
    { href: "/subscriptions", label: "My Subscriptions", icon: Bell },
  ];

  if (isAuthenticated && user?.email?.includes("admin")) { // Simplified admin check
    links.push({ href: "/admin", label: "Administration", icon: Settings });
  }

  const NavItem = ({ href, label, icon: Icon }: any) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group",
          isActive 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        onClick={() => setMobileOpen(false)}
        >
          <Icon className={cn("w-5 h-5", isActive ? "text-secondary" : "group-hover:text-primary")} />
          <span className="font-medium">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-primary-foreground rounded-full shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:transform-none flex flex-col shadow-xl lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-primary">GovNexa</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Exam Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavItem key={link.href} {...link} />
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border bg-muted/30">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{user?.firstName || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <a href="/api/login" className="block">
              <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-lg hover:shadow-xl font-medium cursor-pointer">
                <LogIn size={18} />
                Sign In
              </div>
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
