import { Router, type IRouter } from "express";
import { eq, ilike, or, sql } from "drizzle-orm";
import { db, patientsTable } from "@workspace/db";
import {
  ListPatientsQueryParams,
  ListPatientsResponse,
  CreatePatientBody,
  GetPatientParams,
  GetPatientResponse,
  UpdatePatientParams,
  UpdatePatientBody,
  UpdatePatientResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateMrNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `MR-${year}-${rand}`;
}

router.get("/patients", async (req, res): Promise<void> => {
  const query = ListPatientsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { search, limit, offset } = query.data;

  let patients;
  let total;

  if (search) {
    const searchLike = `%${search}%`;
    patients = await db
      .select()
      .from(patientsTable)
      .where(
        or(
          ilike(patientsTable.firstName, searchLike),
          ilike(patientsTable.lastName, searchLike),
          ilike(patientsTable.mrNumber, searchLike),
          ilike(patientsTable.phone, searchLike)
        )
      )
      .limit(limit)
      .offset(offset);
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(patientsTable)
      .where(
        or(
          ilike(patientsTable.firstName, searchLike),
          ilike(patientsTable.lastName, searchLike),
          ilike(patientsTable.mrNumber, searchLike),
          ilike(patientsTable.phone, searchLike)
        )
      );
    total = Number(countResult[0]?.count ?? 0);
  } else {
    patients = await db.select().from(patientsTable).limit(limit).offset(offset).orderBy(patientsTable.createdAt);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(patientsTable);
    total = Number(countResult[0]?.count ?? 0);
  }

  res.json({ patients, total });
});

router.post("/patients", async (req, res): Promise<void> => {
  const parsed = CreatePatientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const mrNumber = generateMrNumber();
  const [patient] = await db.insert(patientsTable).values({ ...parsed.data, mrNumber }).returning();
  res.status(201).json(patient);
});

router.get("/patients/:id", async (req, res): Promise<void> => {
  const params = GetPatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [patient] = await db.select().from(patientsTable).where(eq(patientsTable.id, params.data.id));
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(patient);
});

router.patch("/patients/:id", async (req, res): Promise<void> => {
  const params = UpdatePatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePatientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [patient] = await db
    .update(patientsTable)
    .set(parsed.data)
    .where(eq(patientsTable.id, params.data.id))
    .returning();
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(patient);
});

export default router;
