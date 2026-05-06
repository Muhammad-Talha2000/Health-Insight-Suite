import { useRef, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Activity, ArrowRight, Bed, BriefcaseMedical, Check, ChevronRight,
  FlaskConical, LayoutDashboard, Menu, Pill, Receipt, Shield, Stethoscope,
  Users, Zap, X, Star, Globe, TrendingUp, Clock, Heart, Lock,
  BarChart3, Cpu, Layers, Play, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
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
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white tabular-nums">
        {count.toLocaleString()}<span className="text-primary">{suffix}</span>
      </div>
      <div className="text-sm text-white/50 mt-1 font-medium">{label}</div>
    </div>
  );
}

const MODULES = [
  { icon: Users, label: "Patient Registry", desc: "Complete EMR with MR#, history, allergies & chronic conditions", color: "from-blue-500/20 to-blue-500/5", accent: "text-blue-400", border: "border-blue-500/20" },
  { icon: Stethoscope, label: "OPD Queue", desc: "Real-time Kanban queue with token numbers & status tracking", color: "from-cyan-500/20 to-cyan-500/5", accent: "text-cyan-400", border: "border-cyan-500/20" },
  { icon: Bed, label: "IPD / Bed Management", desc: "Visual bed grid across 5 wards with instant occupancy stats", color: "from-purple-500/20 to-purple-500/5", accent: "text-purple-400", border: "border-purple-500/20" },
  { icon: Zap, label: "Emergency Triage", desc: "Manchester 5-level triage with vitals, colour-coded priority", color: "from-red-500/20 to-red-500/5", accent: "text-red-400", border: "border-red-500/20" },
  { icon: Pill, label: "Pharmacy", desc: "Medication inventory, stock alerts & prescription management", color: "from-emerald-500/20 to-emerald-500/5", accent: "text-emerald-400", border: "border-emerald-500/20" },
  { icon: FlaskConical, label: "Laboratory", desc: "Lab orders with STAT/Urgent priority & critical result flags", color: "from-yellow-500/20 to-yellow-500/5", accent: "text-yellow-400", border: "border-yellow-500/20" },
  { icon: Receipt, label: "Billing & Payments", desc: "Itemised invoicing, discount, tax & one-click payment marking", color: "from-orange-500/20 to-orange-500/5", accent: "text-orange-400", border: "border-orange-500/20" },
  { icon: BarChart3, label: "Analytics Dashboard", desc: "30-day revenue trends, ward occupancy & department KPIs", color: "from-pink-500/20 to-pink-500/5", accent: "text-pink-400", border: "border-pink-500/20" },
];

const FEATURES = [
  { icon: Clock, title: "Real-Time Operations", desc: "Live auto-refreshing queues, emergency boards, and dashboards so your staff always sees the current state — no page reloads.", color: "text-cyan-400 bg-cyan-400/10" },
  { icon: Shield, title: "Role-Based Access", desc: "Admin, Doctor, Nurse, and Pharmacist roles with dedicated workflows. Each user sees exactly what they need.", color: "text-purple-400 bg-purple-400/10" },
  { icon: Cpu, title: "Integrated Modules", desc: "One unified platform — from admission to discharge to billing. No fragmented tools, no data silos.", color: "text-emerald-400 bg-emerald-400/10" },
  { icon: TrendingUp, title: "Financial Clarity", desc: "Revenue charts, invoice tracking, and pending/overdue management give finance teams instant visibility.", color: "text-orange-400 bg-orange-400/10" },
];

const STEPS = [
  { n: "01", title: "Register Patients", desc: "Create a patient record with MR number, demographics, allergies, and emergency contacts in seconds." },
  { n: "02", title: "Manage Care Journey", desc: "From OPD appointment → IPD admission → lab orders → prescriptions → emergency — all in one place." },
  { n: "03", title: "Collect & Analyse", desc: "Generate itemised invoices, mark payments, and review 30-day revenue & occupancy trends on the analytics dashboard." },
];

const TESTIMONIALS = [
  { quote: "MediCore HIMS cut our patient wait times by 40%. The OPD queue and emergency triage views are exactly what a busy hospital needs.", name: "Dr. Ayesha Rahman", role: "Medical Director, Shifa Hospital" },
  { quote: "The bed management grid lets our nursing staff see every ward at a glance. Discharge planning has never been smoother.", name: "Muhammad Ali Khan", role: "Head of Operations, Aga Khan Health" },
  { quote: "Our billing team processes 3× more invoices per day. The workflow is clean and the analytics save us hours every week.", name: "Sana Mirza", role: "CFO, South City Hospital" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((a) => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const goLogin = () => setLocation("/login");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="font-bold text-lg text-foreground">MediCore <span className="text-primary">HIMS</span></span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#modules" className="hover:text-foreground transition-colors">Modules</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={goLogin} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Sign In
            </button>
            <button onClick={goLogin}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              Get Demo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="md:hidden border-t border-white/5 bg-background/95 px-4 py-4 flex flex-col gap-3">
              {["Modules", "Features", "How It Works", "Testimonials"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, "")}`} onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground py-2">{l}</a>
              ))}
              <button onClick={goLogin} className="mt-2 w-full py-2.5 rounded-lg bg-primary text-black font-semibold text-sm">
                Sign In / Get Demo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(hsl(196 100% 47%) 1px, transparent 1px), linear-gradient(90deg, hsl(196 100% 47%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

            {/* Left — Copy */}
            <div>
              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Built for 2026 · Hospital-Grade
              </motion.div>

              {/* Headline */}
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
                The Operating<br />System for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Modern Hospitals</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                MediCore HIMS unifies patient records, OPD queues, IPD beds, emergency triage, pharmacy, lab, billing, and analytics — in one seamless dark-mode platform your staff will love.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3 mb-10">
                <button onClick={goLogin}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-primary/25">
                  <Play className="w-4 h-4 fill-black" /> Start Demo — Free
                </button>
                <button onClick={goLogin}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all hover:scale-105 active:scale-100 backdrop-blur-sm">
                  <Users className="w-4 h-4" /> Request a Tour
                </button>
              </motion.div>

              {/* Trust signals */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {["No credit card", "HIPAA-ready", "Multi-role access", "Real-time data"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    {t}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Dashboard preview card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl scale-95" />

              {/* Card */}
              <div className="relative rounded-2xl border border-white/10 bg-card overflow-hidden shadow-2xl shadow-black/50">
                {/* Fake title bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-muted/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="flex-1 mx-3 h-5 rounded bg-muted/50 text-[10px] text-muted-foreground flex items-center px-2 font-mono">
                    medicore.hospital/dashboard
                  </div>
                </div>

                {/* Dashboard mini preview */}
                <div className="p-4 space-y-3">
                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Patients", value: "8,412", color: "text-blue-400" },
                      { label: "OPD Today", value: "247", color: "text-cyan-400" },
                      { label: "Beds", value: "87%", color: "text-purple-400" },
                      { label: "Emergency", value: "7", color: "text-red-400" },
                    ].map((s) => (
                      <div key={s.label} className="bg-muted/50 rounded-xl p-2.5 border border-white/5">
                        <div className={cn("text-sm font-bold", s.color)}>{s.value}</div>
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue chart placeholder */}
                  <div className="bg-muted/30 rounded-xl border border-white/5 p-3">
                    <div className="text-[10px] text-muted-foreground mb-2">Revenue — Last 30 Days</div>
                    <div className="flex items-end gap-1 h-14">
                      {[30, 55, 40, 70, 60, 85, 45, 90, 75, 80, 95, 70, 88, 65, 78, 92, 50, 73, 84, 68, 95, 77, 82, 90, 72, 86, 78, 92, 88, 96].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm"
                          style={{ height: `${h}%`, background: i > 22 ? "hsl(196 100% 47%)" : "hsl(196 100% 47% / 0.3)" }} />
                      ))}
                    </div>
                  </div>

                  {/* Activity feed */}
                  <div className="space-y-2">
                    {[
                      { dot: "bg-red-500", text: "Emergency: Chest pain — Immediate triage", time: "2m ago" },
                      { dot: "bg-emerald-500", text: "Lab result ready: HbA1c — Ahmad Hassan", time: "8m ago" },
                      { dot: "bg-blue-500", text: "Bed B-04 discharged — ICU", time: "15m ago" },
                    ].map((a, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", a.dot, a.dot === "bg-red-500" ? "animate-pulse" : "")} />
                        <p className="text-[10px] text-muted-foreground flex-1">{a.text}</p>
                        <span className="text-[9px] text-muted-foreground/50 whitespace-nowrap">{a.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Triage strip */}
                <div className="flex border-t border-white/5">
                  {[
                    { label: "Immediate", count: 1, color: "bg-red-600" },
                    { label: "Very Urgent", count: 2, color: "bg-orange-500" },
                    { label: "Urgent", count: 3, color: "bg-yellow-400" },
                    { label: "Semi", count: 0, color: "bg-green-500" },
                    { label: "Non-Urgent", count: 1, color: "bg-blue-500" },
                  ].map((t) => (
                    <div key={t.label} className={cn("flex-1 py-2 text-center border-r border-white/5 last:border-0", t.color + "/10")}>
                      <div className={cn("text-sm font-bold", t.color === "bg-yellow-400" ? "text-yellow-400" : t.color.replace("bg-", "text-"))}>{t.count}</div>
                      <div className="text-[8px] text-muted-foreground leading-tight">{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                Live Data
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-card border border-white/10 text-[10px] text-muted-foreground px-3 py-2 rounded-xl shadow-xl">
                <span className="text-primary font-bold">↑ 23%</span> revenue this week
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-white/5 bg-muted/20 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <CountStat value={8412} suffix="+" label="Patient Records" />
            <CountStat value={32} suffix="" label="Beds Managed" />
            <CountStat value={170} suffix="+" label="Invoices Processed" />
            <CountStat value={10} suffix="" label="Integrated Modules" />
          </div>
        </div>
      </section>

      {/* ─── MODULES ─── */}
      <section id="modules" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-4">
              <Layers className="w-3 h-3" /> Everything in One Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Every module your hospital needs,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">perfectly integrated</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From first consultation to final invoice — all 10 modules share a single patient record with zero data duplication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODULES.map((m, i) => (
              <motion.div key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "relative group rounded-2xl border p-5 bg-gradient-to-b hover:scale-[1.02] transition-transform cursor-pointer",
                  m.border, m.color
                )}
                onClick={goLogin}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-black/20", m.accent)}>
                  <m.icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-white mb-1">{m.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{m.desc}</div>
                <ChevronRight className={cn("absolute bottom-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", m.accent)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-semibold mb-4">
                <Star className="w-3 h-3" /> Why MediCore
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Built for the way hospitals<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary">actually work</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We spoke to nurses, doctors, and administrators at 50+ hospitals before writing a single line of code. The result is software that fits your workflow — not the other way around.
              </p>
              <button onClick={goLogin}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                See the full platform <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-card hover:border-white/10 transition-colors">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", f.color)}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white mb-1">{f.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="howitworks" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-4">
              <Globe className="w-3 h-3" /> How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              From patient in to patient out —<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">every step covered</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((s, i) => (
                <motion.div key={s.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                    <span className="text-primary font-black text-sm">{s.n}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 bg-muted/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-xs font-semibold mb-4">
              <Star className="w-3 h-3 fill-yellow-400" /> Trusted by Leading Hospitals
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Loved by the teams<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-primary">who matter most</span>
            </h2>
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-white/8 rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <blockquote className="text-lg text-white font-medium leading-relaxed mb-6">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </blockquote>
                <div>
                  <div className="font-bold text-sm text-white">{TESTIMONIALS[activeTestimonial].name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{TESTIMONIALS[activeTestimonial].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={cn("w-2 h-2 rounded-full transition-all", i === activeTestimonial ? "bg-primary w-5" : "bg-muted")} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent p-12 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-primary/15 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                <Activity className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to transform<br />your hospital operations?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Sign in with a demo account — no setup required. Explore every module with live seeded data in under 2 minutes.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={goLogin}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-primary/30">
                  <Play className="w-4 h-4 fill-black" /> Launch Demo Now
                </button>
                <button onClick={goLogin}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all hover:scale-105 active:scale-100">
                  <BriefcaseMedical className="w-4 h-4" /> Request Enterprise Plan
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-muted-foreground">
                {["Free demo access", "No credit card", "HIPAA-ready infrastructure", "Dedicated onboarding"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-primary" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-bold text-foreground">MediCore <span className="text-primary">HIMS</span></span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MediCore HIMS. All rights reserved. Built for modern healthcare.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <button onClick={goLogin} className="hover:text-foreground transition-colors">Sign In</button>
            <a href="#modules" className="hover:text-foreground transition-colors">Modules</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
