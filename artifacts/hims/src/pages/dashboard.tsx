import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, Bed, BedDouble, Clock, DollarSign,
  FlaskConical, Stethoscope, TrendingUp, Users, Zap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { formatCurrency, formatDateTime, statusBadge, triageDot } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

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

function StatCard({ icon: Icon, label, value, sub, color, pulse }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-card-border rounded-xl p-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-5 h-5" />
          {pulse && <span className="absolute w-2 h-2 bg-red-500 rounded-full top-0 right-0 animate-ping" />}
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/30" />
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {sub && <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  );
}

const TRIAGE_COLORS = {
  immediate: "#dc2626",
  "very-urgent": "#f97316",
  urgent: "#eab308",
  "semi-urgent": "#22c55e",
  "non-urgent": "#3b82f6",
};

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboard();
  const { data: bedData } = useBedSummary();
  const { data: activityData } = useRecentActivity();
  const { data: revenueData } = useRevenueChart();

  const bedSummary = bedData?.summary ?? [];
  const activities = activityData?.activities ?? [];
  const chartData = (revenueData?.data ?? []).map((d: any) => ({
    ...d,
    revenue: d.revenue / 1000,
  }));

  const bedPieData = bedSummary.map((w: any) => [
    { name: "Occupied", value: w.occupied, color: "#3b82f6" },
    { name: "Available", value: w.available, color: "#22c55e" },
    { name: "Reserved", value: w.reserved, color: "#f59e0b" },
  ]).flat().reduce((acc: any[], item: any) => {
    const existing = acc.find((a) => a.name === item.name);
    if (existing) { existing.value += item.value; } else { acc.push({ ...item }); }
    return acc;
  }, []);

  const totalBeds = bedSummary.reduce((s: number, w: any) => s + w.total, 0);
  const occupiedBeds = bedSummary.reduce((s: number, w: any) => s + w.occupied, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Command Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        {stats?.criticalPatients > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
            <span className="text-sm text-destructive font-medium">{stats.criticalPatients} Critical Patient{stats.criticalPatients !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Patients" value={stats?.totalPatients ?? 0} color="bg-blue-500/15 text-blue-500" />
        <StatCard icon={Stethoscope} label="Today's OPD" value={stats?.todayOpdCount ?? 0} sub="appointments" color="bg-primary/15 text-primary" />
        <StatCard icon={BedDouble} label="Active Admissions" value={stats?.activeAdmissions ?? 0} color="bg-purple-500/15 text-purple-500" />
        <StatCard icon={Zap} label="Emergency Today" value={stats?.emergencyCasesToday ?? 0} color="bg-orange-500/15 text-orange-500" pulse={stats?.criticalPatients > 0} />
        <StatCard icon={FlaskConical} label="Pending Labs" value={stats?.pendingLabOrders ?? 0} color="bg-yellow-500/15 text-yellow-500" />
      </div>

      {/* Revenue + Bed Occupancy row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-4 col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-foreground">Revenue Today</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{formatCurrency(stats?.todayRevenue ?? 0)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Month to date: <span className="text-foreground font-medium">{formatCurrency(stats?.monthRevenue ?? 0)}</span>
          </div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <Bed className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-foreground">Bed Occupancy</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{occupancyRate}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${occupancyRate}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{occupiedBeds}/{totalBeds} beds occupied</div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-4 col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Bed Distribution</span>
          </div>
          {bedPieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <PieChart width={80} height={80}>
                <Pie data={bedPieData} cx={35} cy={35} innerRadius={22} outerRadius={38} dataKey="value" strokeWidth={0}>
                  {bedPieData.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="space-y-1 flex-1">
                {bedPieData.map((entry: any) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
                    <span className="text-muted-foreground flex-1">{entry.name}</span>
                    <span className="font-medium text-foreground">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div className="text-muted-foreground text-xs">No data</div>}
        </div>
      </div>

      {/* Revenue Chart + Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="bg-card border border-card-border rounded-xl p-4 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-foreground">Revenue — Last 30 Days</div>
              <div className="text-xs text-muted-foreground">PKR (thousands)</div>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(196 100% 47%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(196 100% 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => v?.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                  formatter={(v: any) => [`${v}k PKR`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(196 100% 47%)" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Live Activity</span>
            <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div className="space-y-3 overflow-y-auto max-h-52 scrollbar-thin">
            {activities.length === 0 ? (
              <div className="text-muted-foreground text-xs text-center py-4">No recent activity</div>
            ) : (
              activities.map((a: any) => (
                <div key={a.id} className="flex items-start gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground leading-snug">{a.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.patientName} · {formatDateTime(a.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ward Bed Summary */}
      {bedSummary.length > 0 && (
        <div className="bg-card border border-card-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bed className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Ward-wise Bed Status</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {bedSummary.map((ward: any) => {
              const occPct = ward.total > 0 ? (ward.occupied / ward.total) * 100 : 0;
              return (
                <div key={ward.ward} className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="text-xs font-semibold text-foreground mb-2 leading-tight">{ward.ward}</div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: ward.total }).map((_, i) => (
                      <div key={i} className={cn(
                        "h-2 flex-1 rounded-sm",
                        i < ward.occupied ? "bg-blue-500" : i < ward.occupied + ward.reserved ? "bg-amber-400" : "bg-muted"
                      )} />
                    ))}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {ward.occupied}/{ward.total} · {Math.round(occPct)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
