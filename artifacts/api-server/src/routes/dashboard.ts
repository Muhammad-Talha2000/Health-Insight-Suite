import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, patientsTable, appointmentsTable, admissionsTable, bedsTable, labOrdersTable, invoicesTable, emergencyCasesTable } from "@workspace/db";
import {
  GetDashboardStatsResponse,
  GetBedSummaryResponse,
  GetRecentActivityResponse,
  GetRevenueChartResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

  const [totalPatientsResult] = await db.select({ count: sql<number>`count(*)` }).from(patientsTable);
  const [todayOpdResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointmentsTable)
    .where(sql`${appointmentsTable.scheduledAt} LIKE ${today + "%"}`);
  const [activeAdmissionsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(admissionsTable)
    .where(eq(admissionsTable.status, "active"));
  const [availableBedsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bedsTable)
    .where(eq(bedsTable.status, "available"));
  const [totalBedsResult] = await db.select({ count: sql<number>`count(*)` }).from(bedsTable);
  const [emergencyTodayResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(emergencyCasesTable)
    .where(sql`${emergencyCasesTable.arrivedAt}::date = ${today}::date`);
  const [pendingLabResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(labOrdersTable)
    .where(eq(labOrdersTable.status, "pending"));
  const [todayRevenueResult] = await db
    .select({ total: sql<number>`coalesce(sum(total), 0)` })
    .from(invoicesTable)
    .where(sql`${invoicesTable.createdAt}::date = ${today}::date AND ${invoicesTable.status} = 'paid'`);
  const [monthRevenueResult] = await db
    .select({ total: sql<number>`coalesce(sum(total), 0)` })
    .from(invoicesTable)
    .where(sql`${invoicesTable.createdAt}::date >= ${monthStart}::date AND ${invoicesTable.status} = 'paid'`);
  const [criticalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(emergencyCasesTable)
    .where(sql`${emergencyCasesTable.triage} = 'immediate' AND ${emergencyCasesTable.status} = 'active'`);

  const stats = {
    totalPatients: Number(totalPatientsResult?.count ?? 0),
    todayOpdCount: Number(todayOpdResult?.count ?? 0),
    activeAdmissions: Number(activeAdmissionsResult?.count ?? 0),
    availableBeds: Number(availableBedsResult?.count ?? 0),
    totalBeds: Number(totalBedsResult?.count ?? 0),
    emergencyCasesToday: Number(emergencyTodayResult?.count ?? 0),
    pendingLabOrders: Number(pendingLabResult?.count ?? 0),
    todayRevenue: Number(todayRevenueResult?.total ?? 0),
    monthRevenue: Number(monthRevenueResult?.total ?? 0),
    criticalPatients: Number(criticalResult?.count ?? 0),
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

router.get("/dashboard/bed-summary", async (_req, res): Promise<void> => {
  const beds = await db.select().from(bedsTable);

  const wardMap: Record<string, { ward: string; total: number; occupied: number; available: number; reserved: number }> = {};

  for (const bed of beds) {
    if (!wardMap[bed.ward]) {
      wardMap[bed.ward] = { ward: bed.ward, total: 0, occupied: 0, available: 0, reserved: 0 };
    }
    wardMap[bed.ward].total++;
    if (bed.status === "occupied") wardMap[bed.ward].occupied++;
    else if (bed.status === "available") wardMap[bed.ward].available++;
    else if (bed.status === "reserved") wardMap[bed.ward].reserved++;
  }

  res.json(GetBedSummaryResponse.parse({ summary: Object.values(wardMap) }));
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
  const recentPatients = await db.select().from(patientsTable).orderBy(sql`${patientsTable.createdAt} DESC`).limit(3);
  const recentAdmissions = await db.select().from(admissionsTable).orderBy(sql`${admissionsTable.createdAt} DESC`).limit(3);
  const recentEmergency = await db.select().from(emergencyCasesTable).orderBy(sql`${emergencyCasesTable.arrivedAt} DESC`).limit(3);
  const recentLab = await db.select().from(labOrdersTable).where(eq(labOrdersTable.status, "critical")).orderBy(sql`${labOrdersTable.orderedAt} DESC`).limit(2);

  const activities = [
    ...recentPatients.map((p, i) => ({
      id: i + 1,
      type: "registration",
      description: `New patient registered`,
      patientName: `${p.firstName} ${p.lastName}`,
      timestamp: p.createdAt.toISOString(),
      severity: "info",
    })),
    ...recentAdmissions.map((a, i) => ({
      id: 100 + i,
      type: "admission",
      description: `Admitted to ${a.ward}`,
      patientName: a.patientName,
      timestamp: a.createdAt.toISOString(),
      severity: "info",
    })),
    ...recentEmergency.map((e, i) => ({
      id: 200 + i,
      type: "emergency",
      description: `Emergency: ${e.chiefComplaint}`,
      patientName: e.patientName,
      timestamp: e.arrivedAt.toISOString(),
      severity: e.triage === "immediate" ? "critical" : e.triage === "very-urgent" ? "warning" : "info",
    })),
    ...recentLab.map((l, i) => ({
      id: 300 + i,
      type: "lab",
      description: `Critical lab result: ${l.testName}`,
      patientName: l.patientName,
      timestamp: l.orderedAt.toISOString(),
      severity: "critical",
    })),
  ];

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json(GetRecentActivityResponse.parse({ activities: activities.slice(0, 10) }));
});

router.get("/dashboard/revenue-chart", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      date: sql<string>`${invoicesTable.createdAt}::date::text`,
      revenue: sql<number>`coalesce(sum(${invoicesTable.total}), 0)`,
      invoiceCount: sql<number>`count(*)`,
    })
    .from(invoicesTable)
    .where(sql`${invoicesTable.createdAt} >= now() - interval '30 days'`)
    .groupBy(sql`${invoicesTable.createdAt}::date`)
    .orderBy(sql`${invoicesTable.createdAt}::date`);

  const data = rows.map((r) => ({
    date: r.date,
    revenue: Number(r.revenue),
    invoiceCount: Number(r.invoiceCount),
  }));

  res.json(GetRevenueChartResponse.parse({ data }));
});

export default router;
