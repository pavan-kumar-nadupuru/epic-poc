import axios, { AxiosError } from "axios";
import { config } from "dotenv";

config();

const cernerClientId = process.env.CERNER_CLIENT_ID;
const cernerClientSecret = process.env.CERNER_CLIENT_SECRET;
const cernerTokenUrl = process.env.CERNER_TOKEN_URL;

export const getCernerAccessToken = async () => {
	try {
		if (!cernerClientId || !cernerClientSecret || !cernerTokenUrl) {
			throw new Error("Missing required environment variables");
		}
		const authHeader = Buffer.from(
			`${cernerClientId}:${cernerClientSecret}`,
		).toString("base64");
		const response = await axios.post(
			cernerTokenUrl,
			new URLSearchParams({
				grant_type: "client_credentials",
				scope: "system/Observation.read system/Patient.read",
			}),
			{
				headers: {
					Authorization: `Basic ${authHeader}`,
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			},
		);
		return response.data.access_token;
	} catch (error: unknown) {
		if (error instanceof AxiosError) {
			console.error(error.response ? error.response.data : error.message);
		}
		console.error((error as Error).message);
		return {
			error: "Failed to get access token",
		};
	}
};
