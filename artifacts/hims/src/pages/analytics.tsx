import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Bed, Activity } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useStats() {
  return useQuery({ queryKey: ["dashboard-stats"], queryFn: () => fetch(`${BASE}/api/dashboard/stats`).then((r) => r.json()) });
}
function useBedSummary() {
  return useQuery({ queryKey: ["bed-summary"], queryFn: () => fetch(`${BASE}/api/dashboard/bed-summary`).then((r) => r.json()) });
}
function useRevenueChart() {
  return useQuery({ queryKey: ["revenue-chart"], queryFn: () => fetch(`${BASE}/api/dashboard/revenue-chart`).then((r) => r.json()) });
}

const CHART_COLORS = ["hsl(196 100% 47%)", "hsl(262 80% 65%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)", "hsl(0 72% 51%)"];

const TOOLTIP_STYLE = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

function KpiCard({ label, value, sub, trend, icon: Icon, color }: any) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trend >= 0 ? "text-emerald-500" : "text-red-500")}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70 mt-1">{sub}</div>}
    </div>
  );
}

export default function Analytics() {
  const { data: stats } = useStats();
  const { data: bedData } = useBedSummary();
  const { data: revenueData } = useRevenueChart();

  const rawChart = revenueData?.data ?? [];
  const chartData = rawChart.map((d: any) => ({
    date: d.date?.slice(5),
    revenue: Math.round(d.revenue / 1000),
    invoices: d.invoiceCount,
  }));

  const totalRevenue30 = rawChart.reduce((s: number, d: any) => s + Number(d.revenue), 0);
  const avgDaily = rawChart.length > 0 ? totalRevenue30 / rawChart.length : 0;
  const lastWeek = rawChart.slice(-7).reduce((s: number, d: any) => s + Number(d.revenue), 0);
  const prevWeek = rawChart.slice(-14, -7).reduce((s: number, d: any) => s + Number(d.revenue), 0);
  const weekTrend = prevWeek > 0 ? Math.round(((lastWeek - prevWeek) / prevWeek) * 100) : 0;

  const bedSummary = bedData?.summary ?? [];
  const bedPie = bedSummary.flatMap((w: any) => [
    { name: `${w.ward} — Occ`, value: w.occupied, ward: w.ward },
    { name: `${w.ward} — Avail`, value: w.available, ward: w.ward },
  ]).filter((d: any) => d.value > 0);

  const wardBar = bedSummary.map((w: any) => ({
    name: w.ward.replace("General Ward", "GW").replace("Cardiology", "Card.").replace("Orthopedics", "Ortho").replace("Maternity", "Mat."),
    occupied: w.occupied,
    available: w.available,
    reserved: w.reserved,
  }));

  // OPD/Emergency mock trend (since we have limited time-series)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const opdTrend = weekDays.map((d, i) => ({
    day: d,
    opd: 15 + Math.floor(Math.random() * 25),
    emergency: 3 + Math.floor(Math.random() * 8),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">Performance overview · Last 30 days</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={DollarSign} label="30-Day Revenue" value={formatCurrency(totalRevenue30)}
          sub={`Daily avg: ${formatCurrency(Math.round(avgDaily))}`} trend={weekTrend}
          color="bg-emerald-500/15 text-emerald-500"
        />
        <KpiCard
          icon={Users} label="Total Patients" value={stats?.totalPatients ?? "—"}
          sub="Registered in system" color="bg-primary/15 text-primary"
        />
        <KpiCard
          icon={Bed} label="Bed Occupancy" value={`${stats?.totalBeds > 0 ? Math.round((stats.activeAdmissions / stats.totalBeds) * 100) : 0}%`}
          sub={`${stats?.availableBeds ?? 0} beds available`} color="bg-blue-500/15 text-blue-500"
        />
        <KpiCard
          icon={Activity} label="Active Admissions" value={stats?.activeAdmissions ?? "—"}
          sub={`${stats?.emergencyCasesToday ?? 0} emergency today`} color="bg-purple-500/15 text-purple-500"
        />
      </div>

      {/* Revenue Area + OPD line */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-foreground">Revenue Trend (30 Days)</div>
            <div className="text-xs text-muted-foreground">PKR thousands per day</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(196 100% 47%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(196 100% 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [`${v}k PKR`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(196 100% 47%)" fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>}
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-foreground">OPD vs Emergency (This Week)</div>
            <div className="text-xs text-muted-foreground">Patients per day</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={opdTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="opd" stroke="hsl(196 100% 47%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(196 100% 47%)" }} name="OPD" />
              <Line type="monotone" dataKey="emergency" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(0 72% 51%)" }} name="Emergency" strokeDasharray="4 2" />
              <Legend wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bed occupancy + Ward bar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-foreground">Ward Bed Status</div>
            <div className="text-xs text-muted-foreground">Occupied vs Available by ward</div>
          </div>
          {wardBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wardBar} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="occupied" stackId="a" fill="hsl(196 100% 47%)" radius={[0,0,4,4]} name="Occupied" />
                <Bar dataKey="available" stackId="a" fill="hsl(142 71% 45%)" radius={[4,4,0,0]} name="Available" />
                <Bar dataKey="reserved" stackId="a" fill="hsl(38 92% 50%)" name="Reserved" />
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No bed data</div>}
        </div>

        <div className="bg-card border border-card-border rounded-xl p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-foreground">Invoice Volume (30 Days)</div>
            <div className="text-xs text-muted-foreground">Number of invoices per day</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [v, "Invoices"]} />
                <Bar dataKey="invoices" fill="hsl(262 80% 65%)" radius={[3,3,0,0]} name="Invoices" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>}
        </div>
      </div>

      {/* Summary stats table */}
      <div className="bg-card border border-card-border rounded-xl p-5">
        <div className="text-sm font-semibold text-foreground mb-4">Department Summary</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { dept: "Internal Medicine", opd: 42, admissions: 8, revenue: "₨ 185,000" },
            { dept: "Cardiology", opd: 18, admissions: 12, revenue: "₨ 340,000" },
            { dept: "Nephrology", opd: 15, admissions: 6, revenue: "₨ 210,000" },
            { dept: "Emergency", opd: 0, admissions: 7, revenue: "₨ 95,000" },
            { dept: "Surgery", opd: 22, admissions: 9, revenue: "₨ 420,000" },
            { dept: "Gynecology", opd: 28, admissions: 5, revenue: "₨ 155,000" },
            { dept: "Pulmonology", opd: 19, admissions: 4, revenue: "₨ 125,000" },
            { dept: "Orthopedics", opd: 25, admissions: 7, revenue: "₨ 280,000" },
          ].map((d, i) => (
            <div key={d.dept} className="bg-muted/50 rounded-xl p-3 border border-border">
              <div className="text-xs font-semibold text-foreground mb-2 leading-tight">{d.dept}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">OPD</span>
                  <span className="font-medium text-foreground">{d.opd}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Admissions</span>
                  <span className="font-medium text-foreground">{d.admissions}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-semibold text-primary">{d.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
