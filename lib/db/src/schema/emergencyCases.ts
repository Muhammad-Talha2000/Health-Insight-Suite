import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const emergencyCasesTable = pgTable("emergency_cases", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id"),
  patientName: text("patient_name").notNull(),
  age: integer("age"),
  gender: text("gender").notNull(),
  chiefComplaint: text("chief_complaint").notNull(),
  triage: text("triage").notNull(),
  bpSystolic: integer("bp_systolic"),
  bpDiastolic: integer("bp_diastolic"),
  pulse: integer("pulse"),
  temperature: real("temperature"),
  spo2: integer("spo2"),
  assignedDoctorId: integer("assigned_doctor_id"),
  assignedDoctorName: text("assigned_doctor_name"),
  status: text("status").notNull().default("active"),
  disposition: text("disposition"),
  notes: text("notes"),
  arrivedAt: timestamp("arrived_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: text("resolved_at"),
});

export const insertEmergencyCaseSchema = createInsertSchema(emergencyCasesTable).omit({ id: true, arrivedAt: true });
export type InsertEmergencyCase = z.infer<typeof insertEmergencyCaseSchema>;
export type EmergencyCase = typeof emergencyCasesTable.$inferSelect;
