import axios from "axios";

export const getPatientConditions = async (
	patientId: string,
	accessToken: string,
) => {
	try {
		const config = {
			method: "get",
			url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Condition?patient=${patientId}`,
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		};
		const response = await axios(config);
		return response.data.total === 0
			? []
			: response.data.entry.map(formatCondition);
	} catch (error) {
		if (error)
			console.error("Failed to get conditions", (error as Error).message);
		return [];
	}
};

function formatCondition(condition: any) {
	return {
		id: condition.resource.id,
		clinicalStatus: condition.resource.clinicalStatus?.text,
		verificationStatus: condition.resource.verificationStatus?.text,
		category:
			condition.resource.category
				.map((cat: any) => cat.text)
				.join(", ") || "Not Specified",
		code: condition.resource.code?.text,
		onsetDateTime: condition.resource.onsetDateTime,
		recordedDate: condition.resource.recordedDate,
		recorder: condition.resource.recorder?.display || "Unknown",
		patient: condition.resource.subject?.display,
	};
}
