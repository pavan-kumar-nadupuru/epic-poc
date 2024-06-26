import axios from "axios";
import type { Request, Response } from "express";
import { getEpicAccessToken } from "../../helpers/getEpicAccessToken";
import { getPatientAllergies } from "./api/getPatientAllergies";
import { getPatientAppointments } from "./api/getPatientAppointments";
import { getPatientInfo } from "./api/getPatientInfo";
import { getPatientReports } from "./api/getPatientReports";
import { getPatientVitals } from "./api/getPatientVitals";
import { getPatientConditions } from "./api/getPatientConditions";

export const getEpicPatientData = async (req: Request, res: Response) => {
	try {
		const { familyName, birthDate } = req.query;
		const accessToken = (await getEpicAccessToken()) as string;

		if (!familyName || !birthDate) {
			throw new Error("Missing required query parameters");
		}
		if (!accessToken) {
			throw new Error("Could not get access token from epic");
		}
		const patient = await getPatientInfo(
			familyName as string,
			birthDate as string,
			accessToken,
		);
		const patientId: string = patient?.id;
		const allergies = await getPatientAllergies(patientId, accessToken);
		const vitals = await getPatientVitals(patientId, accessToken);
		const appointments = await getPatientAppointments(
			patientId,
			accessToken,
		);
		const reports = await getPatientReports(patientId, accessToken);
		const patientConditions = await getPatientConditions(
			patientId,
			accessToken,
		);
		res.json({
			patient,
			allergies,
			vitals,
			appointments,
			reports,
			patientConditions,
		});
	} catch (error) {
		console.error("Failed to search for patient", error);
		res.status(500).send("Failed to search for patient");
	}
};
