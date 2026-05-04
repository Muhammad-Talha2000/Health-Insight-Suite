import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const medicationsTable = pgTable("medications", {
  id: serial("id").primaryKey(),
  genericName: text("generic_name").notNull(),
  brandName: text("brand_name"),
  category: text("category").notNull(),
  dosageForms: text("dosage_forms").notNull(),
  strength: text("strength").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  unit: text("unit").notNull(),
  price: real("price").notNull(),
});

export const insertMedicationSchema = createInsertSchema(medicationsTable).omit({ id: true });
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medicationsTable.$inferSelect;
