import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import {
  Building2, Stethoscope, Zap, FlaskConical, Pill, Heart,
  Check, ArrowRight, CheckCircle
} from "lucide-react";

const C = { teal: "#0d9488", tealLight: "#ccfbf1", navy: "#0f2027", body: "#4b5563", muted: "#9ca3af", border: "#e2e8f0", white: "#ffffff", mint: "#f0fdf9", bg: "#f8fafc" };

const FACILITIES = [
  {
    icon: Building2, color: "#3b82f6", bg: "#eff6ff",
    label: "Government Hospitals",
    tagline: "Scale across entire districts",
    desc: "Built to handle thousands of daily patients across multiple departments. MediCore's centralized records, multi-ward IPD management, and real-time dashboards keep large government hospitals running at full efficiency.",
    features: ["Unlimited patient throughput", "Multi-ward IPD management", "District-level reporting", "Audit-ready records", "Role-based staff access"],
  },
  {
    icon: Stethoscope, color: C.teal, bg: C.mint,
    label: "Private Hospitals & Clinics",
    tagline: "Premium care, zero paperwork",
    desc: "Elevate the patient experience with streamlined OPD queues, instant lab results, and beautiful billing. Perfect for single or multi-branch private facilities that want to stand out.",
    features: ["Branded patient portal", "Online appointment booking", "Multi-branch support", "Automated invoicing", "Insurance claims tracking"],
  },
  {
    icon: Zap, color: "#dc2626", bg: "#fef2f2",
    label: "Emergency & Trauma Centers",
    tagline: "Every second counts",
    desc: "Manchester 5-level triage with real-time vital tracking, colour-coded priority queues, and instant bed assignments ensure your emergency team always has the information they need to save lives.",
    features: ["Manchester triage protocol", "Real-time vitals board", "Instant bed assignment", "Critical alert system", "Ambulance dispatch integration"],
  },
  {
    icon: FlaskConical, color: "#ca8a04", bg: "#fefce8",
    label: "Diagnostic Laboratories",
    tagline: "Results delivered in seconds",
    desc: "Receive lab orders from connected hospitals, mark STAT/Urgent priority, flag critical values, and push results back to the requesting clinician — all without picking up the phone.",
    features: ["Digital order receipt", "STAT / Urgent prioritization", "Critical value auto-alerts", "Result push to clinicians", "Pathcare & Lancet integration"],
  },
  {
    icon: Pill, color: "#059669", bg: "#ecfdf5",
    label: "Pharmacy Chains",
    tagline: "Never run out of stock",
    desc: "Centralized inventory across all branches, reorder alerts, prescription tracking, and direct integration with in-hospital dispensing — manage everything from a single screen.",
    features: ["Multi-branch inventory", "Automated reorder alerts", "Prescription validation", "Expiry date tracking", "Controlled substance logs"],
  },
  {
    icon: Heart, color: "#db2777", bg: "#fdf2f8",
    label: "Specialty Clinics",
    tagline: "Designed around your specialty",
    desc: "Whether cardiology, oncology, or orthopaedics — MediCore adapts to your workflow. Custom module bundles, specialty-specific clinical notes, and referral management built in.",
    features: ["Custom module bundles", "Specialty clinical notes", "Referral management", "Follow-up scheduling", "Patient outcome tracking"],
  },
];

const COMPARE_FEATURES = ["EMR / Patient Records", "OPD Queue", "IPD Bed Management", "Emergency Triage", "Pharmacy", "Laboratory", "Billing", "Analytics"];
const COMPARE = {
  "Government Hospitals": [true, true, true, true, true, true, true, true],
  "Private Clinics":      [true, true, true, false, true, true, true, true],
  "Emergency Centers":    [true, false, true, true, false, true, false, true],
};

export default function Facilities() {
  const [, setLocation] = useLocation();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.white, color: C.navy, minHeight: "100vh" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: 96, background: `linear-gradient(135deg, #dff7f2 0%, ${C.mint} 50%, #f0fdf9 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(13,148,136,0.08)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem 5rem" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: C.tealLight, color: C.teal, fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: 99, marginBottom: "1.25rem" }}>
              <Building2 size={12} /> For Every Facility Type
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.25rem)", fontWeight: 900, color: C.navy, lineHeight: 1.12, marginBottom: "1.25rem", letterSpacing: "-0.025em", maxWidth: 640 }}>
              One platform.<br />
              <span style={{ color: C.teal }}>Every type of healthcare facility.</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: C.body, lineHeight: 1.75, maxWidth: 520, marginBottom: "2rem" }}>
              MediCore HIMS is purpose-built to serve the full spectrum of healthcare — from 800-bed government hospitals to single-doctor specialty clinics.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <button onClick={() => setLocation("/login")}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: C.teal, color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "0.8rem 1.75rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(13,148,136,0.3)" }}>
                Start Free Demo <ArrowRight size={15} />
              </button>
              <button onClick={() => setLocation("/pricing")}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: C.navy, fontWeight: 600, fontSize: "0.9rem", padding: "0.8rem 1.75rem", borderRadius: "0.75rem", border: `1.5px solid ${C.border}`, cursor: "pointer" }}>
                View Pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Facility cards */}
      <section style={{ background: C.bg, padding: "5rem 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: C.navy, letterSpacing: "-0.02em" }}>
              Choose the configuration that fits
            </h2>
            <p style={{ color: C.body, marginTop: "0.625rem" }}>Each facility type gets a tailored module bundle — activate only what you need.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {FACILITIES.map((f, i) => (
              <motion.div key={f.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1.25rem", padding: "1.75rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)", display: "flex", flexDirection: "column", gap: "1rem" }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(15,32,39,0.1)", borderColor: f.color + "40" } as any}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "0.75rem", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: C.navy, fontSize: "0.95rem" }}>{f.label}</div>
                    <div style={{ fontSize: "0.75rem", color: f.color, fontWeight: 600 }}>{f.tagline}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.84rem", color: C.body, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {f.features.map(feat => (
                    <li key={feat} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: C.body }}>
                      <Check size={13} color={f.color} style={{ flexShrink: 0 }} /> {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setLocation("/login")}
                  style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 700, color: f.color, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Explore this setup <ArrowRight size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Module comparison table */}
      <section style={{ background: C.white, padding: "5rem 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 900, color: C.navy, letterSpacing: "-0.02em" }}>Module availability by facility</h2>
            <p style={{ color: C.body, marginTop: "0.5rem" }}>Every tier includes unlimited records and users — you only pay for active modules.</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.875rem 1rem", color: C.muted, fontWeight: 600, borderBottom: `2px solid ${C.border}` }}>Module</th>
                  {Object.keys(COMPARE).map(k => (
                    <th key={k} style={{ padding: "0.875rem 1rem", color: C.navy, fontWeight: 700, borderBottom: `2px solid ${C.border}`, textAlign: "center", whiteSpace: "nowrap" }}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FEATURES.map((feat, fi) => (
                  <tr key={feat} style={{ background: fi % 2 === 0 ? C.white : C.bg }}>
                    <td style={{ padding: "0.75rem 1rem", color: C.navy, fontWeight: 500, borderBottom: `1px solid ${C.border}` }}>{feat}</td>
                    {Object.values(COMPARE).map((vals, ci) => (
                      <td key={ci} style={{ padding: "0.75rem 1rem", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
                        {vals[fi]
                          ? <CheckCircle size={18} color={C.teal} style={{ margin: "0 auto" }} />
                          : <span style={{ color: "#d1d5db", fontSize: "1rem" }}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.bg, padding: "4rem 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: `linear-gradient(135deg, ${C.teal}, #0f766e)`, borderRadius: "1.5rem", padding: "3.5rem 2rem", boxShadow: "0 16px 48px rgba(13,148,136,0.28)" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem" }}>Not sure which setup fits you?</h2>
            <p style={{ color: "rgba(255,255,255,0.82)", marginBottom: "1.75rem", lineHeight: 1.7 }}>
              Book a 20-minute demo call and we'll walk you through the exact module bundle for your facility type.
            </p>
            <button onClick={() => setLocation("/login")}
              style={{ background: "#fff", color: C.teal, fontWeight: 800, fontSize: "0.9rem", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "none", cursor: "pointer" }}>
              Book a Facility Demo
            </button>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
