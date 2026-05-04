import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, admissionsTable } from "@workspace/db";
import {
  ListAdmissionsQueryParams,
  CreateAdmissionBody,
  GetAdmissionParams,
  UpdateAdmissionParams,
  UpdateAdmissionBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admissions", async (req, res): Promise<void> => {
  const query = ListAdmissionsQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { status } = query.data;
  const conditions = [];
  if (status) conditions.push(eq(admissionsTable.status, status));
  const rows = conditions.length > 0
    ? await db.select().from(admissionsTable).where(and(...conditions)).orderBy(admissionsTable.createdAt)
    : await db.select().from(admissionsTable).orderBy(admissionsTable.createdAt);
  res.json({ admissions: rows, total: rows.length });
});

router.post("/admissions", async (req, res): Promise<void> => {
  const parsed = CreateAdmissionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [admission] = await db.insert(admissionsTable).values(parsed.data).returning();
  res.status(201).json(admission);
});

router.get("/admissions/:id", async (req, res): Promise<void> => {
  const params = GetAdmissionParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [admission] = await db.select().from(admissionsTable).where(eq(admissionsTable.id, params.data.id));
  if (!admission) { res.status(404).json({ error: "Admission not found" }); return; }
  res.json(admission);
});

router.patch("/admissions/:id", async (req, res): Promise<void> => {
  const params = UpdateAdmissionParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateAdmissionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [admission] = await db.update(admissionsTable).set(parsed.data).where(eq(admissionsTable.id, params.data.id)).returning();
  if (!admission) { res.status(404).json({ error: "Admission not found" }); return; }
  res.json(admission);
});

export default router;
