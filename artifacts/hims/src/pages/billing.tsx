import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Receipt, DollarSign, AlertTriangle, CheckCircle2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatCurrency, formatDate, statusBadge } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useInvoices(status?: string) {
  return useQuery({
    queryKey: ["invoices", status],
    queryFn: () =>
      fetch(`${BASE}/api/invoices${status ? `?status=${status}` : ""}`).then((r) => r.json()),
    refetchInterval: 30000,
  });
}

function NewInvoiceForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [items, setItems] = useState([{ name: "OPD Consultation", price: 2000 }]);
  const [form, setForm] = useState({
    patientName: "",
    discount: 0,
    paymentMethod: "cash",
    status: "pending",
  });

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal - Number(form.discount) + tax;

  const addItem = () => setItems((prev) => [...prev, { name: "", price: 0 }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, key: keyof typeof items[0], val: any) =>
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [key]: key === "price" ? Number(val) : val } : item));

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const r = await fetch(`${BASE}/api/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice created", description: "Invoice saved successfully." });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Failed to create invoice.", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      patientName: form.patientName,
      subtotal,
      discount: Number(form.discount),
      tax,
      total,
      status: form.status,
      paymentMethod: form.status === "paid" ? form.paymentMethod : undefined,
      paidAt: form.status === "paid" ? new Date().toISOString() : undefined,
      items: JSON.stringify(items),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Patient Name *</Label>
        <Input value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} required />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Line Items</Label>
          <Button type="button" variant="outline" size="sm" className="h-6 text-xs" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Service name" className="flex-1" />
              <Input type="number" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} placeholder="Price" className="w-28" min="0" />
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Discount (PKR)</Label>
          <Input type="number" value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) }))} min="0" />
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {form.status === "paid" && (
          <div className="space-y-1 col-span-2">
            <Label>Payment Method</Label>
            <Select value={form.paymentMethod} onValueChange={(v) => setForm((f) => ({ ...f, paymentMethod: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-1.5 text-sm border border-border">
        <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>- {formatCurrency(Number(form.discount))}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Tax (5%)</span><span>{formatCurrency(tax)}</span></div>
        <div className="flex justify-between font-bold text-foreground text-base border-t border-border pt-1.5"><span>Total</span><span>{formatCurrency(total)}</span></div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating…" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}

export default function Billing() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const qc = useQueryClient();
  const { data, isLoading } = useInvoices(filter || undefined);
  const { toast } = useToast();

  const invoices = data?.invoices ?? [];

  const paid = invoices.filter((i: any) => i.status === "paid");
  const pending = invoices.filter((i: any) => i.status === "pending");
  const overdue = invoices.filter((i: any) => i.status === "overdue");
  const totalRevenue = paid.reduce((s: number, i: any) => s + Number(i.total), 0);

  const markPaid = useMutation({
    mutationFn: async (id: number) => {
      const r = await fetch(`${BASE}/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", paymentMethod: "cash", paidAt: new Date().toISOString() }),
      });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
    onError: () => toast({ title: "Error", description: "Failed to mark as paid.", variant: "destructive" }),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Billing & Payments</h1>
          <p className="text-sm text-muted-foreground">{invoices.length} invoices</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending", value: pending.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Overdue", value: overdue.length, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Paid", value: paid.length, icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", s.bg)}>
              <s.icon className={cn("w-4.5 h-4.5", s.color)} />
            </div>
            <div className={cn("text-xl font-bold", s.color)}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "pending" },
          { label: "Paid", value: "paid" },
          { label: "Overdue", value: "overdue" },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={cn("text-xs px-3 py-1.5 rounded-lg border transition-colors",
              filter === f.value ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50")}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Invoice #", "Patient", "Items", "Subtotal", "Discount", "Tax", "Total", "Status", "Payment", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 11 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-muted-foreground text-sm">No invoices found</td></tr>
              ) : (
                invoices.map((inv: any, i: number) => {
                  let itemsList: any[] = [];
                  try { itemsList = JSON.parse(inv.items ?? "[]"); } catch {}
                  return (
                    <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                        inv.status === "overdue" && "bg-red-500/5"
                      )}>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-muted-foreground">{inv.invoiceNumber}</code>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{inv.patientName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px] truncate">
                        {itemsList.map((it: any) => it.name).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatCurrency(inv.subtotal)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatCurrency(inv.discount)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatCurrency(inv.tax)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-foreground">{formatCurrency(inv.total)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", statusBadge(inv.status))}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{inv.paymentMethod ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(inv.paidAt || inv.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {(inv.status === "pending" || inv.status === "overdue") && (
                          <Button size="sm" variant="outline" className="h-6 text-[10px] px-2"
                            onClick={() => markPaid.mutate(inv.id)}>
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
          <NewInvoiceForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
