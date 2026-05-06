import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, Bed, BedDouble, Clock, DollarSign,
  FlaskConical, Stethoscope, TrendingUp, TrendingDown, Users, Zap,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const C = {
  teal:  "#0d9488",
  navy:  "#0f2027",
  body:  "#4b5563",
  muted: "#9ca3af",
  border:"#e2e8f0",
  bg:    "#f8fafc",
  white: "#ffffff",
};

function useDashboard() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetch(`${BASE}/api/dashboard/stats`).then((r) => r.json()),
    refetchInterval: 30000,
  });
}
function useBedSummary() {
  return useQuery({
    queryKey: ["bed-summary"],
    queryFn: () => fetch(`${BASE}/api/dashboard/bed-summary`).then((r) => r.json()),
  });
}
function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => fetch(`${BASE}/api/dashboard/recent-activity`).then((r) => r.json()),
    refetchInterval: 15000,
  });
}
function useRevenueChart() {
  return useQuery({
    queryKey: ["revenue-chart"],
    queryFn: () => fetch(`${BASE}/api/dashboard/revenue-chart`).then((r) => r.json()),
  });
}

function StatCard({ icon: Icon, label, value, sub, iconColor, iconBg, trend }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  iconColor: string;
  iconBg: string;
  trend?: { value: string; up: boolean };
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: "0.875rem",
        padding: "1.25rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)",
        transition: "box-shadow 0.2s, transform 0.2s", cursor: "default",
      }}
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(15,32,39,0.09)" } as any}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={iconColor} />
        </div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", fontWeight: 700, color: trend.up ? "#059669" : "#dc2626" }}>
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </div>
        )}
      </div>
      <div style={{ fontSize: "1.75rem", fontWeight: 900, color: C.navy, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.8rem", color: C.body, marginTop: "0.3rem" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: "0.15rem" }}>{sub}</div>}
    </motion.div>
  );
}

const TRIAGE_COLORS: Record<string, string> = {
  immediate:    "#dc2626",
  "very-urgent":"#ea580c",
  urgent:       "#ca8a04",
  "semi-urgent":"#16a34a",
  "non-urgent": "#2563eb",
};

const CHART_TOOLTIP_STYLE = {
  background: "#fff",
  border: `1px solid ${C.border}`,
  borderRadius: "0.5rem",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(15,32,39,0.1)",
};

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboard();
  const { data: bedData }          = useBedSummary();
  const { data: activityData }     = useRecentActivity();
  const { data: revenueData }      = useRevenueChart();

  const bedSummary  = bedData?.summary ?? [];
  const activities  = activityData?.activities ?? [];
  const chartData   = (revenueData?.data ?? []).map((d: any) => ({ ...d, revenue: d.revenue / 1000 }));

  const bedPieData = bedSummary.map((w: any) => [
    { name: "Occupied",  value: w.occupied,  color: "#0d9488" },
    { name: "Available", value: w.available, color: "#22c55e" },
    { name: "Reserved",  value: w.reserved,  color: "#f59e0b" },
  ]).flat().reduce((acc: any[], item: any) => {
    const ex = acc.find((a) => a.name === item.name);
    if (ex) ex.value += item.value; else acc.push({ ...item });
    return acc;
  }, []);

  const totalBeds    = bedSummary.reduce((s: number, w: any) => s + w.total, 0);
  const occupiedBeds = bedSummary.reduce((s: number, w: any) => s + w.occupied, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: C.bg }}>
        <div style={{ width: 36, height: 36, border: "3px solid #ccfbf1", borderTopColor: C.teal, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", minHeight: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: C.navy, margin: 0 }}>Command Dashboard</h1>
          <p style={{ fontSize: "0.82rem", color: C.muted, marginTop: "0.2rem" }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        {stats?.criticalPatients > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.875rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.625rem" }}>
            <AlertTriangle size={15} color="#dc2626" style={{ animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: "0.82rem", color: "#dc2626", fontWeight: 700 }}>
              {stats.criticalPatients} Critical Patient{stats.criticalPatients !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* KPI stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <StatCard icon={Users}      label="Total Patients"     value={stats?.totalPatients ?? 0}       iconColor="#3b82f6"  iconBg="#eff6ff"  trend={{ value: "+4.2%", up: true }} />
        <StatCard icon={Stethoscope} label="Today's OPD"       value={stats?.todayOpdCount ?? 0}        iconColor={C.teal}  iconBg="#f0fdf9"  sub="appointments" trend={{ value: "+11%", up: true }} />
        <StatCard icon={BedDouble}  label="Active Admissions"  value={stats?.activeAdmissions ?? 0}     iconColor="#7c3aed" iconBg="#f5f3ff"  />
        <StatCard icon={Zap}        label="Emergency Today"    value={stats?.emergencyCasesToday ?? 0}  iconColor="#ea580c" iconBg="#fff7ed"  trend={{ value: "-2", up: false }} />
        <StatCard icon={FlaskConical} label="Pending Labs"     value={stats?.pendingLabOrders ?? 0}     iconColor="#ca8a04" iconBg="#fefce8"  />
      </div>

      {/* Revenue + Bed occupancy row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="db-row">
        {/* Revenue today */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "0.5rem", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={16} color="#059669" />
            </div>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.body }}>Revenue Today</span>
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 900, color: C.navy }}>{formatCurrency(stats?.todayRevenue ?? 0)}</div>
          <div style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.3rem" }}>
            MTD: <span style={{ color: C.navy, fontWeight: 700 }}>{formatCurrency(stats?.monthRevenue ?? 0)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.625rem", fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>
            <TrendingUp size={12} /> +18% vs last month
          </div>
        </div>

        {/* Bed occupancy */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "0.5rem", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bed size={16} color="#3b82f6" />
            </div>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.body }}>Bed Occupancy</span>
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 900, color: C.navy }}>{occupancyRate}%</div>
          <div style={{ width: "100%", background: "#e2e8f0", borderRadius: 99, height: 6, marginTop: "0.75rem" }}>
            <div style={{ width: `${occupancyRate}%`, height: 6, borderRadius: 99, background: C.teal, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: "0.375rem" }}>{occupiedBeds}/{totalBeds} beds occupied</div>
        </div>

        {/* Bed distribution donut */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "0.5rem", background: "#f0fdf9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={16} color={C.teal} />
            </div>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.body }}>Bed Distribution</span>
          </div>
          {bedPieData.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <PieChart width={72} height={72}>
                <Pie data={bedPieData} cx={32} cy={32} innerRadius={20} outerRadius={34} dataKey="value" strokeWidth={0}>
                  {bedPieData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", flex: 1 }}>
                {bedPieData.map((entry: any) => (
                  <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, flexShrink: 0 }} />
                    <span style={{ color: C.body, flex: 1 }}>{entry.name}</span>
                    <span style={{ fontWeight: 700, color: C.navy }}>{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div style={{ fontSize: "0.8rem", color: C.muted }}>No data</div>}
        </div>
      </div>

      {/* Revenue chart + Activity feed */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }} className="db-chart-row">
        {/* Revenue area chart */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: C.navy }}>Revenue — Last 30 Days</div>
              <div style={{ fontSize: "0.72rem", color: C.muted }}>PKR (thousands)</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "0.25rem 0.625rem", borderRadius: "99px" }}>
              <TrendingUp size={12} /> +18% MTD
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0d9488" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.muted }} tickLine={false} axisLine={false} tickFormatter={(v) => v?.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: C.muted }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={{ color: C.navy, fontWeight: 600 }} formatter={(v: any) => [`${v}k PKR`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" fill="url(#revGrad)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: "0.85rem" }}>No revenue data yet</div>
          )}
        </div>

        {/* Live activity feed */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Clock size={15} color={C.teal} />
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: C.navy }}>Live Activity</span>
            <span style={{ marginLeft: "auto", width: 8, height: 8, background: "#22c55e", borderRadius: "50%", animation: "pulse 1.5s infinite", display: "inline-block" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", maxHeight: "220px" }}>
            {activities.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: C.muted, textAlign: "center", padding: "1rem 0" }}>No recent activity</div>
            ) : (
              activities.map((a: any) => (
                <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5,
                    background: a.severity === "critical" ? "#dc2626" : a.severity === "warning" ? "#f59e0b" : "#22c55e",
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.78rem", color: C.navy, lineHeight: 1.4, margin: 0 }}>{a.description}</p>
                    <p style={{ fontSize: "0.68rem", color: C.muted, margin: "0.15rem 0 0" }}>{a.patientName} · {formatDateTime(a.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ward bed grid */}
      {bedSummary.length > 0 && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "0.875rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(15,32,39,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Bed size={15} color={C.teal} />
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: C.navy }}>Ward-wise Bed Status</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem" }}>
            {bedSummary.map((ward: any) => {
              const pct = ward.total > 0 ? (ward.occupied / ward.total) * 100 : 0;
              return (
                <div key={ward.ward} style={{ background: "#f8fafc", borderRadius: "0.75rem", padding: "0.875rem", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.navy, marginBottom: "0.625rem" }}>{ward.ward}</div>
                  <div style={{ display: "flex", gap: 3, marginBottom: "0.5rem" }}>
                    {Array.from({ length: ward.total }).map((_, i) => (
                      <div key={i} style={{
                        height: 8, flex: 1, borderRadius: 4,
                        background: i < ward.occupied ? C.teal : i < ward.occupied + ward.reserved ? "#f59e0b" : "#e2e8f0",
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: C.muted }}>
                    {ward.occupied}/{ward.total} · <span style={{ color: C.teal, fontWeight: 700 }}>{Math.round(pct)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
        @media (max-width: 900px) {
          .db-row       { grid-template-columns: 1fr 1fr !important; }
          .db-chart-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .db-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
