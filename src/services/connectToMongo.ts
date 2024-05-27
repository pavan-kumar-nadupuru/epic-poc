import { connect } from "mongoose";

export const connectToMongo = () => {
	connect("mongodb://localhost:27017/epic")
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((error) => {
			console.error("Failed to connect to MongoDB", error);
		});
};
