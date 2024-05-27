import { Router } from "express";
import { config } from "dotenv";
import { healthCheck } from "../components/health";
import { getEpicPatientData } from "../components/epic/patient";
import { getCernerPatientData } from "../components/cerner/patient";

config();

const router = Router();

router.get("/", healthCheck);
router.get("/epic/patient", getEpicPatientData);
router.get("/cerner/patient", getCernerPatientData);

export default router;
