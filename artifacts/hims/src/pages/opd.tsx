import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, CheckCircle2, UserCheck, Stethoscope, ChevronDown, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatTime, statusBadge } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STATUSES = ["waiting", "in-progress", "completed", "cancelled", "scheduled"];
const STATUS_COLORS: Record<string, string> = {
  waiting: "bg-amber-500/10 border-amber-500/30 text-amber-500",
  "in-progress": "bg-sky-500/10 border-sky-500/30 text-sky-400",
  completed: "bg-muted/50 border-border text-muted-foreground",
  cancelled: "bg-destructive/10 border-destructive/30 text-destructive",
  scheduled: "bg-blue-500/10 border-blue-500/30 text-blue-500",
};

const TRIAGE_DOTS: Record<string, string> = {
  waiting: "bg-amber-400 animate-pulse",
  "in-progress": "bg-sky-400",
  completed: "bg-muted-foreground",
  cancelled: "bg-destructive",
  scheduled: "bg-blue-400",
};

const DEPARTMENTS = ["Internal Medicine", "Cardiology", "Pulmonology", "Nephrology", "General Surgery", "Gynecology", "Orthopedics", "Neurology", "ENT", "Dermatology", "Ophthalmology", "Psychiatry"];

function useQueue() {
  return useQuery({
    queryKey: ["opd-queue"],
    queryFn: () => fetch(`${BASE}/api/appointments/queue/today`).then((r) => r.json()),
    refetchInterval: 15000,
  });
}

function NewAppointmentForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    doctorId: 1,
    department: "Internal Medicine",
    chiefComplaint: "",
    visitType: "OPD",
    notes: "",
    scheduledAt: new Date().toISOString(),
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const r = await fetch(`${BASE}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "waiting" }),
      });
      if (!r.ok) throw new Error("Failed to create appointment");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["opd-queue"] });
      toast({ title: "Appointment added", description: "Patient added to today's queue." });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Failed to add appointment.", variant: "destructive" }),
  });

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target?.value ?? e }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2">
          <Label>Patient Name *</Label>
          <Input value={form.patientName} onChange={set("patientName")} required placeholder="Full name or MR#" />
        </div>
        <div className="space-y-1">
          <Label>Doctor Name *</Label>
          <Input value={form.doctorName} onChange={set("doctorName")} required placeholder="Dr. Name" />
        </div>
        <div className="space-y-1">
          <Label>Department *</Label>
          <Select value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Visit Type</Label>
          <Select value={form.visitType} onValueChange={(v) => setForm((f) => ({ ...f, visitType: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["OPD", "Follow-up", "Emergency", "Referral"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Chief Complaint *</Label>
          <Textarea value={form.chiefComplaint} onChange={set("chiefComplaint")} required placeholder="Reason for visit" rows={2} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding…" : "Add to Queue"}
        </Button>
      </div>
    </form>
  );
}

export default function OPD() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, refetch } = useQueue();
  const qc = useQueryClient();
  const { toast } = useToast();

  const appointments = data?.appointments ?? [];

  const waiting = appointments.filter((a: any) => a.status === "waiting");
  const inProgress = appointments.filter((a: any) => a.status === "in-progress");
  const completed = appointments.filter((a: any) => a.status === "completed");
  const scheduled = appointments.filter((a: any) => a.status === "scheduled");

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const r = await fetch(`${BASE}/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Failed to update");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["opd-queue"] }),
    onError: () => toast({ title: "Error", description: "Failed to update status.", variant: "destructive" }),
  });

  const AppCard = ({ appt }: { appt: any }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-card border border-card-border rounded-xl p-4 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
            appt.status === "in-progress" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            #{appt.tokenNumber}
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground">{appt.patientName}</div>
            <div className="text-xs text-muted-foreground">{appt.doctorName} · {appt.department}</div>
          </div>
        </div>
        <div className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", STATUS_COLORS[appt.status] ?? "bg-muted border-border text-muted-foreground")}>
          {appt.status}
        </div>
      </div>

      {appt.chiefComplaint && (
        <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
          {appt.chiefComplaint}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatTime(appt.scheduledAt)}
          <span className="ml-2 px-1.5 py-0.5 bg-muted rounded text-[10px]">{appt.visitType}</span>
        </div>
        <div className="flex gap-1">
          {appt.status === "waiting" && (
            <Button size="sm" variant="outline" className="h-6 text-xs px-2"
              onClick={() => updateStatus.mutate({ id: appt.id, status: "in-progress" })}>
              <UserCheck className="w-3 h-3 mr-1" /> Call In
            </Button>
          )}
          {appt.status === "in-progress" && (
            <Button size="sm" className="h-6 text-xs px-2"
              onClick={() => updateStatus.mutate({ id: appt.id, status: "completed" })}>
              <CheckCircle2 className="w-3 h-3 mr-1" /> Done
            </Button>
          )}
          {appt.status === "scheduled" && (
            <Button size="sm" variant="outline" className="h-6 text-xs px-2"
              onClick={() => updateStatus.mutate({ id: appt.id, status: "waiting" })}>
              Check In
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const Column = ({ title, items, count, icon: Icon, accent }: any) => (
    <div className="flex flex-col gap-3">
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg bg-card border", accent)}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{count}</span>
      </div>
      <AnimatePresence>
        {items.map((a: any) => <AppCard key={a.id} appt={a} />)}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-xs border-2 border-dashed border-border rounded-xl">
          No {title.toLowerCase()} patients
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">OPD Queue</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} ·{" "}
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> New Appointment
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Waiting", count: waiting.length, color: "text-amber-500" },
          { label: "In Progress", count: inProgress.length, color: "text-sky-400" },
          { label: "Scheduled", count: scheduled.length, color: "text-blue-400" },
          { label: "Completed", count: completed.length, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-3 text-center">
            <div className={cn("text-2xl font-bold", s.color)}>{s.count}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Queue Kanban */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Column title="Scheduled" items={scheduled} count={scheduled.length} icon={Clock} accent="border-blue-500/30 text-blue-500" />
        <Column title="Waiting" items={waiting} count={waiting.length} icon={Stethoscope} accent="border-amber-500/30 text-amber-500" />
        <Column title="In Progress" items={inProgress} count={inProgress.length} icon={UserCheck} accent="border-sky-500/30 text-sky-400" />
        <Column title="Completed" items={completed} count={completed.length} icon={CheckCircle2} accent="border-border text-muted-foreground" />
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Appointment</DialogTitle></DialogHeader>
          <NewAppointmentForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
