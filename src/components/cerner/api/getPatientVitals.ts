import axios from "axios";

export const getPatientVitals = async (
	patientId: string,
	accessToken: string,
) => {
	try {
		const config = {
			method: "get",
			url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Observation?patient=${patientId}&category=vital-signs`,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const vitals = await axios(config);
		return vitals.data.total === 0
			? []
			: vitals.data.entry.map(formatVitals);
	} catch (error) {
		console.error("Failed to get vitals", (error as Error).message);
		return [];
	}
};

function formatVitals(vital: any) {
	const vitalType = vital.resource?.code?.coding?.[0]?.code;
	switch (vitalType) {
		case "5": // Blood pressure
			return {
				Type: vital.resource?.code?.coding?.[0]?.display,
				Date: vital.resource?.effectiveDateTime,
				systolic:
					vital.resource?.component?.[0]?.valueQuantity?.value ||
					null,
				diastolic:
					vital.resource?.component?.[1]?.valueQuantity?.value ||
					null,
				heartRate: null,
				temperature: null,
			};
		case "8": // Heart rate
			return {
				Type: vital.resource?.code?.coding?.[0]?.display,
				Date: vital.resource?.effectiveDateTime,
				heartRate: vital.resource?.valueQuantity?.value,
				temperature: null,
			};
		case "6": // Body temperature
			return {
				Type: vital.resource?.code?.coding?.[0]?.display,
				Date: vital.resource?.effectiveDateTime,
				temperature: vital.resource?.valueQuantity?.value,
			};
		default:
			return {
				Type: "Unknown",
				Date: vital.resource?.effectiveDateTime,
			};
	}
}
