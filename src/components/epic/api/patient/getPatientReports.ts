import axios from "axios";

export const getPatientReports = async (
	patientId: string,
	accessToken: string,
) => {
	try {
		const config = {
			method: "get",
			url: `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Observation?patient=${patientId}&category=laboratory`,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const reports = await axios(config);
		return reports.data.total === 0
			? []
			: reports.data.entry.map(formatReports);
	} catch (error) {
		console.error("Failed to get reports", (error as Error).message);
		return [];
	}
};

function formatReports(report: any) {
	return {
		id: report.resource?.id,
		status: report.resource?.status,
		category: report.resource?.category?.[0]?.text,
		code: report.resource?.code?.text,
		effectiveDateTime: report.resource?.effectiveDateTime,
		value: report.resource?.valueQuantity?.value,
		unit: report.resource?.valueQuantity?.unit,
		referenceRange: report.resource?.referenceRange?.[0]?.text,
	};
}
