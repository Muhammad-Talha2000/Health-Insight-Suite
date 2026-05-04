import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Eye, EyeOff, LogIn, Shield, Stethoscope } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const DEMO_CREDS = [
  { username: "admin", label: "Admin" },
  { username: "doctor", label: "Doctor" },
  { username: "nurse", label: "Nurse" },
  { username: "pharmacist", label: "Pharmacist" },
];

export default function Login() {
  const { login } = useAuth();
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
    if (!ok) {
      setError("Invalid credentials. Use demo password: hims2026");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-sidebar relative overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(hsl(196 100% 47%) 1px, transparent 1px), linear-gradient(90deg, hsl(196 100% 47%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Gradient accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sidebar-foreground font-bold text-lg leading-none">MediCore HIMS</div>
              <div className="text-sidebar-foreground/50 text-xs">Hospital Information System</div>
            </div>
          </div>

          {/* Main copy */}
          <div className="my-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                Next-Generation<br />
                <span className="text-primary">Hospital Management</span><br />
                for 2026
              </h1>
              <p className="text-sidebar-foreground/60 text-lg leading-relaxed">
                Integrated patient care, real-time analytics, and seamless workflows — built for the modern healthcare environment.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 grid grid-cols-2 gap-4">
              {[
                { icon: Stethoscope, label: "Patient Records", value: "8,400+" },
                { icon: Activity, label: "Daily OPD", value: "240+" },
                { icon: Shield, label: "Bed Occupancy", value: "87%" },
                { icon: LogIn, label: "Modules", value: "12" },
              ].map((stat) => (
                <div key={stat.label} className="bg-sidebar-accent/60 border border-sidebar-border rounded-xl p-4">
                  <stat.icon className="w-4 h-4 text-primary mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-sidebar-foreground/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="text-sidebar-foreground/30 text-xs">
            © 2026 MediCore HIMS. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MediCore HIMS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {/* Demo quick-select */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Quick Demo Login</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_CREDS.map((c) => (
                <button
                  key={c.username}
                  type="button"
                  onClick={() => { setUsername(c.username); setPassword("hims2026"); }}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                    username === c.username
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Demo credentials:</span> Use any username above with password <code className="bg-background px-1 py-0.5 rounded text-primary">hims2026</code>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
