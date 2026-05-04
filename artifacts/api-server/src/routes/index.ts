import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientsRouter from "./patients";
import appointmentsRouter from "./appointments";
import consultationsRouter from "./consultations";
import admissionsRouter from "./admissions";
import bedsRouter from "./beds";
import labOrdersRouter from "./labOrders";
import prescriptionsRouter from "./prescriptions";
import medicationsRouter from "./medications";
import invoicesRouter from "./invoices";
import emergencyCasesRouter from "./emergencyCases";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(patientsRouter);
router.use(appointmentsRouter);
router.use(consultationsRouter);
router.use(admissionsRouter);
router.use(bedsRouter);
router.use(labOrdersRouter);
router.use(prescriptionsRouter);
router.use(medicationsRouter);
router.use(invoicesRouter);
router.use(emergencyCasesRouter);
router.use(dashboardRouter);

export default router;
