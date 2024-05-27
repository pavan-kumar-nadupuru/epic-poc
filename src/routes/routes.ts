import { Router } from "express";
import { config } from "dotenv";
import { healthCheck } from "../components/health";
import { getCompletePatientData } from "../components/epic/patient";

config();

const router = Router();

router.get("/", healthCheck);
router.get("/epic/patient", getCompletePatientData);

export default router;
