import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import {
  CheckCircle, Clock, ArrowRight, Plug, MessageSquare,
  CreditCard, BarChart3, MapPin, Bell, Cloud, FlaskConical,
  FileText, Database, Wifi, Shield
} from "lucide-react";

const C = { teal: "#0d9488", tealLight: "#ccfbf1", navy: "#0f2027", body: "#4b5563", muted: "#9ca3af", border: "#e2e8f0", white: "#ffffff", mint: "#f0fdf9", bg: "#f8fafc" };

const CATEGORIES = ["All", "Lab Systems", "Payments", "Messaging", "EHR / EMR", "Accounting", "Infrastructure"];

const INTEGRATIONS = [
  { name: "HL7 / FHIR", category: "EHR / EMR",      icon: FileText,     color: "#3b82f6", bg: "#eff6ff",  status: "live",        desc: "Industry-standard health data exchange & interoperability" },
  { name: "OpenMRS",     category: "EHR / EMR",      icon: Database,     color: "#7c3aed", bg: "#f5f3ff",  status: "live",        desc: "Open-source medical records system integration" },
  { name: "PathCare Labs",category: "Lab Systems",   icon: FlaskConical, color: C.teal,   bg: C.mint,     status: "live",        desc: "Direct lab order transmission and result retrieval" },
  { name: "Lancet Labs", category: "Lab Systems",    icon: FlaskConical, color: "#059669", bg: "#ecfdf5",  status: "live",        desc: "Automated lab results with critical value flagging" },
  { name: "Stripe",      category: "Payments",       icon: CreditCard,   color: "#6366f1", bg: "#eef2ff",  status: "live",        desc: "Card processing, subscriptions & invoice payments" },
  { name: "PayFast",     category: "Payments",       icon: CreditCard,   color: "#f59e0b", bg: "#fffbeb",  status: "live",        desc: "Local payment gateway for clinics & hospitals" },
  { name: "WhatsApp Business", category: "Messaging",icon: MessageSquare,color: "#16a34a", bg: "#f0fdf4",  status: "live",        desc: "Appointment reminders & patient notifications via WhatsApp" },
  { name: "Twilio SMS",  category: "Messaging",      icon: Bell,         color: "#dc2626", bg: "#fef2f2",  status: "live",        desc: "Bulk SMS for lab results, reminders and alerts" },
  { name: "Xero",        category: "Accounting",     icon: BarChart3,    color: "#0891b2", bg: "#ecfeff",  status: "live",        desc: "Sync invoices, payments and financial reports to Xero" },
  { name: "QuickBooks",  category: "Accounting",     icon: BarChart3,    color: "#ea580c", bg: "#fff7ed",  status: "coming-soon", desc: "Two-way sync of revenue data and expense tracking" },
  { name: "Google Maps", category: "Infrastructure", icon: MapPin,       color: "#dc2626", bg: "#fef2f2",  status: "live",        desc: "Geo-location for branch selection and patient routing" },
  { name: "AWS / Azure", category: "Infrastructure", icon: Cloud,        color: "#3b82f6", bg: "#eff6ff",  status: "live",        desc: "Cloud backup, disaster recovery and HIPAA storage" },
  { name: "Nexion",      category: "Accounting",     icon: BarChart3,    color: "#7c3aed", bg: "#f5f3ff",  status: "coming-soon", desc: "Debit orders and cash-flow management for practices" },
  { name: "PACS / DICOM",category: "Lab Systems",    icon: FlaskConical, color: "#ca8a04", bg: "#fefce8",  status: "coming-soon", desc: "Medical imaging integration for radiology workflows" },
  { name: "Cloudflare",  category: "Infrastructure", icon: Shield,       color: "#f97316", bg: "#fff7ed",  status: "live",        desc: "DDoS protection, WAF and zero-trust access control" },
  { name: "REST / Webhooks", category: "Infrastructure", icon: Wifi,     color: "#0d9488", bg: C.mint,     status: "live",        desc: "Open API for custom third-party integrations" },
];

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  "live":        { label: "Live",         color: "#059669", bg: "#ecfdf5" },
  "coming-soon": { label: "Coming Soon",  color: "#d97706", bg: "#fffbeb" },
  "in-progress": { label: "In Progress",  color: "#2563eb", bg: "#eff6ff" },
};

export default function Integrations() {
  const [, setLocation] = useLocation();
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? INTEGRATIONS : INTEGRATIONS.filter(i => i.category === active);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.white, color: C.navy, minHeight: "100vh" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: 96, paddingBottom: 64, background: `linear-gradient(135deg, ${C.mint} 0%, #e0f5f0 60%, ${C.white} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(13,148,136,0.07)" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 1.5rem 2rem", textAlign: "center" }}>
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: C.tealLight, color: C.teal, fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: 99, marginBottom: "1.25rem" }}>
            <Plug size={12} /> Plug-and-Play Ecosystem
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: C.navy, marginBottom: "1rem", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
            Connect Pulse Healthcare to the tools<br />
            <span style={{ color: C.teal }}>your hospital already uses</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            style={{ fontSize: "1.05rem", color: C.body, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 2rem" }}>
            Pre-built connectors for lab networks, payment gateways, messaging platforms, accounting systems, and cloud infrastructure — all configurable in minutes.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.25rem" }}>
            {["16 integrations", "Zero code required", "REST API open access"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", color: C.body }}>
                <CheckCircle size={14} color={C.teal} /> {t}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter tabs */}
      <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 64, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", display: "flex", gap: "0.25rem", overflowX: "auto", paddingBottom: 1 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              style={{
                padding: "0.875rem 1.125rem", background: "none", border: "none", cursor: "pointer",
                fontSize: "0.85rem", fontWeight: active === cat ? 700 : 500, whiteSpace: "nowrap",
                color: active === cat ? C.teal : C.body,
                borderBottom: active === cat ? `2px solid ${C.teal}` : "2px solid transparent",
                transition: "color 0.15s",
              }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "3.5rem 0", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {filtered.map((item, i) => (
              <motion.div key={item.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)", transition: "box-shadow 0.2s, transform 0.2s" }}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(15,32,39,0.09)" } as any}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "0.75rem", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <item.icon size={22} color={item.color} />
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: STATUS[item.status].color, background: STATUS[item.status].bg, padding: "0.25rem 0.625rem", borderRadius: 99 }}>
                    {STATUS[item.status].label}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: C.navy, marginBottom: "0.375rem" }}>{item.name}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: C.teal, marginBottom: "0.5rem" }}>{item.category}</div>
                <div style={{ fontSize: "0.82rem", color: C.body, lineHeight: 1.65 }}>{item.desc}</div>
                {item.status === "live" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "1rem", fontSize: "0.78rem", fontWeight: 600, color: C.teal, cursor: "pointer" }}
                    onClick={() => setLocation("/login")}>
                    Connect now <ArrowRight size={13} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.white, padding: "4rem 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 1.5rem" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: `linear-gradient(135deg, ${C.teal} 0%, #0f766e 100%)`, borderRadius: "1.5rem", padding: "3.5rem 2rem", textAlign: "center", boxShadow: "0 16px 48px rgba(13,148,136,0.28)" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem" }}>Need a custom integration?</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "1.75rem", lineHeight: 1.7 }}>
              Our REST API and webhook system lets you connect Pulse Healthcare to any system your hospital uses — with zero code required for common workflows.
            </p>
            <button onClick={() => setLocation("/login")}
              style={{ background: "#fff", color: C.teal, fontWeight: 800, fontSize: "0.9rem", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
              Request an Integration
            </button>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
