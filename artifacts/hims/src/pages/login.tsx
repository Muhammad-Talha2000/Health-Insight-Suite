import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, ArrowLeft, Eye, EyeOff, LogIn, Bed, Stethoscope,
  FlaskConical, CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

const DEMO_CREDS = [
  { username: "admin",      label: "Admin",      color: "#0d9488" },
  { username: "doctor",     label: "Doctor",     color: "#3b82f6" },
  { username: "nurse",      label: "Nurse",      color: "#7c3aed" },
  { username: "pharmacist", label: "Pharmacist", color: "#ea580c" },
];

const C = {
  teal:      "#0d9488",
  tealLight: "#ccfbf1",
  navy:      "#0f2027",
  body:      "#4b5563",
  muted:     "#9ca3af",
  border:    "#e2e8f0",
  mint:      "#e8faf6",
  white:     "#ffffff",
};

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("hims2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(username, password);
    if (!ok) setError("Invalid credentials. Use demo password: hims2026");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', system-ui, sans-serif", background: C.mint }}>

      {/* ── Left panel – mint illustrated side ── */}
      <div style={{
        display: "none",
        width: "52%",
        background: `linear-gradient(150deg, #b2f0e8 0%, #d1faf3 40%, ${C.mint} 100%)`,
        flexDirection: "column",
        padding: "3rem",
        position: "relative",
        overflow: "hidden",
      }} className="login-left">

        {/* Subtle circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(13,148,136,0.1)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(13,148,136,0.08)" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "auto" }}>
          <img src="/logo1.png" alt="Pulse Healthcare HIMS" style={{ height: 42, width: "auto" }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: C.navy, lineHeight: 1 }}>Pulse Healthcare <span style={{ color: C.teal }}>HIMS</span></div>
            <div style={{ fontSize: "0.7rem", color: C.body }}>Hospital Information System</div>
          </div>
        </div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          style={{ marginTop: "auto", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, color: C.navy, lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Next-Generation<br />
            <span style={{ color: C.teal }}>Hospital Management</span><br />
            for 2026
          </h1>
          <p style={{ color: C.body, lineHeight: 1.7, fontSize: "1rem", maxWidth: "380px" }}>
            Integrated patient care, real-time analytics, and seamless workflows — built for the modern healthcare environment.
          </p>
        </motion.div>

        {/* Stat mini-cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "2rem" }}>
          {[
            { icon: Stethoscope, label: "Patient Records", value: "8,400+", color: "#3b82f6", bg: "#eff6ff" },
            { icon: Activity,    label: "Daily OPD",       value: "240+",   color: C.teal, bg: C.tealLight },
            { icon: Bed,         label: "Bed Occupancy",   value: "87%",    color: "#7c3aed", bg: "#f5f3ff" },
            { icon: FlaskConical, label: "Modules",        value: "10",     color: "#ea580c", bg: "#fff7ed" },
          ].map((s) => (
            <div key={s.label} style={{ background: C.white, borderRadius: "0.875rem", padding: "1rem", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(15,32,39,0.06)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "0.5rem", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                <s.icon size={16} color={s.color} />
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.25rem", color: C.navy }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: C.muted }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem" }}>
          {["HIPAA-Ready", "Real-Time Data", "Role-Based Access", "10 Modules"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: C.body }}>
              <CheckCircle size={13} color={C.teal} /> {t}
            </div>
          ))}
        </div>

        <p style={{ color: C.muted, fontSize: "0.7rem", marginTop: "2rem" }}>© 2026 Pulse Healthcare HIMS. All rights reserved.</p>
      </div>

      {/* ── Right panel – form ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: C.white }}>
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ width: "100%", maxWidth: "420px" }}>

          {/* Back link */}
          <button onClick={() => setLocation("/")}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: C.body, background: "none", border: "none", cursor: "pointer", marginBottom: "2.5rem", padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
            onMouseLeave={e => (e.currentTarget.style.color = C.body)}>
            <ArrowLeft size={14} /> Back to home
          </button>

          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "2rem" }} className="login-mobile-logo">
            <img src="/logo1.png" alt="Pulse Healthcare HIMS" style={{ height: 34, width: "auto" }} />
            <span style={{ fontWeight: 800, color: C.navy }}>Pulse Healthcare <span style={{ color: C.teal }}>HIMS</span></span>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: C.navy, marginBottom: "0.375rem", letterSpacing: "-0.02em" }}>Welcome back</h2>
            <p style={{ color: C.body, fontSize: "0.9rem" }}>Sign in to your account to continue</p>
          </div>

          {/* Quick demo select */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
              Quick Demo Login
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {DEMO_CREDS.map((c) => (
                <button key={c.username} type="button"
                  onClick={() => { setUsername(c.username); setPassword("hims2026"); }}
                  style={{
                    fontSize: "0.8rem", padding: "0.4rem 0.875rem", borderRadius: "0.5rem", cursor: "pointer", transition: "all 0.15s",
                    border: username === c.username ? `1.5px solid ${c.color}` : `1.5px solid ${C.border}`,
                    background: username === c.username ? c.color + "15" : C.white,
                    color: username === c.username ? c.color : C.body,
                    fontWeight: username === c.username ? 700 : 500,
                  }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: C.navy, marginBottom: "0.375rem" }}>
                Username
              </label>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username" required
                style={{
                  width: "100%", height: "44px", padding: "0 0.875rem", borderRadius: "0.625rem",
                  border: `1.5px solid ${C.border}`, fontSize: "0.9rem", color: C.navy,
                  outline: "none", transition: "border-color 0.15s", boxSizing: "border-box", background: C.white,
                }}
                onFocus={e => (e.target.style.borderColor = C.teal)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: C.navy, marginBottom: "0.375rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" required
                  style={{
                    width: "100%", height: "44px", padding: "0 2.75rem 0 0.875rem", borderRadius: "0.625rem",
                    border: `1.5px solid ${C.border}`, fontSize: "0.9rem", color: C.navy,
                    outline: "none", transition: "border-color 0.15s", boxSizing: "border-box", background: C.white,
                  }}
                  onFocus={e => (e.target.style.borderColor = C.teal)}
                  onBlur={e => (e.target.style.borderColor = C.border)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ fontSize: "0.82rem", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.5rem", padding: "0.75rem 0.875rem" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: "100%", height: "46px", borderRadius: "0.75rem", border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "#5eead4" : C.teal, color: C.white, fontWeight: 700, fontSize: "0.95rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                transition: "background 0.18s", boxShadow: "0 4px 14px rgba(13,148,136,0.3)", marginTop: "0.25rem",
              }}>
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Signing in…
                </>
              ) : (
                <><LogIn size={16} /> Sign in</>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: "1.5rem", background: "#f0fdf9", border: `1px solid #99f6e4`, borderRadius: "0.75rem", padding: "0.875rem 1rem" }}>
            <p style={{ fontSize: "0.78rem", color: C.body, margin: 0 }}>
              <span style={{ fontWeight: 700, color: C.navy }}>Demo credentials:</span>{" "}
              Use any role above with password{" "}
              <code style={{ background: C.white, padding: "0.15rem 0.4rem", borderRadius: "0.3rem", color: C.teal, fontWeight: 700, border: `1px solid ${C.border}`, fontSize: "0.82rem" }}>hims2026</code>
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) {
          .login-left { display: flex !important; }
          .login-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
