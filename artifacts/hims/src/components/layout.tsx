import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Bed, BriefcaseMedical, ChevronLeft, ChevronRight,
  FlaskConical, LayoutDashboard, LogOut, Moon, Pill, Receipt, Stethoscope,
  Sun, Users, Zap, Menu, X, Bell, Search, User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/patients", icon: Users, label: "Patients" },
  { path: "/opd", icon: Stethoscope, label: "OPD Queue" },
  { path: "/ipd", icon: Bed, label: "IPD / Beds" },
  { path: "/emergency", icon: Zap, label: "Emergency" },
  { path: "/pharmacy", icon: Pill, label: "Pharmacy" },
  { path: "/laboratory", icon: FlaskConical, label: "Laboratory" },
  { path: "/billing", icon: Receipt, label: "Billing" },
  { path: "/analytics", icon: Activity, label: "Analytics" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };
  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
      mobile ? "w-64" : collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0", collapsed && !mobile && "px-3 justify-center")}>
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <div className="text-sidebar-foreground font-bold text-sm leading-none truncate">MediCore</div>
            <div className="text-sidebar-foreground/40 text-[10px]">HIMS 2026</div>
          </div>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto scrollbar-thin">
        {NAV.map((item) => {
          const active = location === item.path || location.startsWith(item.path + "/");
          return (
            <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
              <div className={cn(
                "flex items-center gap-3 mx-2 my-0.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors relative group",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && !mobile && "justify-center px-2"
              )}>
                <item.icon className="w-4 h-4 shrink-0" />
                {(!collapsed || mobile) && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {active && (
                  <motion.div layoutId="nav-indicator" className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r bg-primary-foreground/60" />
                )}
                {collapsed && !mobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-sidebar-border p-3 shrink-0", collapsed && !mobile && "p-2")}>
        {(!collapsed || mobile) && user && (
          <div className="flex items-center gap-2 mb-2 px-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sidebar-foreground text-xs font-medium truncate">{user.name}</div>
              <div className="text-sidebar-foreground/40 text-[10px] truncate">{user.role}</div>
            </div>
          </div>
        )}
        <div className={cn("flex items-center gap-1", collapsed && !mobile && "justify-center flex-col")}>
          <ThemeToggle />
          <button onClick={logout} className="p-2 rounded-lg hover:bg-destructive/20 text-sidebar-foreground/60 hover:text-destructive transition-colors flex items-center gap-1.5">
            <LogOut className="w-4 h-4" />
            {(!collapsed || mobile) && <span className="text-xs">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0 bg-card">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground">
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search patients, MR#, staff…"
                className="w-full h-8 pl-9 pr-3 bg-muted rounded-lg text-sm border border-border focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-medium text-foreground leading-none">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground">{user.role}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
