import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Pill, Package, AlertTriangle, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, statusBadge } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useMedications(search: string) {
  return useQuery({
    queryKey: ["medications", search],
    queryFn: () =>
      fetch(`${BASE}/api/medications?search=${encodeURIComponent(search)}&limit=50`).then((r) => r.json()),
    placeholderData: (prev) => prev,
  });
}

function usePrescriptions() {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => fetch(`${BASE}/api/prescriptions?limit=50`).then((r) => r.json()),
    refetchInterval: 30000,
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  Antidiabetic: "bg-blue-500/10 text-blue-500",
  Antibiotic: "bg-emerald-500/10 text-emerald-500",
  "Proton Pump Inhibitor": "bg-purple-500/10 text-purple-500",
  Statin: "bg-orange-500/10 text-orange-500",
  "Calcium Channel Blocker": "bg-rose-500/10 text-rose-500",
  "Antiplatelet / NSAID": "bg-red-500/10 text-red-500",
  Insulin: "bg-sky-500/10 text-sky-500",
  Bronchodilator: "bg-teal-500/10 text-teal-500",
  "ACE Inhibitor": "bg-amber-500/10 text-amber-500",
  Anticoagulant: "bg-red-600/10 text-red-600",
  "Loop Diuretic": "bg-cyan-500/10 text-cyan-500",
};

export default function Pharmacy() {
  const [search, setSearch] = useState("");
  const [dSearch, setDSearch] = useState("");
  const [tab, setTab] = useState<"inventory" | "prescriptions">("inventory");

  const { data: medData, isLoading } = useMedications(dSearch);
  const { data: prescrData } = usePrescriptions();

  const medications = medData?.medications ?? [];
  const prescriptions = prescrData?.prescriptions ?? [];

  const handleSearch = (v: string) => {
    setSearch(v);
    clearTimeout((window as any)._pharmTimer);
    (window as any)._pharmTimer = setTimeout(() => setDSearch(v), 300);
  };

  const lowStock = medications.filter((m: any) => m.stockQuantity < 50);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pharmacy</h1>
          <p className="text-sm text-muted-foreground">{medications.length} medications in inventory</p>
        </div>
        {lowStock.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-500 font-medium">{lowStock.length} Low Stock</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 w-fit">
        {(["inventory", "prescriptions"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 rounded-lg text-sm capitalize font-medium transition-colors",
              tab === t ? "bg-card shadow-sm text-foreground border border-border" : "text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "inventory" && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by generic name…" className="pl-9" />
              {search && (
                <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card border border-card-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Total Items</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{medications.length}</div>
            </div>
            <div className="bg-card border border-card-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-foreground">Low Stock</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{lowStock.length}</div>
            </div>
            <div className="bg-card border border-card-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Pill className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-foreground">Active Rx</span>
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                {prescriptions.filter((p: any) => p.status === "active").length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border border-card-border rounded-xl p-4 animate-pulse h-32" />
              ))
            ) : medications.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-muted-foreground text-sm">No medications found</div>
            ) : (
              medications.map((med: any, i: number) => (
                <motion.div key={med.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "bg-card border rounded-xl p-4 hover:border-primary/30 transition-colors",
                    med.stockQuantity < 50 ? "border-amber-500/40" : "border-card-border"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-foreground text-sm">{med.genericName}</div>
                      <div className="text-xs text-muted-foreground">{med.brandName}</div>
                    </div>
                    {med.stockQuantity < 50 && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", CATEGORY_COLORS[med.category] ?? "bg-muted text-muted-foreground")}>
                      {med.category}
                    </span>
                    {med.strength && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{med.strength}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted-foreground">Stock: </span>
                      <span className={cn("font-bold", med.stockQuantity < 50 ? "text-amber-500" : "text-foreground")}>
                        {med.stockQuantity} {med.unit}s
                      </span>
                    </div>
                    <span className="text-muted-foreground font-medium">{formatCurrency(med.price)}/{med.unit}</span>
                  </div>
                  {/* Stock bar */}
                  <div className="mt-2 w-full bg-muted rounded-full h-1">
                    <div className={cn("h-1 rounded-full transition-all", med.stockQuantity < 50 ? "bg-amber-500" : "bg-primary")}
                      style={{ width: `${Math.min(100, (med.stockQuantity / 600) * 100)}%` }} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {tab === "prescriptions" && (
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Patient", "Drug", "Dosage", "Frequency", "Duration", "Route", "Doctor", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prescriptions.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground text-sm">No prescriptions found</td></tr>
                ) : (
                  prescriptions.map((p: any, i: number) => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{p.patientName}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-foreground">{p.drugName}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.dosage}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.frequency}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.duration}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.route}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.doctorName}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", statusBadge(p.status))}>
                          {p.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
