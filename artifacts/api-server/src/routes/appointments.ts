import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, appointmentsTable } from "@workspace/db";
import {
  ListAppointmentsQueryParams,
  ListAppointmentsResponse,
  CreateAppointmentBody,
  GetAppointmentParams,
  GetAppointmentResponse,
  UpdateAppointmentParams,
  UpdateAppointmentBody,
  UpdateAppointmentResponse,
  CancelAppointmentParams,
  GetTodayQueueResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/appointments/queue/today", async (req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  const appointments = await db
    .select()
    .from(appointmentsTable)
    .where(
      and(
        sql`${appointmentsTable.scheduledAt} LIKE ${today + "%"}`,
        sql`${appointmentsTable.status} != 'cancelled'`
      )
    )
    .orderBy(appointmentsTable.tokenNumber);

  const total = appointments.length;
  res.json({ appointments, total });
});

router.get("/appointments", async (req, res): Promise<void> => {
  const query = ListAppointmentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  const { date, doctorId, status } = query.data;

  let baseQuery = db.select().from(appointmentsTable).$dynamic();
  const conditions = [];

  if (date) conditions.push(sql`${appointmentsTable.scheduledAt} LIKE ${date + "%"}`);
  if (doctorId) conditions.push(eq(appointmentsTable.doctorId, doctorId));
  if (status) conditions.push(eq(appointmentsTable.status, status));

  if (conditions.length > 0) baseQuery = baseQuery.where(and(...conditions));

  const appointments = await baseQuery.orderBy(appointmentsTable.tokenNumber);
  const total = appointments.length;
  res.json({ appointments, total });
});

router.post("/appointments", async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const todayCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointmentsTable)
    .where(sql`${appointmentsTable.scheduledAt} LIKE ${new Date().toISOString().split("T")[0] + "%"}`);
  const tokenNumber = Number(todayCount[0]?.count ?? 0) + 1;

  const [appointment] = await db
    .insert(appointmentsTable)
    .values({ ...parsed.data, tokenNumber })
    .returning();
  res.status(201).json(appointment);
});

router.get("/appointments/:id", async (req, res): Promise<void> => {
  const params = GetAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [appointment] = await db.select().from(appointmentsTable).where(eq(appointmentsTable.id, params.data.id));
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }
  res.json(appointment);
});

router.patch("/appointments/:id", async (req, res): Promise<void> => {
  const params = UpdateAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [appointment] = await db
    .update(appointmentsTable)
    .set(parsed.data)
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }
  res.json(appointment);
});

router.delete("/appointments/:id", async (req, res): Promise<void> => {
  const params = CancelAppointmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [appointment] = await db
    .update(appointmentsTable)
    .set({ status: "cancelled" })
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
