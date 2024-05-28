import type { Request, Response } from "express";
import fs from "node:fs";
import jose from "node-jose";
import path from "node:path";

export const healthCheck = (req: Request, res: Response) => {
	res.status(200).send("OK");
};

function createJwks() {
	const publicKey = fs.readFileSync("../../certificates/publickey509.pem");
	console.log(publicKey);
	jose.JWK.asKey(publicKey, "pem").then((jwk) => {
		const keyStore = jose.JWK.createKeyStore();
		keyStore.add(jwk).then(() => {
			const jwks = keyStore.toJSON();
			fs.writeFileSync("jwks.json", JSON.stringify(jwks, null, 2));
			console.log("JWKS JSON:", JSON.stringify(jwks, null, 2));
		});
	});
}

export const hostJwks = (req: Request, res: Response) => {
	console.log("IN HOST JWKS. TRYING TO ACCESS");
	const jwksPath = path.join(__dirname, "jwks.json");
	if (fs.existsSync(jwksPath)) {
		const jwks = fs.readFileSync(jwksPath, "utf-8");
		res.setHeader("Content-Type", "application/json");
		res.status(200).send(jwks);
	} else {
		res.status(404).send({ error: "JWKS not found" });
	}
};
