import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import {
  Users, Stethoscope, Heart, Pill, FlaskConical,
  Receipt, BarChart3, Zap, ArrowRight, Check, ChevronDown
} from "lucide-react";

const C = { teal: "#0d9488", tealLight: "#ccfbf1", navy: "#0f2027", body: "#4b5563", muted: "#9ca3af", border: "#e2e8f0", white: "#ffffff", mint: "#f0fdf9", bg: "#f8fafc" };

const ROLES = [
  {
    icon: Users, color: "#3b82f6", bg: "#eff6ff", label: "Administrator",
    tagline: "Full command over the entire system",
    desc: "Admins get a bird's-eye view of all departments. Manage staff accounts, configure modules, view system-wide analytics, and control billing settings — all from one place.",
    superpowers: ["Manage all user accounts & roles", "View hospital-wide analytics dashboard", "Configure modules, tariffs & billing rules", "Generate management & compliance reports", "Audit trail access for all system events"],
    daily: ["Morning: review overnight alerts & bed occupancy", "Approve pending staff access requests", "Check monthly revenue dashboard", "Generate end-of-day billing summary"],
  },
  {
    icon: Stethoscope, color: C.teal, bg: C.mint, label: "Doctor / Clinician",
    tagline: "Focus on patients, not paperwork",
    desc: "Clinicians access patient history, write consultation notes, order labs and prescriptions, and review results — without ever leaving a single screen.",
    superpowers: ["Full patient EMR and history access", "Write & sign consultation notes", "Order labs with STAT/Urgent flags", "Prescribe medications digitally", "View & action lab and imaging results"],
    daily: ["OPD queue shows next patient automatically", "One-click lab order from consultation", "Lab result notifications in real-time", "Prescription auto-sent to pharmacy"],
  },
  {
    icon: Heart, color: "#db2777", bg: "#fdf2f8", label: "Nursing Staff",
    tagline: "Coordinate care at the bedside",
    desc: "Nurses manage ward rounds, track vital signs, administer medications, and update patient status in real-time — reducing handover errors and keeping everyone in sync.",
    superpowers: ["View and update patient vitals", "Bed-side admission & discharge workflow", "Medication administration recording", "Nursing notes and care plan updates", "Ward round checklist management"],
    daily: ["Shift handover summary auto-generated", "Medication due alerts by patient", "Vitals update pushes to doctor dashboard", "Discharge checklist with one-click sign-off"],
  },
  {
    icon: Pill, color: "#059669", bg: "#ecfdf5", label: "Pharmacist",
    tagline: "Dispense faster, stock smarter",
    desc: "Pharmacists receive digital prescriptions instantly, validate drug interactions, dispense and deduct from inventory — all while getting real-time low-stock alerts.",
    superpowers: ["Receive digital prescriptions in real-time", "Drug interaction & allergy checking", "Inventory management with reorder alerts", "Controlled substance logging", "Expiry date tracking & disposal records"],
    daily: ["New prescription arrives with patient allergy flags", "One-click dispensing deducts stock", "Low-stock notification before running out", "End-of-day controlled substance reconciliation"],
  },
  {
    icon: FlaskConical, color: "#ca8a04", bg: "#fefce8", label: "Lab Technician",
    tagline: "Results in, results out — instantly",
    desc: "Lab techs receive orders with priority flags, enter results, auto-flag critical values, and push reports directly to the requesting clinician — no phone calls required.",
    superpowers: ["Receive STAT / Urgent flagged orders first", "Enter results with reference range validation", "Auto-flag critical values for immediate alert", "Push results to clinician with one click", "Daily workload & turnaround analytics"],
    daily: ["STAT orders highlighted at top of queue", "Critical result triggers auto-alert to doctor", "Results pushed digitally — no printing needed", "Daily productivity report auto-generated"],
  },
  {
    icon: Receipt, color: "#ea580c", bg: "#fff7ed", label: "Finance & Billing",
    tagline: "Revenue clarity from day one",
    desc: "Finance teams manage itemised invoices, track payment status, apply discounts, run revenue reports — and reconcile billing across OPD, IPD, pharmacy, and labs in one view.",
    superpowers: ["Create and manage itemised invoices", "Track pending, partial & paid status", "Apply discounts and manage insurance claims", "Daily, weekly & monthly revenue reports", "Cross-department billing reconciliation"],
    daily: ["Morning revenue snapshot on login", "One-click mark-as-paid for settled invoices", "Auto-generated monthly reconciliation report", "Overdue invoice alerts with follow-up prompts"],
  },
  {
    icon: Zap, color: "#dc2626", bg: "#fef2f2", label: "Emergency Team",
    tagline: "Triage with confidence under pressure",
    desc: "Emergency staff use the Manchester triage board to assign priority, track vitals, request urgent labs and beds, and escalate critical cases — all in real-time.",
    superpowers: ["Manchester 5-level triage workflow", "Real-time vitals and condition tracking", "Instant bed request to IPD ward", "STAT lab orders with critical alerts", "Emergency case timeline audit trail"],
    daily: ["Triage board shows all active cases by colour", "Vitals update visible to attending doctor live", "Bed found and confirmed in under 2 minutes", "Critical labs flagged back within minutes"],
  },
  {
    icon: BarChart3, color: "#7c3aed", bg: "#f5f3ff", label: "Analytics / Reports",
    tagline: "Data-driven decisions, every day",
    desc: "Analytics users access 30-day revenue trends, department performance KPIs, bed occupancy heatmaps, and patient flow reports — exportable for board presentations.",
    superpowers: ["30-day revenue & occupancy trends", "Department-level performance KPIs", "Patient volume and wait-time analysis", "Bed occupancy heatmap by ward", "One-click export to PDF / CSV"],
    daily: ["Dashboard refreshes overnight with new data", "Weekly trend report auto-delivered by email", "Board presentation ready in one click", "Drill-down from summary to individual records"],
  },
];

export default function Teams() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState(0);
  const role = ROLES[selected];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.white, color: C.navy, minHeight: "100vh" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: 96, background: `linear-gradient(135deg, #dff7f2 0%, ${C.mint} 60%, ${C.white} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(13,148,136,0.08)" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: C.tealLight, color: C.teal, fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: 99, marginBottom: "1.25rem" }}>
              <Users size={12} /> Built for Every Role
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.25rem)", fontWeight: 900, color: C.navy, lineHeight: 1.12, marginBottom: "1.25rem", letterSpacing: "-0.025em", maxWidth: 620 }}>
              The right tools for<br />
              <span style={{ color: C.teal }}>every member of your team</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: C.body, lineHeight: 1.75, maxWidth: 500 }}>
              Pulse Healthcare provides purpose-built workflows for each hospital role — from doctors and nurses to finance teams and lab technicians.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Role selector tabs */}
      <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 64, zIndex: 40, overflowX: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", display: "flex", gap: "0.125rem" }}>
          {ROLES.map((r, i) => (
            <button key={r.label} onClick={() => setSelected(i)}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.875rem 1rem",
                background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                fontSize: "0.82rem", fontWeight: selected === i ? 700 : 500,
                color: selected === i ? r.color : C.body,
                borderBottom: selected === i ? `2px solid ${r.color}` : "2px solid transparent",
                transition: "color 0.15s",
              }}>
              <r.icon size={14} />
              {r.label}
            </button>
          ))}
        </div>
      </section>

      {/* Role detail */}
      <section style={{ background: C.bg, padding: "4rem 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <AnimatePresence mode="wait">
            <motion.div key={selected}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}
              className="teams-grid">
              {/* Left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "1rem", background: role.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <role.icon size={26} color={role.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: C.navy, margin: 0 }}>{role.label}</h2>
                    <div style={{ fontSize: "0.82rem", color: role.color, fontWeight: 600 }}>{role.tagline}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.95rem", color: C.body, lineHeight: 1.8, marginBottom: "1.75rem" }}>{role.desc}</p>

                <h3 style={{ fontSize: "0.85rem", fontWeight: 800, color: C.navy, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.875rem" }}>Key Capabilities</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {role.superpowers.map(sp => (
                    <li key={sp} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: C.body }}>
                      <Check size={15} color={role.color} style={{ flexShrink: 0, marginTop: 2 }} /> {sp}
                    </li>
                  ))}
                </ul>

                <button onClick={() => setLocation("/login")}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "2rem", background: role.color, color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "0.8rem 1.75rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: `0 4px 14px ${role.color}40` }}>
                  Try as {role.label} <ArrowRight size={15} />
                </button>
              </div>

              {/* Right — A day in the life */}
              <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1.25rem", padding: "1.75rem", boxShadow: "0 4px 16px rgba(15,32,39,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.navy }}>A day in the life of a {role.label}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {role.daily.map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: role.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, fontSize: "0.72rem", color: role.color }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: C.body, lineHeight: 1.65, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "1.5rem", padding: "0.875rem", background: role.bg, borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <role.icon size={16} color={role.color} />
                  <span style={{ fontSize: "0.78rem", color: role.color, fontWeight: 600 }}>Login as {role.label} — credentials: <code style={{ fontFamily: "monospace" }}>hims2026</code></span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* All roles grid */}
      <section style={{ background: C.white, padding: "4rem 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <h2 style={{ fontSize: "1.625rem", fontWeight: 900, color: C.navy, textAlign: "center", marginBottom: "2rem", letterSpacing: "-0.02em" }}>All {ROLES.length} roles, one system</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {ROLES.map((r, i) => (
              <motion.div key={r.label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(i)}
                style={{ background: selected === i ? r.bg : C.bg, border: `1.5px solid ${selected === i ? r.color + "50" : C.border}`, borderRadius: "0.875rem", padding: "1.125rem", cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: "0.75rem" }}
                whileHover={{ borderColor: r.color + "60", background: r.bg } as any}>
                <div style={{ width: 36, height: 36, borderRadius: "0.5rem", background: selected === i ? r.bg : C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <r.icon size={18} color={r.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.82rem", color: C.navy }}>{r.label}</div>
                  <div style={{ fontSize: "0.7rem", color: C.muted }}>{r.tagline.split(",")[0]}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.bg, padding: "4rem 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: `linear-gradient(135deg, ${C.teal}, #0f766e)`, borderRadius: "1.5rem", padding: "3.5rem 2rem", boxShadow: "0 16px 48px rgba(13,148,136,0.28)" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem" }}>Onboard your entire team today</h2>
            <p style={{ color: "rgba(255,255,255,0.82)", marginBottom: "1.75rem", lineHeight: 1.7 }}>
              Create accounts for every role in minutes. Each staff member logs in to a workspace built exactly for their workflow.
            </p>
            <button onClick={() => setLocation("/login")}
              style={{ background: "#fff", color: C.teal, fontWeight: 800, fontSize: "0.9rem", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "none", cursor: "pointer" }}>
              Start Team Demo
            </button>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media(max-width:768px) { .teams-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <MarketingFooter />
    </div>
  );
}
