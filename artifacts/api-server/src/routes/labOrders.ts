import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, labOrdersTable } from "@workspace/db";
import {
  ListLabOrdersQueryParams,
  CreateLabOrderBody,
  GetLabOrderParams,
  UpdateLabOrderParams,
  UpdateLabOrderBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/lab-orders", async (req, res): Promise<void> => {
  const query = ListLabOrdersQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { patientId, status } = query.data;
  const conditions = [];
  if (patientId) conditions.push(eq(labOrdersTable.patientId, patientId));
  if (status) conditions.push(eq(labOrdersTable.status, status));
  const rows = conditions.length > 0
    ? await db.select().from(labOrdersTable).where(and(...conditions)).orderBy(labOrdersTable.orderedAt)
    : await db.select().from(labOrdersTable).orderBy(labOrdersTable.orderedAt);
  res.json({ labOrders: rows, total: rows.length });
});

router.post("/lab-orders", async (req, res): Promise<void> => {
  const parsed = CreateLabOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [order] = await db.insert(labOrdersTable).values(parsed.data).returning();
  res.status(201).json(order);
});

router.get("/lab-orders/:id", async (req, res): Promise<void> => {
  const params = GetLabOrderParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [order] = await db.select().from(labOrdersTable).where(eq(labOrdersTable.id, params.data.id));
  if (!order) { res.status(404).json({ error: "Lab order not found" }); return; }
  res.json(order);
});

router.patch("/lab-orders/:id", async (req, res): Promise<void> => {
  const params = UpdateLabOrderParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateLabOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [order] = await db.update(labOrdersTable).set(parsed.data).where(eq(labOrdersTable.id, params.data.id)).returning();
  if (!order) { res.status(404).json({ error: "Lab order not found" }); return; }
  res.json(order);
});

export default router;
