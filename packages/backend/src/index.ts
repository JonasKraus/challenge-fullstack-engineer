import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { parseCheckpoints, parseTrackings } from "@challenge/utils";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/user/:email/tracking", async (req: Request, res: Response) => {
	try {
		const trackingsMap = await parseTrackings(
			path.join(__dirname, "../data/trackings.csv"),
		);
		const email = req.params.email;
		const trackings = trackingsMap.get(email) ?? [];
		res.status(200).json(trackings);
	} catch (e) {
		res.status(500).json({
			status: "error",
			statusMessage: `failed due to ${e}`,
		});
	}
});
app.get(
	"/checkpoints/:trackingNumber",
	async (req: Request, res: Response) => {
		try {
			const checkpointsMap = await parseCheckpoints(
				path.join(__dirname, "../data/checkpoints.csv"),
			);
			const trackingNumber = req.params.trackingNumber;
			const checkpoints = checkpointsMap.get(trackingNumber) ?? [];
			res.status(200).json(checkpoints);
		} catch (e) {
			res.status(500).json({
				status: "error",
				statusMessage: `failed due to ${e}`,
			});
		}
	},
);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
