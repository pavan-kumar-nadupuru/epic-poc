import { Router } from "express";
import { config } from "dotenv";
import { healthCheck, hostJwks } from "../components/health";
import { getEpicPatientData } from "../components/epic/patient";
import { getCernerPatientData } from "../components/cerner/patient";
import { getVeradigmPatientData } from "../components/veradigm/patient";

config();

const router = Router();

router.get("/", healthCheck);
router.get("/epic/patient", getEpicPatientData);
router.get("/cerner/patient", getCernerPatientData);
router.get("/veradigm/patient", getVeradigmPatientData);
router.get("/.well-known/jwks.json", hostJwks);

export default router;
