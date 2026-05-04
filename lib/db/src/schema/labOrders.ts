import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const labOrdersTable = pgTable("lab_orders", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  doctorId: integer("doctor_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  consultationId: integer("consultation_id"),
  testName: text("test_name").notNull(),
  testCode: text("test_code"),
  category: text("category").notNull(),
  priority: text("priority").notNull().default("routine"),
  status: text("status").notNull().default("pending"),
  result: text("result"),
  normalRange: text("normal_range"),
  unit: text("unit"),
  resultNotes: text("result_notes"),
  orderedAt: timestamp("ordered_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: text("completed_at"),
});

export const insertLabOrderSchema = createInsertSchema(labOrdersTable).omit({ id: true, orderedAt: true });
export type InsertLabOrder = z.infer<typeof insertLabOrderSchema>;
export type LabOrder = typeof labOrdersTable.$inferSelect;
