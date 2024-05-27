import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
	access_token: String,
	token_type: String,
	expires_in: Number,
	created_at: { type: Date, default: Date.now },
});

export default model("Token", tokenSchema);
