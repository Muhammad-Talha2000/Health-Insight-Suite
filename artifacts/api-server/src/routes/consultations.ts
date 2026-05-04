import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, consultationsTable } from "@workspace/db";
import {
  ListConsultationsQueryParams,
  CreateConsultationBody,
  GetConsultationParams,
  UpdateConsultationParams,
  UpdateConsultationBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/consultations", async (req, res): Promise<void> => {
  const query = ListConsultationsQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { patientId, doctorId } = query.data;
  const conditions = [];
  if (patientId) conditions.push(eq(consultationsTable.patientId, patientId));
  if (doctorId) conditions.push(eq(consultationsTable.doctorId, doctorId));
  const rows = conditions.length > 0
    ? await db.select().from(consultationsTable).where(and(...conditions)).orderBy(consultationsTable.createdAt)
    : await db.select().from(consultationsTable).orderBy(consultationsTable.createdAt);
  res.json({ consultations: rows, total: rows.length });
});

router.post("/consultations", async (req, res): Promise<void> => {
  const parsed = CreateConsultationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [consultation] = await db.insert(consultationsTable).values(parsed.data).returning();
  res.status(201).json(consultation);
});

router.get("/consultations/:id", async (req, res): Promise<void> => {
  const params = GetConsultationParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [consultation] = await db.select().from(consultationsTable).where(eq(consultationsTable.id, params.data.id));
  if (!consultation) { res.status(404).json({ error: "Consultation not found" }); return; }
  res.json(consultation);
});

router.patch("/consultations/:id", async (req, res): Promise<void> => {
  const params = UpdateConsultationParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateConsultationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [consultation] = await db.update(consultationsTable).set(parsed.data).where(eq(consultationsTable.id, params.data.id)).returning();
  if (!consultation) { res.status(404).json({ error: "Consultation not found" }); return; }
  res.json(consultation);
});

export default router;
