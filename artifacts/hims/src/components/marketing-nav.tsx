import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowRight, Menu, X } from "lucide-react";

const C = { teal: "#0d9488", navy: "#0f2027", body: "#4b5563", border: "#e2e8f0", white: "#ffffff" };

const NAV_LINKS = [
  { label: "Integrations", href: "/integrations" },
  { label: "Facilities",   href: "/facilities" },
  { label: "Teams",        href: "/teams" },
  { label: "Pricing",      href: "/pricing" },
];

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [location] = useLocation();

  const go = (href: string) => { setLocation(href); setMobileOpen(false); };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <button onClick={() => go("/")} style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: C.navy }}>Pulse Healthcare</span>
        </button>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="mnav-desktop">
          {NAV_LINKS.map((l) => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "0.875rem", fontWeight: location === l.href ? 700 : 500,
                color: location === l.href ? C.teal : C.body,
                borderBottom: location === l.href ? `2px solid ${C.teal}` : "2px solid transparent",
                paddingBottom: 2, transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
              onMouseLeave={e => (e.currentTarget.style.color = location === l.href ? C.teal : C.body)}>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={() => go("/login")}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.body, fontSize: "0.875rem", fontWeight: 600, padding: "0.5rem 0.75rem" }}
            className="mnav-desktop">
            Sign In
          </button>
          <button onClick={() => go("/login")}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: C.teal, color: "#fff", fontWeight: 700, fontSize: "0.85rem", padding: "0.55rem 1.25rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(13,148,136,0.25)" }}>
            Get Demo <ArrowRight size={13} />
          </button>
          <button onClick={() => setMobileOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.navy, padding: "0.4rem", display: "flex" }}
            className="mnav-mobile">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ borderTop: `1px solid ${C.border}`, background: "#fff", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <button onClick={() => go("/")} style={{ background: "none", border: "none", cursor: "pointer", color: C.body, fontSize: "0.9rem", textAlign: "left", padding: "0.4rem 0" }}>Home</button>
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => go(l.href)}
                style={{ background: "none", border: "none", cursor: "pointer", color: location === l.href ? C.teal : C.body, fontSize: "0.9rem", textAlign: "left", padding: "0.4rem 0", fontWeight: location === l.href ? 700 : 400 }}>
                {l.label}
              </button>
            ))}
            <button onClick={() => go("/login")}
              style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem", background: C.teal, color: "#fff", border: "none", borderRadius: "0.625rem", fontWeight: 700, cursor: "pointer" }}>
              Sign In / Get Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mnav-desktop { display: flex !important; }
        .mnav-mobile  { display: none  !important; }
        @media (max-width: 768px) {
          .mnav-desktop { display: none  !important; }
          .mnav-mobile  { display: flex  !important; }
        }
      `}</style>
    </nav>
  );
}

export function MarketingFooter() {
  const [, setLocation] = useLocation();
  return (
    <footer style={{ background: "#0f2027", padding: "2.5rem 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <button onClick={() => setLocation("/")} style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, borderRadius: "0.5rem", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.9rem" }}>Pulse Healthcare <span style={{ color: C.teal }}></span></span>
        </button>
        <p style={{ color: "#94a3b8", fontSize: "0.78rem" }}>© 2026 Pulse Healthcare. All rights reserved.</p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[["Home","/"], ...NAV_LINKS.map(l => [l.label, l.href])].map(([label, href]) => (
            <button key={href} onClick={() => setLocation(href as string)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "0.8rem", padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
