import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  patientId: integer("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  admissionId: integer("admission_id"),
  consultationId: integer("consultation_id"),
  subtotal: real("subtotal").notNull(),
  discount: real("discount").notNull().default(0),
  tax: real("tax").notNull().default(0),
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  items: text("items").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: text("paid_at"),
});

export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({ id: true, invoiceNumber: true, createdAt: true });
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoicesTable.$inferSelect;
