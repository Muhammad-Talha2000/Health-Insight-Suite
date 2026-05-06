import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/marketing-nav";
import {
  Check, X, ArrowRight, Zap, Building2, Users,
  BarChart3, Shield, Clock, CheckCircle, Star, ChevronDown
} from "lucide-react";

const C = { teal: "#0d9488", tealLight: "#ccfbf1", navy: "#0f2027", body: "#4b5563", muted: "#9ca3af", border: "#e2e8f0", white: "#ffffff", mint: "#f0fdf9", bg: "#f8fafc" };

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    price: { monthly: 99, annual: 79 },
    desc: "Perfect for small clinics and single-specialty practices getting started with digital health records.",
    highlight: false,
    badge: null,
    color: "#3b82f6", bg: "#eff6ff",
    features: [
      { label: "Up to 3 doctor accounts", included: true },
      { label: "Patient Registry (EMR)",  included: true },
      { label: "OPD Queue Management",    included: true },
      { label: "Basic Billing & Invoicing",included: true },
      { label: "Lab Orders (view only)",  included: true },
      { label: "Analytics Dashboard",     included: true },
      { label: "IPD / Bed Management",    included: false },
      { label: "Emergency Triage Module", included: false },
      { label: "Pharmacy Inventory",      included: false },
      { label: "Multi-branch Support",    included: false },
      { label: "Priority Support",        included: false },
      { label: "API Access",              included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: Users,
    price: { monthly: 299, annual: 239 },
    desc: "The complete hospital operating system. All 10 modules, unlimited users, and real-time collaboration.",
    highlight: true,
    badge: "Most Popular",
    color: C.teal, bg: C.mint,
    features: [
      { label: "Unlimited doctor & staff accounts", included: true },
      { label: "Patient Registry (EMR)",     included: true },
      { label: "OPD Queue Management",       included: true },
      { label: "Advanced Billing & Payments",included: true },
      { label: "Laboratory Module (full)",   included: true },
      { label: "Analytics & Revenue Charts", included: true },
      { label: "IPD / Bed Management",       included: true },
      { label: "Emergency Triage Module",    included: true },
      { label: "Pharmacy Inventory",         included: true },
      { label: "Multi-branch Support",       included: true },
      { label: "Priority Support (24h SLA)", included: true },
      { label: "API & Webhook Access",       included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    price: { monthly: null, annual: null },
    desc: "For hospital groups, government health networks, and multi-facility organizations needing custom SLAs.",
    highlight: false,
    badge: null,
    color: "#7c3aed", bg: "#f5f3ff",
    features: [
      { label: "Everything in Professional",         included: true },
      { label: "Dedicated infrastructure",           included: true },
      { label: "Custom module development",          included: true },
      { label: "On-premise deployment option",       included: true },
      { label: "HIPAA & local compliance audits",    included: true },
      { label: "Dedicated account manager",          included: true },
      { label: "Staff training & onboarding",        included: true },
      { label: "99.9% uptime SLA",                   included: true },
      { label: "White-label (your branding)",        included: true },
      { label: "HL7 / FHIR custom integration",      included: true },
      { label: "Same-day critical support",          included: true },
      { label: "Custom reporting & BI",              included: true },
    ],
  },
];

const ALL_PLANS_INCLUDE = [
  { icon: Shield,    text: "256-bit SSL encryption on all data" },
  { icon: BarChart3, text: "Daily automated database backups" },
  { icon: Clock,     text: "99.5% uptime guarantee" },
  { icon: Users,     text: "Unlimited patient records" },
  { icon: CheckCircle, text: "Free onboarding & data migration" },
  { icon: Star,      text: "Regular feature updates — no extra cost" },
];

const FAQS = [
  { q: "Can I switch plans later?", a: "Yes — upgrade or downgrade at any time. When upgrading, the new modules are available immediately. Downgrading takes effect at the next billing cycle." },
  { q: "Is there a long-term contract?", a: "No lock-in. Monthly plans can be cancelled anytime. Annual plans are paid upfront and are non-refundable after the first 14 days." },
  { q: "What counts as a 'user'?", a: "Any staff member with login access — doctor, nurse, pharmacist, admin, finance, or lab technician. Patients do not count as users." },
  { q: "Do you offer a free trial?", a: "Yes — use our live demo environment (no sign-up required) to explore all Professional features with real seeded data. We also offer a 14-day full-access pilot for new hospitals." },
  { q: "Can I add extra modules à la carte?", a: "Starter plan users can add individual modules (IPD, Pharmacy, Emergency) for PKR 2,500/module/month. Professional includes everything." },
  { q: "What kind of support is included?", a: "Starter: email support (48h SLA). Professional: priority email + chat (24h SLA). Enterprise: dedicated account manager + same-day critical support." },
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.white, color: C.navy, minHeight: "100vh" }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ paddingTop: 96, background: `linear-gradient(135deg, #dff7f2 0%, ${C.mint} 60%, ${C.white} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(13,148,136,0.08)" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "4rem 1.5rem 3.5rem", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: C.tealLight, color: C.teal, fontSize: "0.75rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: 99, marginBottom: "1.25rem" }}>
              <Star size={12} /> Transparent Pricing
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.25rem)", fontWeight: 900, color: C.navy, lineHeight: 1.12, marginBottom: "1rem", letterSpacing: "-0.025em" }}>
              Flexible pricing for<br />
              <span style={{ color: C.teal }}>practices &amp; hospitals</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: C.body, lineHeight: 1.75, maxWidth: 480, margin: "0 auto 2rem" }}>
              From a single-doctor clinic to a 500-bed government hospital — pick the plan that fits your scale.
            </p>

            {/* Toggle */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.875rem", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 99, padding: "0.375rem" }}>
              <button onClick={() => setAnnual(false)}
                style={{ padding: "0.45rem 1.125rem", borderRadius: 99, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, background: !annual ? C.white : "transparent", color: !annual ? C.navy : C.muted, boxShadow: !annual ? "0 1px 4px rgba(15,32,39,0.08)" : "none", transition: "all 0.18s" }}>
                Monthly
              </button>
              <button onClick={() => setAnnual(true)}
                style={{ padding: "0.45rem 1.125rem", borderRadius: 99, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, background: annual ? C.white : "transparent", color: annual ? C.navy : C.muted, boxShadow: annual ? "0 1px 4px rgba(15,32,39,0.08)" : "none", transition: "all 0.18s", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                Annual
                <span style={{ fontSize: "0.65rem", fontWeight: 800, background: "#ecfdf5", color: "#059669", padding: "0.15rem 0.4rem", borderRadius: 99 }}>Save 20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing cards */}
      <section style={{ background: C.bg, padding: "3rem 0 5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
            {PLANS.map((plan, i) => (
              <motion.div key={plan.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{
                  background: plan.highlight ? C.navy : C.white,
                  border: `2px solid ${plan.highlight ? C.teal : C.border}`,
                  borderRadius: "1.375rem", padding: "2rem",
                  boxShadow: plan.highlight ? "0 20px 60px rgba(15,32,39,0.2)" : "0 2px 8px rgba(15,32,39,0.06)",
                  position: "relative",
                }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.teal, color: "#fff", fontSize: "0.72rem", fontWeight: 800, padding: "0.3rem 1rem", borderRadius: 99, whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "0.75rem", background: plan.highlight ? "rgba(255,255,255,0.1)" : plan.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <plan.icon size={20} color={plan.highlight ? "#fff" : plan.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: plan.highlight ? "#fff" : C.navy }}>{plan.name}</div>
                    <div style={{ fontSize: "0.72rem", color: plan.highlight ? "rgba(255,255,255,0.6)" : C.muted }}>
                      {plan.id === "starter" ? "Up to 3 doctors" : plan.id === "professional" ? "Unlimited users" : "Custom scale"}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "1.25rem" }}>
                  {plan.price.monthly ? (
                    <>
                      <span style={{ fontSize: "2.75rem", fontWeight: 900, color: plan.highlight ? "#fff" : C.navy, lineHeight: 1 }}>
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span style={{ fontSize: "0.9rem", color: plan.highlight ? "rgba(255,255,255,0.6)" : C.muted, marginLeft: "0.25rem" }}>/mo per facility</span>
                      {annual && <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: "0.25rem", fontWeight: 700 }}>Billed annually — you save ${(plan.price.monthly! - plan.price.annual!) * 12}/yr</div>}
                    </>
                  ) : (
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: plan.highlight ? "#fff" : C.navy }}>Custom</div>
                  )}
                </div>

                <p style={{ fontSize: "0.85rem", color: plan.highlight ? "rgba(255,255,255,0.72)" : C.body, lineHeight: 1.7, marginBottom: "1.5rem" }}>{plan.desc}</p>

                {/* CTA */}
                <button onClick={() => setLocation("/login")}
                  style={{
                    width: "100%", padding: "0.875rem", borderRadius: "0.75rem", border: "none", cursor: "pointer",
                    fontWeight: 700, fontSize: "0.9rem", marginBottom: "1.5rem",
                    background: plan.highlight ? C.teal : plan.color + "15",
                    color: plan.highlight ? "#fff" : plan.color,
                    boxShadow: plan.highlight ? "0 4px 14px rgba(13,148,136,0.4)" : "none",
                  }}>
                  {plan.id === "enterprise" ? "Contact Sales" : "Start Free Trial"}
                </button>

                {/* Features list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {plan.features.map(f => (
                    <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.82rem" }}>
                      {f.included
                        ? <Check size={14} color={plan.highlight ? "#34d399" : plan.color} style={{ flexShrink: 0, marginTop: 2 }} />
                        : <X size={14} color={plan.highlight ? "rgba(255,255,255,0.25)" : "#d1d5db"} style={{ flexShrink: 0, marginTop: 2 }} />}
                      <span style={{ color: f.included ? (plan.highlight ? "#fff" : C.navy) : (plan.highlight ? "rgba(255,255,255,0.35)" : C.muted) }}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All plans include */}
      <section style={{ background: C.white, padding: "4rem 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem" }}>
          <h2 style={{ fontSize: "1.625rem", fontWeight: 900, color: C.navy, textAlign: "center", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>All plans include</h2>
          <p style={{ color: C.body, textAlign: "center", marginBottom: "2.5rem" }}>No hidden fees. These come with every tier.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {ALL_PLANS_INCLUDE.map((item, i) => (
              <motion.div key={item.text}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                style={{ display: "flex", alignItems: "center", gap: "0.875rem", background: C.bg, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1rem 1.25rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "0.5rem", background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={17} color={C.teal} />
                </div>
                <span style={{ fontSize: "0.85rem", color: C.navy, fontWeight: 500 }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: C.bg, padding: "4rem 0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 1.5rem" }}>
          <h2 style={{ fontSize: "1.625rem", fontWeight: 900, color: C.navy, textAlign: "center", marginBottom: "2.5rem", letterSpacing: "-0.02em" }}>Frequently asked questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: C.white, border: `1.5px solid ${openFaq === i ? C.teal + "40" : C.border}`, borderRadius: "0.875rem", overflow: "hidden", transition: "border-color 0.2s" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.25rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: C.navy }}>{faq.q}</span>
                  <ChevronDown size={16} color={C.muted} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: "1rem" }} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    style={{ padding: "0 1.25rem 1.125rem", fontSize: "0.875rem", color: C.body, lineHeight: 1.75 }}>
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: C.white, padding: "4rem 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: `linear-gradient(135deg, ${C.teal}, #0f766e)`, borderRadius: "1.5rem", padding: "3.5rem 2rem", boxShadow: "0 16px 48px rgba(13,148,136,0.28)" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem" }}>Start with a free demo</h2>
            <p style={{ color: "rgba(255,255,255,0.82)", marginBottom: "1.75rem", lineHeight: 1.7 }}>
              No credit card. No setup. Login as any role and explore every module with live hospital data — right now.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setLocation("/login")}
                style={{ background: "#fff", color: C.teal, fontWeight: 800, fontSize: "0.9rem", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "none", cursor: "pointer" }}>
                Launch Demo Now
              </button>
              <button onClick={() => setLocation("/login")}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "0.875rem 2rem", borderRadius: "0.75rem", border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer" }}>
                Talk to Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
