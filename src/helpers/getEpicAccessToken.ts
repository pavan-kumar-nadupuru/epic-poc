import fs from "node:fs";
import axios, { AxiosError } from "axios";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

config();

const epicClientId = process.env.EPIC_CLIENT_ID;
const epicTokenUrl = process.env.EPIC_TOKEN_URL;

export const getEpicAccessToken = async () => {
	try {
		const privateKey = fs.readFileSync(
			`${__dirname}/../../certificates/privatekey.pem`,
			"utf8",
		);
		if (!privateKey || !epicClientId || !epicTokenUrl) {
			throw new Error("Missing required environment variables");
		}
		const header = {
			alg: "RS384",
			typ: "JWT",
		};
		const now = Math.floor(Date.now() / 1000);
		const exp = now + 300;
		const payload = {
			iss: epicClientId,
			sub: epicClientId,
			aud: epicTokenUrl,
			jti: uuidv4(),
			exp,
			nbf: now,
			iat: now,
		};

		const token = jwt.sign(payload, privateKey, {
			algorithm: "RS384",
			header,
		});

		const response = await axios.post(
			epicTokenUrl,
			new URLSearchParams({
				grant_type: "client_credentials",
				client_assertion_type:
					"urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
				client_assertion: token,
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
		}
		console.error(error);
		return {
			error: "Failed to get access token",
		};
	}
};
