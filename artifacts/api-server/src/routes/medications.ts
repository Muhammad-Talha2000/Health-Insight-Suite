import { Router, type IRouter } from "express";
import { ilike } from "drizzle-orm";
import { db, medicationsTable } from "@workspace/db";
import { ListMedicationsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/medications", async (req, res): Promise<void> => {
  const query = ListMedicationsQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { search, limit } = query.data;
  const rows = search
    ? await db.select().from(medicationsTable).where(ilike(medicationsTable.genericName, `%${search}%`)).limit(limit ?? 50)
    : await db.select().from(medicationsTable).limit(limit ?? 50);
  res.json({ medications: rows, total: rows.length });
});

export default router;
