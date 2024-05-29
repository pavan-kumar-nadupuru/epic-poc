import axios from "axios";

export const getPatientMedicalHistory = async (
	patientId: string,
	accessToken: string,
) => {
	try {
		const config = {
			method: "get",
			url: `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Condition?category=medical-history&patient=${patientId}`,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const medicalHistory = await axios(config);
		return medicalHistory.data.total === 0
			? []
			: medicalHistory.data.entry.map(formatMedicalHistory);
	} catch (error) {
		console.error(
			"Failed to get medical history",
			(error as Error).message,
		);
		return [];
	}
};

function formatMedicalHistory(condition) {
	return {
		id: condition.resource?.id,
		verificationStatus: condition.resource?.verificationStatus?.text,
		category: condition.resource?.category?.[0]?.text,
		code: condition.resource?.code?.text,
		subject: condition.resource?.subject?.display,
	};
}
