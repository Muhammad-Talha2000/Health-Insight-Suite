import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Search, User, Phone, Calendar, Droplets, AlertCircle, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, calcAge, formatDate, statusBadge } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function usePatients(search: string) {
  return useQuery({
    queryKey: ["patients", search],
    queryFn: () =>
      fetch(`${BASE}/api/patients?search=${encodeURIComponent(search)}&limit=50&offset=0`)
        .then((r) => r.json()),
    placeholderData: (prev) => prev,
  });
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function PatientForm({ onClose, initial }: { onClose: () => void; initial?: any }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    dateOfBirth: initial?.dateOfBirth ?? "",
    gender: initial?.gender ?? "male",
    bloodGroup: initial?.bloodGroup ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    address: initial?.address ?? "",
    allergies: initial?.allergies ?? "",
    chronicConditions: initial?.chronicConditions ?? "",
    emergencyContactName: initial?.emergencyContactName ?? "",
    emergencyContactPhone: initial?.emergencyContactPhone ?? "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const url = initial ? `${BASE}/api/patients/${initial.id}` : `${BASE}/api/patients`;
      const method = initial ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error("Failed to save patient");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: initial ? "Patient updated" : "Patient registered", description: "Record saved successfully." });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Failed to save patient.", variant: "destructive" }),
  });

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target?.value ?? e }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>First Name *</Label>
          <Input value={form.firstName} onChange={set("firstName")} required placeholder="Ahmad" />
        </div>
        <div className="space-y-1">
          <Label>Last Name *</Label>
          <Input value={form.lastName} onChange={set("lastName")} required placeholder="Hassan" />
        </div>
        <div className="space-y-1">
          <Label>Date of Birth *</Label>
          <Input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} required />
        </div>
        <div className="space-y-1">
          <Label>Gender *</Label>
          <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Phone *</Label>
          <Input value={form.phone} onChange={set("phone")} required placeholder="+92-300-0000000" />
        </div>
        <div className="space-y-1">
          <Label>Blood Group</Label>
          <Select value={form.bloodGroup} onValueChange={(v) => setForm((f) => ({ ...f, bloodGroup: v }))}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={set("email")} placeholder="patient@email.com" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={set("address")} placeholder="Full address" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Allergies</Label>
          <Input value={form.allergies} onChange={set("allergies")} placeholder="e.g. Penicillin, NSAIDs" />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Chronic Conditions</Label>
          <Textarea value={form.chronicConditions} onChange={set("chronicConditions")} placeholder="e.g. Type 2 Diabetes, Hypertension" rows={2} />
        </div>
        <div className="space-y-1">
          <Label>Emergency Contact Name</Label>
          <Input value={form.emergencyContactName} onChange={set("emergencyContactName")} />
        </div>
        <div className="space-y-1">
          <Label>Emergency Contact Phone</Label>
          <Input value={form.emergencyContactPhone} onChange={set("emergencyContactPhone")} />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : initial ? "Update Patient" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
}

function PatientDetail({ patient, onClose }: { patient: any; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div>
          <div className="font-bold text-foreground">{patient.firstName} {patient.lastName}</div>
          <div className="text-sm text-muted-foreground">{patient.mrNumber}</div>
          <div className="text-xs text-muted-foreground">{calcAge(patient.dateOfBirth)} yrs · {patient.gender} · {patient.bloodGroup}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: "Phone", value: patient.phone },
          { label: "Email", value: patient.email || "—" },
          { label: "DOB", value: formatDate(patient.dateOfBirth) },
          { label: "Address", value: patient.address || "—" },
        ].map((f) => (
          <div key={f.label} className="bg-muted/50 rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{f.label}</div>
            <div className="text-foreground font-medium text-xs">{f.value}</div>
          </div>
        ))}
      </div>

      {(patient.allergies || patient.chronicConditions) && (
        <div className="space-y-2">
          {patient.allergies && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-red-500 mb-0.5">ALLERGIES</div>
                <div className="text-xs text-foreground">{patient.allergies}</div>
              </div>
            </div>
          )}
          {patient.chronicConditions && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="text-xs font-semibold text-amber-500 mb-0.5">CHRONIC CONDITIONS</div>
              <div className="text-xs text-foreground">{patient.chronicConditions}</div>
            </div>
          )}
        </div>
      )}

      {(patient.emergencyContactName || patient.emergencyContactPhone) && (
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Emergency Contact</div>
          <div className="text-sm text-foreground font-medium">{patient.emergencyContactName}</div>
          <div className="text-xs text-muted-foreground">{patient.emergencyContactPhone}</div>
        </div>
      )}

      <Button className="w-full" variant="outline" onClick={onClose}>Close</Button>
    </div>
  );
}

export default function Patients() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = usePatients(debouncedSearch);
  const patients = data?.patients ?? [];

  const handleSearch = (v: string) => {
    setSearch(v);
    clearTimeout((window as any)._searchTimer);
    (window as any)._searchTimer = setTimeout(() => setDebouncedSearch(v), 300);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Patient Registry</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} total patients</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Register Patient
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, MR#, phone…"
          className="pl-9"
        />
        {search && (
          <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Patient</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">MR #</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Age / Gender</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Blood</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Phone</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden xl:table-cell">Conditions</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                    {search ? "No patients found matching your search" : "No patients registered yet"}
                  </td>
                </tr>
              ) : (
                patients.map((p: any, i: number) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelected(p)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{p.firstName} {p.lastName}</div>
                          {p.allergies && <div className="text-[10px] text-red-500">⚠ Allergies</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <code className="text-xs text-muted-foreground font-mono">{p.mrNumber}</code>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-foreground">
                      {calcAge(p.dateOfBirth)} yrs <span className="text-muted-foreground capitalize">· {p.gender}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cn("text-xs px-2 py-0.5 rounded font-mono font-bold",
                        p.bloodGroup?.includes("-") ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        {p.bloodGroup ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted-foreground">{p.phone}</td>
                    <td className="px-4 py-3 hidden xl:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                      {p.chronicConditions ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader><DialogTitle>Register New Patient</DialogTitle></DialogHeader>
          <PatientForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Patient Record</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <PatientDetail patient={selected} onClose={() => setSelected(null)} />
              <Button variant="outline" className="w-full" onClick={() => { setEditing(selected); setSelected(null); }}>
                Edit Record
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader><DialogTitle>Edit Patient Record</DialogTitle></DialogHeader>
          {editing && <PatientForm onClose={() => setEditing(null)} initial={editing} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
