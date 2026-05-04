import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, BedDouble, User, Clock, Filter, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate, formatDateTime, bedStatusBg, statusBadge } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useBeds(wardId?: string) {
  return useQuery({
    queryKey: ["beds", wardId],
    queryFn: () =>
      fetch(`${BASE}/api/beds${wardId ? `?wardId=${wardId}` : ""}`).then((r) => r.json()),
    refetchInterval: 20000,
  });
}

function useAdmissions() {
  return useQuery({
    queryKey: ["admissions"],
    queryFn: () => fetch(`${BASE}/api/admissions?status=active`).then((r) => r.json()),
    refetchInterval: 20000,
  });
}

const WARDS = [
  { id: "1", name: "General Ward A" },
  { id: "2", name: "ICU" },
  { id: "3", name: "Cardiology" },
  { id: "4", name: "Orthopedics" },
  { id: "5", name: "Maternity" },
];

const WARD_COLORS: Record<string, string> = {
  "1": "border-blue-500/30 bg-blue-500/5",
  "2": "border-red-500/30 bg-red-500/5",
  "3": "border-rose-500/30 bg-rose-500/5",
  "4": "border-purple-500/30 bg-purple-500/5",
  "5": "border-pink-500/30 bg-pink-500/5",
};

const BED_STATUS_COLOR: Record<string, string> = {
  available: "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20",
  occupied: "bg-blue-500/15 border-blue-500/40",
  reserved: "bg-amber-500/10 border-amber-500/30",
  cleaning: "bg-purple-500/10 border-purple-500/30",
};

const BED_DOT: Record<string, string> = {
  available: "bg-emerald-500",
  occupied: "bg-blue-500",
  reserved: "bg-amber-400",
  cleaning: "bg-purple-500",
};

function AdmissionForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: bedData } = useBeds();
  const availableBeds = (bedData?.beds ?? []).filter((b: any) => b.status === "available");

  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    doctorId: 1,
    bedId: "",
    bedNumber: "",
    ward: "",
    admissionDate: new Date().toISOString().split("T")[0],
    admittingDiagnosis: "",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const r = await fetch(`${BASE}/api/admissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "active" }),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admissions"] });
      qc.invalidateQueries({ queryKey: ["beds"] });
      toast({ title: "Patient admitted", description: "Admission recorded successfully." });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Failed to admit patient.", variant: "destructive" }),
  });

  const selectBed = (bed: any) => {
    setForm((f) => ({ ...f, bedId: String(bed.id), bedNumber: bed.bedNumber, ward: bed.ward }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate({ ...form, bedId: Number(form.bedId) }); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2">
          <Label>Patient Name *</Label>
          <Input value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} required />
        </div>
        <div className="space-y-1">
          <Label>Admitting Doctor *</Label>
          <Input value={form.doctorName} onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))} required />
        </div>
        <div className="space-y-1">
          <Label>Admission Date *</Label>
          <Input type="date" value={form.admissionDate} onChange={(e) => setForm((f) => ({ ...f, admissionDate: e.target.value }))} required />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Select Bed *</Label>
          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto scrollbar-thin p-1">
            {availableBeds.length === 0 ? (
              <div className="col-span-3 text-xs text-muted-foreground text-center py-4">No available beds</div>
            ) : (
              availableBeds.map((bed: any) => (
                <button key={bed.id} type="button"
                  onClick={() => selectBed(bed)}
                  className={cn(
                    "text-xs p-2 rounded-lg border text-left transition-colors",
                    form.bedId === String(bed.id)
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-muted border-border hover:border-primary/50 text-muted-foreground"
                  )}>
                  <div className="font-mono font-bold">{bed.bedNumber}</div>
                  <div className="truncate">{bed.ward}</div>
                </button>
              ))
            )}
          </div>
          {form.bedNumber && (
            <div className="text-xs text-primary">Selected: {form.bedNumber} — {form.ward}</div>
          )}
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Admitting Diagnosis *</Label>
          <Input value={form.admittingDiagnosis} onChange={(e) => setForm((f) => ({ ...f, admittingDiagnosis: e.target.value }))} required />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending || !form.bedId}>
          {mutation.isPending ? "Admitting…" : "Admit Patient"}
        </Button>
      </div>
    </form>
  );
}

export default function IPD() {
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [showAdmission, setShowAdmission] = useState(false);
  const [view, setView] = useState<"beds" | "list">("beds");
  const { data: bedData, isLoading: bedsLoading } = useBeds(selectedWard || undefined);
  const { data: admissionsData } = useAdmissions();

  const beds = bedData?.beds ?? [];
  const admissions = admissionsData?.admissions ?? [];

  const totalBeds = beds.length;
  const occupied = beds.filter((b: any) => b.status === "occupied").length;
  const available = beds.filter((b: any) => b.status === "available").length;
  const reserved = beds.filter((b: any) => b.status === "reserved").length;

  const bedsByWard = WARDS.map((w) => ({
    ...w,
    beds: beds.filter((b: any) => String(b.wardId) === w.id || b.ward === w.name),
  })).filter((w) => !selectedWard || w.id === selectedWard);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">IPD — Bed Management</h1>
          <p className="text-sm text-muted-foreground">{occupied}/{totalBeds} beds occupied</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["beds", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn("px-3 py-1.5 text-xs capitalize transition-colors", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                {v}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={() => setShowAdmission(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> New Admission
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Occupied", count: occupied, dot: "bg-blue-500" },
          { label: "Available", count: available, dot: "bg-emerald-500" },
          { label: "Reserved", count: reserved, dot: "bg-amber-400" },
          { label: "Total Beds", count: totalBeds, dot: "bg-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-3 flex items-center gap-3">
            <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", s.dot)} />
            <div>
              <div className="text-xl font-bold text-foreground">{s.count}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ward filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin pb-1">
        <button onClick={() => setSelectedWard("")}
          className={cn("text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors",
            !selectedWard ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50")}>
          All Wards
        </button>
        {WARDS.map((w) => (
          <button key={w.id} onClick={() => setSelectedWard(w.id)}
            className={cn("text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors",
              selectedWard === w.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50")}>
            {w.name}
          </button>
        ))}
      </div>

      {/* Bed Grid View */}
      {view === "beds" && (
        <div className="space-y-6">
          {bedsByWard.map((ward) => (
            <div key={ward.id} className={cn("bg-card border rounded-xl p-4", WARD_COLORS[ward.id] ?? "border-card-border")}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{ward.name}</h3>
                <div className="text-xs text-muted-foreground">
                  {ward.beds.filter((b) => b.status === "occupied").length}/{ward.beds.length} occupied
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {ward.beds.map((bed: any) => (
                  <div key={bed.id}
                    className={cn("rounded-lg border p-2 cursor-pointer transition-all", BED_STATUS_COLOR[bed.status] ?? "bg-muted border-border")}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-foreground">{bed.bedNumber}</span>
                      <div className={cn("w-2 h-2 rounded-full shrink-0", BED_DOT[bed.status] ?? "bg-muted-foreground")} />
                    </div>
                    <div className="text-[9px] text-muted-foreground leading-tight truncate">
                      {bed.status === "occupied" && bed.patientName ? bed.patientName.split(" ")[0] : bed.status}
                    </div>
                  </div>
                ))}
                {ward.beds.length === 0 && (
                  <div className="col-span-full text-xs text-muted-foreground text-center py-6">No beds in this ward</div>
                )}
              </div>
              {/* Legend */}
              <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
                {["available", "occupied", "reserved", "cleaning"].map((s) => (
                  <div key={s} className="flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", BED_DOT[s])} />
                    <span className="capitalize">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View — Active Admissions */}
      {view === "list" && (
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Patient</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Bed</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Ward</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Doctor</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Diagnosis</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Admitted</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {admissions.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">No active admissions</td></tr>
                ) : (
                  admissions.map((a: any, i: number) => (
                    <motion.tr key={a.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                            {a.patientName?.[0]}
                          </div>
                          <span className="text-sm font-medium text-foreground">{a.patientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{a.bedNumber ?? "—"}</code>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-sm text-muted-foreground">{a.ward}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{a.doctorName}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate">{a.admittingDiagnosis}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{formatDate(a.admissionDate)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", statusBadge(a.status))}>{a.status}</span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={showAdmission} onOpenChange={setShowAdmission}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader><DialogTitle>New Admission</DialogTitle></DialogHeader>
          <AdmissionForm onClose={() => setShowAdmission(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
