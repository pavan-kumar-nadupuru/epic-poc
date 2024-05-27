// https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Appointment?patient=12724066&date=ge2020-01-01T22:22:16.270Z
import axios from "axios";

export const getPatientAppointments = async (
	patientId: string,
	accessToken: string,
) => {
	try {
		const config = {
			method: "get",
			url: `https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Appointment?patient=${patientId}&date=ge2024-05-01T00:00:00.0Z`,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		const appointments = await axios(config);
		return appointments.data.total === 0
			? []
			: appointments.data.entry.map(formatAppointments);
	} catch (error) {
		console.error("Failed to get appointments", (error as Error).message);
		return [];
	}
};

function formatAppointments(appointment: any) {
	return {
		id: appointment.resource?.id,
		status: appointment.resource?.status,
		description: appointment.resource?.description,
		start: appointment.resource?.start,
		end: appointment.resource?.end,
		created: appointment.resource?.created,
		lastModified: appointment.resource?.meta?.lastUpdated,
		serviceType:
			appointment.resource?.serviceType
				?.map((st: any) => st.text)
				.join(", ") || "Not Specified",
		specialty:
			appointment.resource?.specialty
				?.map((sp: any) => sp.text)
				.join(", ") || "Not Specified",
		appointmentType:
			appointment.resource?.appointmentType?.text || "Not Specified",
		reasonCode:
			appointment.resource?.reasonCode
				?.map((rc: any) => rc.text)
				.join(", ") || "Not Specified",
		participant:
			appointment.resource?.participant?.map((p: any) => ({
				type:
					p.type?.map((t: any) => t.text).join(", ") ||
					"Not Specified",
				actor: p.actor?.display || "Unknown",
				required: p.required || "Unknown",
				status: p.status || "Unknown",
			})) || [],
		comment: appointment.resource?.comment || "No comments",
	};
}
