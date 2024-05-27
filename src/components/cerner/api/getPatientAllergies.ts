import axios from "axios";

export const getPatientAllergies = async (
	patientId: string,
	accessToken: string,
) => {
	try {
		const config = {
			method: "get",
			url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/AllergyIntolerance?patient=${patientId}`,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const allergies = await axios(config);
		return allergies.data.total === 0
			? []
			: allergies.data.entry.map(formatAllergies);
	} catch (error) {
		console.error("Failed to get allergies", (error as Error).message);
		return [];
	}
};

function formatAllergies(allergy: any) {
	return {
		id: allergy.resource?.id,
		clinicalStatus: allergy.resource?.clinicalStatus?.coding?.[0]?.display,
		verificationStatus:
			allergy.resource?.verificationStatus?.coding?.[0]?.display,
		category: allergy.resource?.category?.join(", ") || "Not Specified",
		criticality: allergy.resource?.criticality,
		code: allergy.resource?.code?.text,
		onsetPeriod: JSON.stringify(allergy.resource?.onsetPeriod),
		reaction:
			allergy.resource?.reaction
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				?.map((r: any) => r.manifestation[0]?.text)
				.join(", ") || "No Reactions",
	};
}
