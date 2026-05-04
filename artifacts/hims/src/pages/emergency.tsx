import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Zap, Clock, AlertTriangle, Heart, Wind, Thermometer, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDateTime, triageColor, triageDot } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TRIAGE_LEVELS = [
  { value: "immediate", label: "Immediate", desc: "Life-threatening", color: "bg-red-600 text-white" },
  { value: "very-urgent", label: "Very Urgent", desc: "Potentially life-threatening", color: "bg-orange-500 text-white" },
  { value: "urgent", label: "Urgent", desc: "Serious condition", color: "bg-yellow-400 text-black" },
  { value: "semi-urgent", label: "Semi-Urgent", desc: "Stable", color: "bg-green-500 text-white" },
  { value: "non-urgent", label: "Non-Urgent", desc: "Minor", color: "bg-blue-500 text-white" },
];

function useEmergency() {
  return useQuery({
    queryKey: ["emergency-cases"],
    queryFn: () => fetch(`${BASE}/api/emergency-cases`).then((r) => r.json()),
    refetchInterval: 10000,
  });
}

function VitalBadge({ icon: Icon, label, value, normal }: { icon: React.ElementType; label: string; value?: number | null; normal?: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs bg-muted/50 rounded-lg px-2.5 py-1.5">
      <Icon className="w-3 h-3 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground">{value ?? "—"}</span>
    </div>
  );
}

function NewCaseForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    patientName: "Unknown",
    age: "",
    gender: "male",
    chiefComplaint: "",
    triage: "urgent",
    bpSystolic: "",
    bpDiastolic: "",
    pulse: "",
    temperature: "",
    spo2: "",
    assignedDoctorName: "",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const r = await fetch(`${BASE}/api/emergency-cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          age: data.age ? Number(data.age) : null,
          bpSystolic: data.bpSystolic ? Number(data.bpSystolic) : null,
          bpDiastolic: data.bpDiastolic ? Number(data.bpDiastolic) : null,
          pulse: data.pulse ? Number(data.pulse) : null,
          temperature: data.temperature ? Number(data.temperature) : null,
          spo2: data.spo2 ? Number(data.spo2) : null,
          status: "active",
          arrivedAt: new Date().toISOString(),
        }),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergency-cases"] });
      toast({ title: "Emergency case registered", description: "Patient triaged and added to emergency board." });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Failed to register case.", variant: "destructive" }),
  });

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target?.value ?? e }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
      {/* Triage selector — big buttons */}
      <div className="space-y-2">
        <Label>Triage Level *</Label>
        <div className="grid grid-cols-1 gap-2">
          {TRIAGE_LEVELS.map((t) => (
            <button key={t.value} type="button"
              onClick={() => setForm((f) => ({ ...f, triage: t.value }))}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                form.triage === t.value ? `${t.color} border-transparent` : "bg-muted/30 border-border hover:border-primary/30 text-foreground"
              )}>
              <div className={cn("w-3 h-3 rounded-full shrink-0",
                form.triage === t.value ? "bg-white/60" : triageDot(t.value))} />
              <div>
                <div className="font-bold text-sm">{t.label}</div>
                <div className={cn("text-[11px]", form.triage === t.value ? "opacity-80" : "text-muted-foreground")}>{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2">
          <Label>Chief Complaint *</Label>
          <Textarea value={form.chiefComplaint} onChange={set("chiefComplaint")} required placeholder="Describe presenting complaint" rows={2} />
        </div>
        <div className="space-y-1">
          <Label>Patient Name</Label>
          <Input value={form.patientName} onChange={set("patientName")} placeholder="Unknown if not identified" />
        </div>
        <div className="space-y-1">
          <Label>Age (approx)</Label>
          <Input type="number" value={form.age} onChange={set("age")} placeholder="Estimated" min="0" max="120" />
        </div>
        <div className="space-y-1">
          <Label>Gender</Label>
          <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>BP Systolic</Label>
          <Input type="number" value={form.bpSystolic} onChange={set("bpSystolic")} placeholder="mmHg" />
        </div>
        <div className="space-y-1">
          <Label>BP Diastolic</Label>
          <Input type="number" value={form.bpDiastolic} onChange={set("bpDiastolic")} placeholder="mmHg" />
        </div>
        <div className="space-y-1">
          <Label>Pulse</Label>
          <Input type="number" value={form.pulse} onChange={set("pulse")} placeholder="bpm" />
        </div>
        <div className="space-y-1">
          <Label>SpO₂</Label>
          <Input type="number" value={form.spo2} onChange={set("spo2")} placeholder="%" min="50" max="100" />
        </div>
        <div className="space-y-1">
          <Label>Temperature (°C)</Label>
          <Input type="number" value={form.temperature} onChange={set("temperature")} placeholder="°C" step="0.1" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Assigned Doctor</Label>
          <Input value={form.assignedDoctorName} onChange={set("assignedDoctorName")} placeholder="Dr. Name" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Clinical Notes</Label>
          <Textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Initial assessment, interventions…" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending ? "Registering…" : "Register Case"}
        </Button>
      </div>
    </form>
  );
}

const TRIAGE_ORDER = ["immediate", "very-urgent", "urgent", "semi-urgent", "non-urgent"];

export default function Emergency() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>("active");
  const qc = useQueryClient();
  const { data, isLoading, refetch } = useEmergency();
  const { toast } = useToast();

  const cases: any[] = (data?.emergencyCases ?? [])
    .filter((c: any) => !filter || c.status === filter)
    .sort((a: any, b: any) => TRIAGE_ORDER.indexOf(a.triage) - TRIAGE_ORDER.indexOf(b.triage));

  const all: any[] = data?.emergencyCases ?? [];
  const active = all.filter((c: any) => c.status === "active");
  const immediate = active.filter((c: any) => c.triage === "immediate");

  const updateCase = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const r = await fetch(`${BASE}/api/emergency-cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergency-cases"] }),
    onError: () => toast({ title: "Error", description: "Failed to update case.", variant: "destructive" }),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">Emergency Department</h1>
            {immediate.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                {immediate.length} CRITICAL
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{active.length} active case{active.length !== 1 ? "s" : ""} · Manchester 5-Level Triage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-1.5" /> Refresh</Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> New Case
          </Button>
        </div>
      </div>

      {/* Triage Summary */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {TRIAGE_LEVELS.map((t) => {
          const count = all.filter((c: any) => c.triage === t.value && c.status === "active").length;
          return (
            <div key={t.value} className={cn("rounded-xl p-3 text-center border", t.color, "border-transparent")}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-[10px] font-medium opacity-90">{t.label}</div>
            </div>
          );
        })}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-4">
        {["active", "admitted", "discharged", "deceased", ""].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn("text-xs px-3 py-1.5 rounded-lg border transition-colors",
              filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50")}>
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Cases */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-card-border rounded-xl p-4 animate-pulse h-40" />
          ))}
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm border-2 border-dashed border-border rounded-xl">
          No {filter || ""} emergency cases
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {cases.map((c: any) => (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={cn(
                  "bg-card border rounded-xl overflow-hidden",
                  c.triage === "immediate" ? "border-red-600/50 shadow-lg shadow-red-600/10" : "border-card-border"
                )}
              >
                {/* Triage bar */}
                <div className={cn("h-1.5", {
                  "bg-red-600": c.triage === "immediate",
                  "bg-orange-500": c.triage === "very-urgent",
                  "bg-yellow-400": c.triage === "urgent",
                  "bg-green-500": c.triage === "semi-urgent",
                  "bg-blue-500": c.triage === "non-urgent",
                })} />

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="font-bold text-foreground">{c.patientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.age ? `${c.age} yrs` : "Age unknown"} · {c.gender}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold border", triageColor(c.triage))}>
                        {TRIAGE_LEVELS.find((t) => t.value === c.triage)?.label ?? c.triage}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{c.status}</span>
                    </div>
                  </div>

                  <div className="text-xs text-foreground bg-muted/50 rounded-lg px-3 py-2 mb-3 leading-relaxed">
                    {c.chiefComplaint}
                  </div>

                  {/* Vitals */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {c.bpSystolic && <VitalBadge icon={Heart} label="BP" value={`${c.bpSystolic}/${c.bpDiastolic}`} />}
                    {c.pulse && <VitalBadge icon={Activity} label="HR" value={c.pulse} />}
                    {c.spo2 && <VitalBadge icon={Wind} label="SpO₂" value={`${c.spo2}%`} />}
                    {c.temperature && <VitalBadge icon={Thermometer} label="T" value={`${c.temperature}°C`} />}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(c.arrivedAt)}
                      {c.assignedDoctorName && <span className="ml-2">· {c.assignedDoctorName}</span>}
                    </div>
                    {c.status === "active" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 text-[10px] px-2"
                          onClick={() => updateCase.mutate({ id: c.id, status: "admitted" })}>
                          Admit
                        </Button>
                        <Button size="sm" variant="outline" className="h-6 text-[10px] px-2"
                          onClick={() => updateCase.mutate({ id: c.id, status: "discharged" })}>
                          Discharge
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-destructive" /> New Emergency Case
            </DialogTitle>
          </DialogHeader>
          <NewCaseForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
