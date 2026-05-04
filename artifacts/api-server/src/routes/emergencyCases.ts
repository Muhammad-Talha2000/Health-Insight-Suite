import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, emergencyCasesTable } from "@workspace/db";
import {
  ListEmergencyCasesQueryParams,
  CreateEmergencyCaseBody,
  GetEmergencyCaseParams,
  UpdateEmergencyCaseParams,
  UpdateEmergencyCaseBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/emergency-cases", async (req, res): Promise<void> => {
  const query = ListEmergencyCasesQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { triage, status } = query.data;
  const conditions = [];
  if (triage) conditions.push(eq(emergencyCasesTable.triage, triage));
  if (status) conditions.push(eq(emergencyCasesTable.status, status));
  const rows = conditions.length > 0
    ? await db.select().from(emergencyCasesTable).where(and(...conditions)).orderBy(emergencyCasesTable.arrivedAt)
    : await db.select().from(emergencyCasesTable).orderBy(emergencyCasesTable.arrivedAt);
  res.json({ emergencyCases: rows, total: rows.length });
});

router.post("/emergency-cases", async (req, res): Promise<void> => {
  const parsed = CreateEmergencyCaseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [ec] = await db.insert(emergencyCasesTable).values(parsed.data).returning();
  res.status(201).json(ec);
});

router.get("/emergency-cases/:id", async (req, res): Promise<void> => {
  const params = GetEmergencyCaseParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [ec] = await db.select().from(emergencyCasesTable).where(eq(emergencyCasesTable.id, params.data.id));
  if (!ec) { res.status(404).json({ error: "Emergency case not found" }); return; }
  res.json(ec);
});

router.patch("/emergency-cases/:id", async (req, res): Promise<void> => {
  const params = UpdateEmergencyCaseParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateEmergencyCaseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [ec] = await db.update(emergencyCasesTable).set(parsed.data).where(eq(emergencyCasesTable.id, params.data.id)).returning();
  if (!ec) { res.status(404).json({ error: "Emergency case not found" }); return; }
  res.json(ec);
});

export default router;
