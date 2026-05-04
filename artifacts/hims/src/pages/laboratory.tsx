import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, FlaskConical, AlertTriangle, Clock, CheckCircle2, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDateTime, statusBadge } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STATUS_ORDER = ["critical", "pending", "in-progress", "completed"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 border-amber-500/30 text-amber-500",
  "in-progress": "bg-sky-500/10 border-sky-500/30 text-sky-400",
  completed: "bg-muted/50 border-border text-muted-foreground",
  critical: "bg-red-500/10 border-red-500/30 text-red-500",
};

const CATEGORIES = ["Biochemistry", "Hematology", "Urinalysis", "Microbiology", "Cardiology", "Pulmonary", "Immunology", "Histopathology", "Radiology"];

function useLabOrders(status?: string) {
  return useQuery({
    queryKey: ["lab-orders", status],
    queryFn: () =>
      fetch(`${BASE}/api/lab-orders${status ? `?status=${status}` : ""}`).then((r) => r.json()),
    refetchInterval: 20000,
  });
}

function NewLabOrderForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    doctorId: 1,
    testName: "",
    testCode: "",
    category: "Biochemistry",
    priority: "routine",
    normalRange: "",
    unit: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const r = await fetch(`${BASE}/api/lab-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "pending", orderedAt: new Date().toISOString() }),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lab-orders"] });
      toast({ title: "Lab order created", description: "Order sent to laboratory." });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Failed to create lab order.", variant: "destructive" }),
  });

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target?.value ?? e }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Patient Name *</Label>
          <Input value={form.patientName} onChange={set("patientName")} required />
        </div>
        <div className="space-y-1">
          <Label>Ordering Doctor *</Label>
          <Input value={form.doctorName} onChange={set("doctorName")} required />
        </div>
        <div className="space-y-1">
          <Label>Test Name *</Label>
          <Input value={form.testName} onChange={set("testName")} required placeholder="e.g. HbA1c, CBC" />
        </div>
        <div className="space-y-1">
          <Label>Test Code</Label>
          <Input value={form.testCode} onChange={set("testCode")} placeholder="e.g. HBA1C" className="font-mono uppercase" />
        </div>
        <div className="space-y-1">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[{ value: "routine", label: "Routine" }, { value: "urgent", label: "Urgent" }, { value: "stat", label: "STAT" }].map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Normal Range</Label>
          <Input value={form.normalRange} onChange={set("normalRange")} placeholder="e.g. 70-100" />
        </div>
        <div className="space-y-1">
          <Label>Unit</Label>
          <Input value={form.unit} onChange={set("unit")} placeholder="e.g. mg/dL, %" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending ? "Ordering…" : "Order Test"}
        </Button>
      </div>
    </form>
  );
}

export default function Laboratory() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const qc = useQueryClient();
  const { data, isLoading, refetch } = useLabOrders(filter || undefined);
  const { toast } = useToast();

  const orders: any[] = (data?.labOrders ?? [])
    .sort((a: any, b: any) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  const all = data?.labOrders ?? [];
  const critical = all.filter((o: any) => o.status === "critical").length;
  const pending = all.filter((o: any) => o.status === "pending").length;
  const inProg = all.filter((o: any) => o.status === "in-progress").length;
  const completed = all.filter((o: any) => o.status === "completed").length;

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, result, resultNotes }: any) => {
      const r = await fetch(`${BASE}/api/lab-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, result, resultNotes }),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lab-orders"] }),
    onError: () => toast({ title: "Error", description: "Failed to update.", variant: "destructive" }),
  });

  const PRIORITY_BADGE: Record<string, string> = {
    routine: "bg-muted text-muted-foreground",
    urgent: "bg-amber-500/10 text-amber-500",
    stat: "bg-red-500/10 text-red-500 font-bold",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Laboratory</h1>
          <p className="text-sm text-muted-foreground">{all.length} total orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-1.5" /> Refresh</Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Critical", count: critical, color: "text-red-500", dot: "bg-red-500" },
          { label: "Pending", count: pending, color: "text-amber-500", dot: "bg-amber-500" },
          { label: "In Progress", count: inProg, color: "text-sky-400", dot: "bg-sky-400" },
          { label: "Completed", count: completed, color: "text-muted-foreground", dot: "bg-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-3">
            <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", s.dot, s.label === "Critical" && critical > 0 ? "animate-pulse" : "")} />
            <div>
              <div className={cn("text-2xl font-bold", s.color)}>{s.count}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-4">
        {[
          { label: "All", value: "" },
          { label: "Critical", value: "critical" },
          { label: "Pending", value: "pending" },
          { label: "In Progress", value: "in-progress" },
          { label: "Completed", value: "completed" },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={cn("text-xs px-3 py-1.5 rounded-lg border transition-colors",
              filter === f.value ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50")}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Patient", "Test", "Category", "Priority", "Status", "Result", "Normal Range", "Ordered", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-muted-foreground text-sm">No lab orders found</td></tr>
              ) : (
                orders.map((o: any, i: number) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                      o.status === "critical" && "bg-red-500/5"
                    )}>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{o.patientName}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-foreground">{o.testName}</div>
                      {o.testCode && <div className="text-[10px] font-mono text-muted-foreground">{o.testCode}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.category}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", PRIORITY_BADGE[o.priority] ?? "bg-muted text-muted-foreground")}>
                        {o.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", STATUS_COLORS[o.status] ?? statusBadge(o.status))}>
                        {o.status === "critical" && "⚠ "}{o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {o.result ? (
                        <span className={cn("text-sm font-bold", o.status === "critical" ? "text-red-500" : "text-foreground")}>
                          {o.result} {o.unit}
                        </span>
                      ) : <span className="text-muted-foreground text-xs">Pending</span>}
                      {o.resultNotes && <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[150px] truncate">{o.resultNotes}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.normalRange ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(o.orderedAt)}</td>
                    <td className="px-4 py-3">
                      {o.status === "pending" && (
                        <Button size="sm" variant="outline" className="h-6 text-[10px] px-2"
                          onClick={() => updateStatus.mutate({ id: o.id, status: "in-progress" })}>
                          Start
                        </Button>
                      )}
                      {o.status === "in-progress" && (
                        <Button size="sm" className="h-6 text-[10px] px-2"
                          onClick={() => updateStatus.mutate({ id: o.id, status: "completed" })}>
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Complete
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Lab Order</DialogTitle></DialogHeader>
          <NewLabOrderForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
