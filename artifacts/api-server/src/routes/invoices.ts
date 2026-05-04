import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, invoicesTable } from "@workspace/db";
import {
  ListInvoicesQueryParams,
  CreateInvoiceBody,
  GetInvoiceParams,
  UpdateInvoiceParams,
  UpdateInvoiceBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateInvoiceNumber(): string {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${ymd}-${Math.floor(Math.random() * 9000) + 1000}`;
}

router.get("/invoices", async (req, res): Promise<void> => {
  const query = ListInvoicesQueryParams.safeParse(req.query);
  if (!query.success) { res.status(400).json({ error: query.error.message }); return; }
  const { patientId, status } = query.data;
  const conditions = [];
  if (patientId) conditions.push(eq(invoicesTable.patientId, patientId));
  if (status) conditions.push(eq(invoicesTable.status, status));
  const rows = conditions.length > 0
    ? await db.select().from(invoicesTable).where(and(...conditions)).orderBy(invoicesTable.createdAt)
    : await db.select().from(invoicesTable).orderBy(invoicesTable.createdAt);
  res.json({ invoices: rows, total: rows.length });
});

router.post("/invoices", async (req, res): Promise<void> => {
  const parsed = CreateInvoiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const invoiceNumber = generateInvoiceNumber();
  const [invoice] = await db.insert(invoicesTable).values({ ...parsed.data, invoiceNumber }).returning();
  res.status(201).json(invoice);
});

router.get("/invoices/:id", async (req, res): Promise<void> => {
  const params = GetInvoiceParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, params.data.id));
  if (!invoice) { res.status(404).json({ error: "Invoice not found" }); return; }
  res.json(invoice);
});

router.patch("/invoices/:id", async (req, res): Promise<void> => {
  const params = UpdateInvoiceParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateInvoiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [invoice] = await db.update(invoicesTable).set(parsed.data).where(eq(invoicesTable.id, params.data.id)).returning();
  if (!invoice) { res.status(404).json({ error: "Invoice not found" }); return; }
  res.json(invoice);
});

export default router;
