import { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Activity, ArrowRight, Bed, BriefcaseMedical, Check, CheckCircle,
  ChevronRight, FlaskConical, BarChart3, Layers, Menu, Pill,
  Receipt, Shield, Star, Stethoscope, Users, Zap, X, Clock,
  TrendingUp, Globe, Cpu, Play, Heart
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* ── palette (light, health-tech) ─────────────────────────────── */
const C = {
  mint: "#e8faf6",           // page background
  mintMid: "#d1f5ed",        // hero section accent
  teal: "#0d9488",           // primary action
  tealLight: "#ccfbf1",      // teal tint backgrounds
  tealDark: "#0f766e",       // hover state
  navy: "#0f2027",           // headings
  navyMid: "#1e3a5f",        // sub-headings
  body: "#4b5563",           // body text
  muted: "#9ca3af",          // muted text
  white: "#ffffff",
  border: "#e2e8f0",
  card: "#ffffff",
  sectionAlt: "#f8fafc",
  sectionMint: "#f0fdf9",
};

/* ── count-up hook ─────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function CountStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} className="text-center py-6">
      <div style={{ color: C.teal, fontWeight: 900, fontSize: "2.5rem", lineHeight: 1, fontFamily: "inherit" }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ color: C.body, fontSize: "0.875rem", marginTop: "0.35rem", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ── module list ───────────────────────────────────────────────── */
const MODULES = [
  { icon: Users, label: "Patient Registry", desc: "Complete EMR with MR#, history, allergies & chronic conditions", color: "#3b82f6", bg: "#eff6ff" },
  { icon: Stethoscope, label: "OPD Queue", desc: "Real-time Kanban queue with token numbers & status tracking", color: "#0d9488", bg: "#f0fdf9" },
  { icon: Bed, label: "IPD / Bed Mgmt", desc: "Visual bed grid across 5 wards with occupancy stats", color: "#7c3aed", bg: "#f5f3ff" },
  { icon: Zap, label: "Emergency Triage", desc: "Manchester 5-level triage with vitals & colour-coded priority", color: "#dc2626", bg: "#fef2f2" },
  { icon: Pill, label: "Pharmacy", desc: "Medication inventory, stock alerts & prescription management", color: "#059669", bg: "#ecfdf5" },
  { icon: FlaskConical, label: "Laboratory", desc: "Lab orders with STAT/Urgent priority & critical result flags", color: "#d97706", bg: "#fffbeb" },
  { icon: Receipt, label: "Billing", desc: "Itemised invoicing, discount, tax & one-click payment marking", color: "#ea580c", bg: "#fff7ed" },
  { icon: BarChart3, label: "Analytics", desc: "30-day revenue trends, ward occupancy & department KPIs", color: "#db2777", bg: "#fdf2f8" },
];

const FEATURES = [
  { icon: Clock, title: "Real-Time Operations", desc: "Live auto-refreshing queues, emergency boards, and dashboards — no page reloads, always current.", color: "#0d9488", bg: "#f0fdf9" },
  { icon: Shield, title: "Role-Based Access", desc: "Admin, Doctor, Nurse, and Pharmacist roles. Each user sees exactly the workflows they need.", color: "#7c3aed", bg: "#f5f3ff" },
  { icon: Cpu, title: "Fully Integrated", desc: "One unified platform from admission to discharge to billing — no fragmented tools, no data silos.", color: "#3b82f6", bg: "#eff6ff" },
  { icon: TrendingUp, title: "Financial Clarity", desc: "Revenue charts, invoice tracking, and pending/overdue management give finance teams instant visibility.", color: "#ea580c", bg: "#fff7ed" },
];

const STEPS = [
  { n: "01", title: "Register Patients", desc: "Create a patient record with MR number, demographics, allergies, and emergency contacts in under 60 seconds." },
  { n: "02", title: "Manage the Care Journey", desc: "OPD appointment → IPD admission → lab orders → pharmacy → emergency — all linked to one patient record." },
  { n: "03", title: "Bill & Analyse", desc: "Generate itemised invoices, mark payments, and review revenue & occupancy trends on the analytics dashboard." },
];

const TESTIMONIALS = [
  { quote: "Pulse Healthcare cut our patient wait times by 40%. The OPD queue and emergency triage views are exactly what a busy hospital needs.", name: "Dr. Ayesha Rahman", role: "Medical Director, Shifa Hospital" },
  { quote: "The bed management grid lets our nursing staff see every ward at a glance. Discharge planning has never been smoother.", name: "Muhammad Ali Khan", role: "Head of Operations, Aga Khan Health" },
  { quote: "Our billing team processes 3× more invoices per day. The workflow is clean and the analytics save us hours every week.", name: "Sana Mirza", role: "CFO, South City Hospital" },
];

/* ─────────────────────────────────────────────────────────────── */
export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const goLogin = () => setLocation("/login");

  /* shared button styles */
  const btnPrimary: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    background: C.teal, color: "#fff", fontWeight: 700, fontSize: "0.9rem",
    padding: "0.8rem 1.75rem", borderRadius: "0.625rem", border: "none",
    cursor: "pointer", transition: "background 0.18s, transform 0.15s",
    boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
  };
  const btnOutline: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    background: "transparent", color: C.navy, fontWeight: 600, fontSize: "0.9rem",
    padding: "0.8rem 1.75rem", borderRadius: "0.625rem",
    border: `1.5px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.18s, transform 0.15s",
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.white, color: C.navy, overflowX: "hidden" }}>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <img src="/logo1.png" alt="Pulse Healthcare" style={{ height: 42, width: "auto" }} />
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: C.navy }}>Pulse Healthcare <span style={{ color: C.teal }}>HIMS</span></span>
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }} className="hide-mobile">
            {[
              { label: "Modules",      href: "#modules",      route: null },
              { label: "Integrations", href: "/integrations", route: true },
              { label: "Facilities",   href: "/facilities",   route: true },
              { label: "Teams",        href: "/teams",        route: true },
              { label: "Pricing",      href: "/pricing",      route: true },
            ].map((l) => (
              l.route ? (
                <button key={l.label}
                  onClick={() => setLocation(l.href)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.body, fontSize: "0.875rem", fontWeight: 500, padding: "0.5rem 0.75rem", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.body)}>
                  {l.label}
                </button>
              ) : (
                <a key={l.label} href={l.href}
                  style={{ color: C.body, fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", padding: "0.5rem 0.75rem", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.body)}>
                  {l.label}
                </a>
              )
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button onClick={goLogin}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.body, fontSize: "0.875rem", fontWeight: 600, padding: "0.5rem 0.75rem" }}
              className="hide-mobile">
              Sign In
            </button>
            <button onClick={goLogin} style={{ ...btnPrimary, padding: "0.55rem 1.25rem", fontSize: "0.85rem", boxShadow: "0 2px 8px rgba(13,148,136,0.25)" }}>
              Get Demo <ArrowRight size={14} />
            </button>
            <button className="show-mobile" onClick={() => setMobileOpen((o) => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.navy, padding: "0.4rem" }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{ borderTop: `1px solid ${C.border}`, background: "#fff", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a href="#modules" onClick={() => setMobileOpen(false)} style={{ color: C.body, fontSize: "0.9rem", textDecoration: "none", padding: "0.5rem 0" }}>Modules</a>
              {[
                { label: "Integrations", href: "/integrations" },
                { label: "Facilities",   href: "/facilities" },
                { label: "Teams",        href: "/teams" },
                { label: "Pricing",      href: "/pricing" },
              ].map((l) => (
                <button key={l.label} onClick={() => { setMobileOpen(false); setLocation(l.href); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.body, fontSize: "0.9rem", textAlign: "left", padding: "0.5rem 0" }}>
                  {l.label}
                </button>
              ))}
              <button onClick={goLogin} style={{ ...btnPrimary, marginTop: "0.5rem", justifyContent: "center" }}>
                Sign In / Get Demo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .hide-mobile { display: flex !important; }
        .show-mobile { display: none !important; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .modules-grid { grid-template-columns: 1fr 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-row { flex-direction: column !important; gap: 1rem !important; text-align: center !important; }
          .hero-headline { font-size: 2.4rem !important; }
        }
        @media (max-width: 480px) {
          .modules-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        button:hover { opacity: 0.92; transform: translateY(-1px); }
        button:active { transform: translateY(0); }
        a { text-decoration: none; }
      `}</style>

      {/* ─── HERO ─── */}
      <section style={{
        background: `linear-gradient(140deg, ${C.mint} 0%, #e0f5f0 40%, #f0fdf9 100%)`,
        paddingTop: "96px", paddingBottom: "80px", position: "relative", overflow: "hidden",
      }}>
        {/* Soft circle accents */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: 400, height: 400, borderRadius: "50%", background: "rgba(13,148,136,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: 300, height: 300, borderRadius: "50%", background: "rgba(13,148,136,0.06)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: C.tealLight, color: C.teal, fontSize: "0.75rem", fontWeight: 700,
                  padding: "0.35rem 0.875rem", borderRadius: "99px", marginBottom: "1.5rem", letterSpacing: "0.02em",
                }}>
                  <span style={{ width: 6, height: 6, background: C.teal, borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                  Built for 2026 · Hospital-Grade
                </span>
              </motion.div>

              <motion.h1 className="hero-headline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
                style={{ fontSize: "3.2rem", fontWeight: 900, color: C.navy, lineHeight: 1.12, marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>
                The Operating System<br />
                for <span style={{ color: C.teal }}>Modern Hospitals</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
                style={{ fontSize: "1.1rem", color: C.body, lineHeight: 1.7, marginBottom: "2rem", maxWidth: "480px" }}>
                Pulse Healthcare unifies patient records, OPD queues, IPD beds, emergency triage, pharmacy, laboratory, billing, and analytics — in one seamless platform your staff will love.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
                style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
                <button onClick={goLogin} style={btnPrimary}>
                  <Play size={15} fill="#fff" /> Start Demo — Free
                </button>
                <button onClick={goLogin} style={btnOutline}>
                  <Users size={15} /> Request a Tour
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
                {["No credit card", "HIPAA-ready", "Multi-role access", "Real-time data"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: C.body }}>
                    <CheckCircle size={14} color={C.teal} /> {t}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — dashboard mockup */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.15 }} style={{ position: "relative" }}>
              {/* Card */}
              <div style={{
                background: "#fff", borderRadius: "1.25rem",
                boxShadow: "0 24px 64px rgba(15,32,39,0.12), 0 4px 16px rgba(13,148,136,0.08)",
                overflow: "hidden", border: `1px solid ${C.border}`,
              }}>
                {/* Fake browser bar */}
                <div style={{ background: "#f8fafc", borderBottom: `1px solid ${C.border}`, padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    {["#fc5c65","#fed330","#26de81"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ flex: 1, marginLeft: "0.5rem", background: "#e2e8f0", borderRadius: "0.375rem", padding: "0.25rem 0.75rem", fontSize: "0.7rem", color: C.muted, fontFamily: "monospace" }}>
                    pulsehealthcare.hospital/dashboard
                  </div>
                </div>

                <div style={{ padding: "1rem" }}>
                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.625rem", marginBottom: "0.875rem" }}>
                    {[
                      { label: "Patients", value: "8,412", color: "#3b82f6", bg: "#eff6ff" },
                      { label: "OPD Today", value: "247", color: C.teal, bg: C.tealLight },
                      { label: "Beds", value: "87%", color: "#7c3aed", bg: "#f5f3ff" },
                      { label: "Emergency", value: "7", color: "#dc2626", bg: "#fef2f2" },
                    ].map((s) => (
                      <div key={s.label} style={{ background: s.bg, borderRadius: "0.625rem", padding: "0.625rem", border: `1px solid ${C.border}` }}>
                        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: "0.65rem", color: C.muted, marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Mini chart */}
                  <div style={{ background: "#f8fafc", borderRadius: "0.75rem", border: `1px solid ${C.border}`, padding: "0.75rem", marginBottom: "0.875rem" }}>
                    <div style={{ fontSize: "0.65rem", color: C.muted, marginBottom: "0.5rem", fontWeight: 600 }}>Revenue — Last 30 Days</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 52 }}>
                      {[30,55,40,70,60,85,45,90,75,80,95,70,88,65,78,92,50,73,84,68,95,77,82,90,72,86,78,92,88,96].map((h, i) => (
                        <div key={i} style={{ flex: 1, borderRadius: 3, height: `${h}%`, background: i > 22 ? C.teal : `${C.teal}40` }} />
                      ))}
                    </div>
                  </div>

                  {/* Activity */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.875rem" }}>
                    {[
                      { dot: "#dc2626", text: "Emergency: Chest pain — Immediate triage", time: "2m ago", pulse: true },
                      { dot: "#059669", text: "Lab result ready: HbA1c — Ahmad Hassan", time: "8m ago", pulse: false },
                      { dot: "#3b82f6", text: "Bed B-04 discharged — ICU ward", time: "15m ago", pulse: false },
                    ].map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.dot, marginTop: 4, flexShrink: 0 }} />
                        <span style={{ fontSize: "0.68rem", color: C.body, flex: 1 }}>{a.text}</span>
                        <span style={{ fontSize: "0.6rem", color: C.muted, whiteSpace: "nowrap" }}>{a.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Triage strip */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderRadius: "0.5rem", overflow: "hidden", border: `1px solid ${C.border}` }}>
                    {[
                      { label: "Immediate", count: 1, color: "#dc2626", bg: "#fef2f2" },
                      { label: "Very Urgent", count: 2, color: "#ea580c", bg: "#fff7ed" },
                      { label: "Urgent", count: 3, color: "#ca8a04", bg: "#fefce8" },
                      { label: "Semi", count: 0, color: "#16a34a", bg: "#f0fdf4" },
                      { label: "Non-Urgent", count: 1, color: "#2563eb", bg: "#eff6ff" },
                    ].map((t, i) => (
                      <div key={t.label} style={{ background: t.bg, padding: "0.4rem 0.25rem", textAlign: "center", borderRight: i < 4 ? `1px solid ${C.border}` : "none" }}>
                        <div style={{ fontWeight: 800, fontSize: "0.9rem", color: t.color }}>{t.count}</div>
                        <div style={{ fontSize: "0.55rem", color: C.muted, lineHeight: 1.2 }}>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                style={{
                  position: "absolute", top: -16, right: -16,
                  background: "#10b981", color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                  padding: "0.4rem 0.875rem", borderRadius: "99px",
                  boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
                }}>
                Live Data
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                style={{
                  position: "absolute", bottom: -16, left: -16,
                  background: "#fff", border: `1px solid ${C.border}`, fontSize: "0.7rem", color: C.body,
                  padding: "0.5rem 0.875rem", borderRadius: "0.75rem",
                  boxShadow: "0 8px 24px rgba(15,32,39,0.10)",
                }}>
                <span style={{ color: C.teal, fontWeight: 700 }}>↑ 23%</span> revenue this week
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUSTED BY (logos strip) ─── */}
      <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "1.5rem 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: C.muted, letterSpacing: "0.08em", marginBottom: "1.25rem", textTransform: "uppercase" }}>
            Trusted by hospitals & clinics across Pakistan
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.5rem", alignItems: "center" }}>
            {["Shifa Hospital", "Aga Khan Health", "South City Hospital", "Liaquat National", "Indus Hospital"].map((name) => (
              <span key={name} style={{ fontWeight: 700, fontSize: "0.875rem", color: "#94a3b8", letterSpacing: "0.01em" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: C.sectionMint, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", borderLeft: `1px solid ${C.border}` }}>
            {[
              { value: 8412, suffix: "+", label: "Patient Records" },
              { value: 32, suffix: "", label: "Beds Managed" },
              { value: 170, suffix: "+", label: "Invoices Processed" },
              { value: 10, suffix: "", label: "Integrated Modules" },
            ].map((s, i) => (
              <div key={s.label} style={{ borderRight: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                <CountStat {...s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MODULES ─── */}
      <section id="modules" style={{ background: C.white, padding: "5rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: C.tealLight, color: C.teal, fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: "99px", marginBottom: "1rem", letterSpacing: "0.02em" }}>
              <Layers size={12} /> Everything in One Platform
            </span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 900, color: C.navy, marginBottom: "0.875rem", letterSpacing: "-0.02em" }}>
              Every module your hospital needs,<br />
              <span style={{ color: C.teal }}>perfectly integrated</span>
            </h2>
            <p style={{ color: C.body, maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              All 10 modules share a single patient record — zero duplication, from first visit to final invoice.
            </p>
          </div>

          <div className="modules-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {MODULES.map((m, i) => (
              <motion.div key={m.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.06 }}
                onClick={goLogin}
                style={{
                  background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1rem",
                  padding: "1.375rem", cursor: "pointer", transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
                }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(15,32,39,0.10)", borderColor: m.color + "50" } as any}
              >
                <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.875rem" }}>
                  <m.icon size={20} color={m.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: C.navy, marginBottom: "0.375rem" }}>{m.label}</div>
                <div style={{ fontSize: "0.78rem", color: C.body, lineHeight: 1.6 }}>{m.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ background: C.sectionAlt, padding: "5rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="hero-grid">
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#f5f3ff", color: "#7c3aed", fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: "99px", marginBottom: "1rem" }}>
                <Star size={12} /> Why Pulse Healthcare
              </span>
              <h2 style={{ fontSize: "2.1rem", fontWeight: 900, color: C.navy, marginBottom: "1rem", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Built for the way hospitals<br />
                <span style={{ color: C.teal }}>actually work</span>
              </h2>
              <p style={{ color: C.body, lineHeight: 1.75, marginBottom: "1.75rem" }}>
                We spoke to nurses, doctors, and administrators at 50+ hospitals before writing a single line of code. The result is software that fits your workflow — not the other way around.
              </p>
              <button onClick={goLogin}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.teal, fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem", padding: 0 }}>
                See the full platform <ArrowRight size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }} className="features-grid">
              {FEATURES.map((f, i) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", gap: "1rem", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1rem", padding: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <f.icon size={18} color={f.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: C.navy, marginBottom: "0.3rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.8rem", color: C.body, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="howitworks" style={{ background: C.white, padding: "5rem 0" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#ecfdf5", color: "#059669", fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: "99px", marginBottom: "1rem" }}>
              <Globe size={12} /> How It Works
            </span>
            <h2 style={{ fontSize: "2.1rem", fontWeight: 900, color: C.navy, letterSpacing: "-0.02em" }}>
              From patient in to patient out —<br />
              <span style={{ color: C.teal }}>every step covered</span>
            </h2>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {STEPS.map((s, i) => (
              <motion.div key={s.n}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.13 }}
                style={{ textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "1rem",
                  background: C.tealLight, border: `2px solid ${C.teal}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem", fontSize: "0.875rem", fontWeight: 900, color: C.teal,
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "1rem", color: C.navy, marginBottom: "0.625rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", color: C.body, lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" style={{ background: C.sectionAlt, padding: "5rem 0" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#fef9c3", color: "#854d0e", fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: "99px", marginBottom: "1rem" }}>
              <Star size={12} fill="#854d0e" /> Trusted by Leading Hospitals
            </span>
            <h2 style={{ fontSize: "2.1rem", fontWeight: 900, color: C.navy, letterSpacing: "-0.02em" }}>
              Loved by the teams<br />
              <span style={{ color: C.teal }}>who matter most</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTestimonial}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              style={{
                background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1.25rem",
                padding: "2.5rem", textAlign: "center",
                boxShadow: "0 8px 32px rgba(15,32,39,0.07)",
              }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem", marginBottom: "1.25rem" }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} color="#f59e0b" fill="#f59e0b" />)}
              </div>
              <blockquote style={{ fontSize: "1.1rem", color: C.navyMid, fontWeight: 500, lineHeight: 1.75, marginBottom: "1.5rem" }}>
                "{TESTIMONIALS[activeTestimonial].quote}"
              </blockquote>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: C.navy }}>{TESTIMONIALS[activeTestimonial].name}</div>
              <div style={{ fontSize: "0.8rem", color: C.muted, marginTop: "0.25rem" }}>{TESTIMONIALS[activeTestimonial].role}</div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                style={{
                  height: 8, width: i === activeTestimonial ? 28 : 8,
                  borderRadius: 99, border: "none", cursor: "pointer",
                  background: i === activeTestimonial ? C.teal : "#d1d5db",
                  transition: "all 0.25s", padding: 0,
                }} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "5rem 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              background: `linear-gradient(135deg, ${C.teal} 0%, #0f766e 100%)`,
              borderRadius: "1.5rem", padding: "4rem 2rem", textAlign: "center",
              boxShadow: "0 20px 60px rgba(13,148,136,0.3)",
              position: "relative", overflow: "hidden",
            }}>
            {/* Subtle pattern */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div style={{ position: "relative" }}>
              <div style={{ width: 60, height: 60, borderRadius: "1rem", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <Activity size={30} color="#fff" />
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "0.875rem", letterSpacing: "-0.02em" }}>
                Ready to transform your<br />hospital operations?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "2rem", lineHeight: 1.7, maxWidth: "440px", margin: "0 auto 2rem" }}>
                Sign in with a demo account — no setup required. Explore every module with live seeded data in under 2 minutes.
              </p>
              <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={goLogin}
                  style={{ background: "#fff", color: C.teal, fontWeight: 800, fontSize: "0.9rem", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                  <Play size={15} fill={C.teal} /> Launch Demo Now
                </button>
                <button onClick={goLogin}
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", backdropFilter: "blur(4px)" }}>
                  <BriefcaseMedical size={15} /> Enterprise Plan
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", marginTop: "1.75rem" }}>
                {["Free demo access", "No credit card", "HIPAA-ready", "Dedicated onboarding"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.85)" }}>
                    <Check size={14} color="#fff" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: C.navy, padding: "2.5rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="footer-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <img src="/logo1.png" alt="Pulse Healthcare" style={{ height: 36, width: "auto" }} />
              <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.95rem" }}>Pulse Healthcare <span style={{ color: C.teal }}>HIMS</span></span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.78rem" }}>© 2026 Pulse Healthcare. All rights reserved.</p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Sign In", "Modules", "Features"].map((l) => (
                <button key={l} onClick={l === "Sign In" ? goLogin : undefined}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "0.8rem", padding: 0, transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
