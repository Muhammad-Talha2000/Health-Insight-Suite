import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, bedsTable } from "@workspace/db";
import {
  ListBedsQueryParams,
  UpdateBedParams,
  UpdateBedBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/beds", async (req, res): Promise<void> => {
  const query = ListBedsQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { wardId, status } = query.data;
  const conditions = [];
  if (wardId) conditions.push(eq(bedsTable.wardId, wardId));
  if (status) conditions.push(eq(bedsTable.status, status));
  const rows = conditions.length > 0
    ? await db.select().from(bedsTable).where(and(...conditions)).orderBy(bedsTable.bedNumber)
    : await db.select().from(bedsTable).orderBy(bedsTable.wardId, bedsTable.bedNumber);
  res.json({ beds: rows, total: rows.length });
});

router.patch("/beds/:id", async (req, res): Promise<void> => {
  const params = UpdateBedParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateBedBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [bed] = await db.update(bedsTable).set(parsed.data).where(eq(bedsTable.id, params.data.id)).returning();
  if (!bed) { res.status(404).json({ error: "Bed not found" }); return; }
  res.json(bed);
});

export default router;
