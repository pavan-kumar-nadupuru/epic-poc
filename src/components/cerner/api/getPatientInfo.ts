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
			url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Patient?family=${familyName}&birthdate=1990-09-15`,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const response = await axios.request(config);
		console.log(response.data);
		if (response.data.total === 0) {
			return null; // Handle no patient found
		}
		return formatPatientInfo(response.data.entry[0]);
	} catch (error) {
		console.error("Failed to search for patient", (error as Error).message);
		return null;
	}
};

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
