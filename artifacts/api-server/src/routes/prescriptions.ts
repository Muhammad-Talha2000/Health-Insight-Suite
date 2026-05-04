import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, prescriptionsTable } from "@workspace/db";
import {
  ListPrescriptionsQueryParams,
  CreatePrescriptionBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/prescriptions", async (req, res): Promise<void> => {
  const query = ListPrescriptionsQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { patientId, consultationId } = query.data;
  const conditions = [];
  if (patientId) conditions.push(eq(prescriptionsTable.patientId, patientId));
  if (consultationId) conditions.push(eq(prescriptionsTable.consultationId, consultationId));
  const rows = conditions.length > 0
    ? await db.select().from(prescriptionsTable).where(and(...conditions)).orderBy(prescriptionsTable.createdAt)
    : await db.select().from(prescriptionsTable).orderBy(prescriptionsTable.createdAt);
  res.json({ prescriptions: rows, total: rows.length });
});

router.post("/prescriptions", async (req, res): Promise<void> => {
  const parsed = CreatePrescriptionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [prescription] = await db.insert(prescriptionsTable).values(parsed.data).returning();
  res.status(201).json(prescription);
});

export default router;
