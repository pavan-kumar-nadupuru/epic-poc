import axios, { AxiosError } from "axios";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";

config();

const veradigmClientId = process.env.VERADIGM_CLIENT_ID;
const veradigmPrivateKeyPath =
	process.env.VERADIGM_PRIVATE_KEY_PATH ||
	`${__dirname}/../../certificates/privatekey.pem`;
const veradigmTokenUrl =
	"https://fhir.fhirpoint.open.allscripts.com/fhirroute/authorizationV2/PEHRsandDEV/connect/token";

const generateJwt = (): string => {
	const privateKey = fs.readFileSync(veradigmPrivateKeyPath, "utf8");
	const now = Math.floor(Date.now() / 1000);
	const exp = now + 300; // 5 minutes in the future

	const payload = {
		iss: veradigmClientId,
		sub: veradigmClientId,
		aud: veradigmTokenUrl,
		exp,
	};

	const token = jwt.sign(payload, privateKey, { algorithm: "RS384" });
	return token;
};

export const getVeradigmAccessToken = async () => {
	try {
		if (!veradigmClientId || !veradigmTokenUrl) {
			throw new Error("Missing required environment variables");
		}

		const clientAssertion = generateJwt();

		const response = await axios.post(
			veradigmTokenUrl,
			new URLSearchParams({
				grant_type: "client_credentials",
				client_assertion_type:
					"urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
				client_assertion: clientAssertion,
				scope: "system/*.read", // Confirm this is the correct scope
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
			},
		);
		return response.data.access_token;
	} catch (error: unknown) {
		if (error instanceof AxiosError) {
			console.error(error.response ? error.response.data : error.message);
		} else {
			console.error((error as Error).message);
		}
		return {
			error: "Failed to get access token",
		};
	}
};
