import { config } from "dotenv";
import express from "express";
import router from "./routes/routes";
// import { connectToMongo } from "./services/connectToMongo";

config();
// connectToMongo();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
