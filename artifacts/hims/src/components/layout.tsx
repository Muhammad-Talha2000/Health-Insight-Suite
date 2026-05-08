import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Bed, BriefcaseMedical, ChevronLeft, ChevronRight,
  FlaskConical, LayoutDashboard, LogOut, Pill, Receipt, Stethoscope,
  Users, Zap, Menu, Bell, Search, User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV = [
  { path: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { path: "/patients",   icon: Users,           label: "Patients" },
  { path: "/opd",        icon: Stethoscope,     label: "OPD Queue" },
  { path: "/ipd",        icon: Bed,             label: "IPD / Beds" },
  { path: "/emergency",  icon: Zap,             label: "Emergency" },
  { path: "/pharmacy",   icon: Pill,            label: "Pharmacy" },
  { path: "/laboratory", icon: FlaskConical,    label: "Laboratory" },
  { path: "/billing",    icon: Receipt,         label: "Billing" },
  { path: "/analytics",  icon: Activity,        label: "Analytics" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#ffffff",
      borderRight: "1px solid #e2e8f0",
      width: mobile ? 240 : collapsed ? 64 : 232,
      transition: "width 0.25s",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.625rem",
        padding: collapsed && !mobile ? "0 0.75rem" : "0 1rem",
        height: 56, borderBottom: "1px solid #e2e8f0", flexShrink: 0,
        justifyContent: collapsed && !mobile ? "center" : "flex-start",
      }}>
        <img src="/logo1.png" alt="MediCore HIMS" style={{ height: 30, width: "auto", flexShrink: 0 }} />
        {(!collapsed || mobile) && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: "0.875rem", color: "#0f2027", lineHeight: 1 }}>MediCore</div>
            <div style={{ fontSize: "0.65rem", color: "#9ca3af" }}>HIMS 2026</div>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "0.25rem", display: "flex", marginLeft: "auto" }}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.5rem 0.5rem", overflowY: "auto" }}>
        {NAV.map((item) => {
          const active = location === item.path || location.startsWith(item.path + "/");
          return (
            <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
              <div style={{
                display: "flex", alignItems: "center",
                gap: "0.625rem",
                padding: collapsed && !mobile ? "0.625rem" : "0.625rem 0.75rem",
                borderRadius: "0.625rem",
                margin: "0.125rem 0",
                cursor: "pointer",
                justifyContent: collapsed && !mobile ? "center" : "flex-start",
                background: active ? "#0d9488" : "transparent",
                color: active ? "#fff" : "#4b5563",
                fontWeight: active ? 700 : 500,
                fontSize: "0.85rem",
                transition: "background 0.15s, color 0.15s",
                position: "relative",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#f0fdf9"; (e.currentTarget as HTMLDivElement).style.color = active ? "#fff" : "#0d9488"; }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.color = active ? "#fff" : "#4b5563"; } }}
              >
                <item.icon size={17} style={{ flexShrink: 0 }} />
                {(!collapsed || mobile) && <span>{item.label}</span>}
                {/* Tooltip for collapsed */}
                {collapsed && !mobile && (
                  <div style={{
                    position: "absolute", left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)",
                    background: "#0f2027", color: "#fff", fontSize: "0.75rem", padding: "0.3rem 0.625rem",
                    borderRadius: "0.375rem", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 50,
                    opacity: 0, transition: "opacity 0.15s",
                  }} className="nav-tooltip">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: "1px solid #e2e8f0", padding: collapsed && !mobile ? "0.75rem 0.5rem" : "0.75rem", flexShrink: 0 }}>
        {(!collapsed || mobile) && user && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem", padding: "0 0.25rem" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <User size={14} color="#fff" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f2027", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: "0.65rem", color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={logout}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            width: "100%", padding: "0.5rem 0.625rem", borderRadius: "0.5rem",
            background: "none", border: "none", cursor: "pointer",
            color: "#9ca3af", fontSize: "0.8rem", fontWeight: 600,
            justifyContent: collapsed && !mobile ? "center" : "flex-start",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget).style.background = "#fef2f2"; (e.currentTarget).style.color = "#dc2626"; }}
          onMouseLeave={e => { (e.currentTarget).style.background = "transparent"; (e.currentTarget).style.color = "#9ca3af"; }}>
          <LogOut size={15} />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>

      <style>{`
        .nav-item:hover .nav-tooltip { opacity: 1 !important; }
      `}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex" style={{ height: "100%", flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(15,32,39,0.4)" }}
              onClick={() => setMobileOpen(false)} className="lg:hidden" />
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: "spring", damping: 26 }}
              style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50 }} className="lg:hidden">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          height: 56, borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center",
          padding: "0 1.25rem", gap: "0.75rem", flexShrink: 0, background: "#ffffff",
          boxShadow: "0 1px 3px rgba(15,32,39,0.04)",
        }}>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "0.375rem", display: "flex" }}>
            <Menu size={18} />
          </button>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: "380px", position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input type="search" placeholder="Search patients, MR#, staff…"
              style={{
                width: "100%", height: 34, paddingLeft: 30, paddingRight: 10, borderRadius: "0.625rem",
                border: "1.5px solid #e2e8f0", fontSize: "0.82rem", color: "#0f2027", outline: "none",
                background: "#f8fafc", boxSizing: "border-box", transition: "border-color 0.15s",
              }}
              onFocus={e => (e.target.style.borderColor = "#0d9488")}
              onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "0.375rem", display: "flex" }}>
              <Bell size={17} />
              <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, background: "#dc2626", borderRadius: "50%", border: "1.5px solid #fff" }} />
            </button>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", paddingLeft: "0.75rem", borderLeft: "1px solid #e2e8f0" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={14} color="#fff" />
                </div>
                <div className="hidden sm:block">
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f2027", lineHeight: 1 }}>{user.name}</div>
                  <div style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{user.role}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", background: "#f8fafc" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
