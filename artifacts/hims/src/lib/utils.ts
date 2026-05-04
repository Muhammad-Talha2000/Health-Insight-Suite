import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function formatTime(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function calcAge(dob?: string | null): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function triageColor(triage: string): string {
  const map: Record<string, string> = {
    immediate: "bg-red-600 text-white border-red-600",
    "very-urgent": "bg-orange-500 text-white border-orange-500",
    urgent: "bg-yellow-400 text-black border-yellow-400",
    "semi-urgent": "bg-green-500 text-white border-green-500",
    "non-urgent": "bg-blue-500 text-white border-blue-500",
  };
  return map[triage] ?? "bg-muted text-muted-foreground border-border";
}

export function triageDot(triage: string): string {
  const map: Record<string, string> = {
    immediate: "bg-red-600",
    "very-urgent": "bg-orange-500",
    urgent: "bg-yellow-400",
    "semi-urgent": "bg-green-500",
    "non-urgent": "bg-blue-500",
  };
  return map[triage] ?? "bg-muted";
}

export function statusBadge(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    scheduled: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    waiting: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    "in-progress": "text-sky-400 bg-sky-400/10 border-sky-400/30",
    completed: "text-muted-foreground bg-muted/50 border-border",
    cancelled: "text-destructive bg-destructive/10 border-destructive/30",
    pending: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    paid: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    overdue: "text-red-500 bg-red-500/10 border-red-500/30",
    discharged: "text-muted-foreground bg-muted/50 border-border",
    critical: "text-red-500 bg-red-500/10 border-red-500/30",
    available: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    occupied: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    reserved: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    cleaning: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    admitted: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    transferred: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    deceased: "text-red-900 bg-red-900/10 border-red-900/30",
    "in-progress_lab": "text-sky-400 bg-sky-400/10 border-sky-400/30",
  };
  return map[status] ?? "text-muted-foreground bg-muted/50 border-border";
}

export function bedStatusBg(status: string): string {
  const map: Record<string, string> = {
    available: "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20",
    occupied: "bg-blue-500/15 border-blue-500/40",
    reserved: "bg-amber-500/10 border-amber-500/30",
    cleaning: "bg-purple-500/10 border-purple-500/30",
  };
  return map[status] ?? "bg-muted/50 border-border";
}
