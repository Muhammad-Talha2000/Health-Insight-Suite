import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bedsTable = pgTable("beds", {
  id: serial("id").primaryKey(),
  bedNumber: text("bed_number").notNull(),
  ward: text("ward").notNull(),
  wardId: integer("ward_id").notNull(),
  floor: text("floor"),
  status: text("status").notNull().default("available"),
  patientId: integer("patient_id"),
  patientName: text("patient_name"),
  bedType: text("bed_type").notNull().default("general"),
});

export const insertBedSchema = createInsertSchema(bedsTable).omit({ id: true });
export type InsertBed = z.infer<typeof insertBedSchema>;
export type Bed = typeof bedsTable.$inferSelect;
