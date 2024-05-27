import axios from "axios";

export const getPatientInfo = async (
	familyName: string,
	birthdate: string,
	accessToken: string,
) => {
	try {
		const config = {
			method: "get",
			maxBodyLength: Number.POSITIVE_INFINITY,
			url: `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient?birthdate=${birthdate}&family=${familyName}`,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const response = await axios.request(config);
		if (response.data.total === 0) {
			return null; // Handle no patient found
		}
		return formatPatientInfo(response.data.entry[0]);
	} catch (error) {
		console.error("Failed to search for patient", (error as Error).message);
		return null;
	}
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function formatPatientInfo(patientData: any) {
	return {
		id: patientData.resource?.id,
		name: patientData.resource?.name?.[0]?.text || "No Name Provided",
		gender: patientData.resource?.gender,
		birthDate: patientData.resource?.birthDate,
		address:
			patientData.resource?.address?.[0]?.text || "No Address Provided",
	};
}
