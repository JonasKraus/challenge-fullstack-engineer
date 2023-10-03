import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as Utils from "@challenge/utils";
import fs from "fs";
import readline from "readline";
import path from "path";
import { parseCheckpointCsv, parseTrackingsCsv } from "@challenge/utils";

dotenv.config();

const index: Express = express();
const port = process.env.PORT;

index.get("/user/:email/tracking", async (req: Request, res: Response) => {
	try {
		const trackingsMap = await parseTrackingsCsv(
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
index.get(
	"/checkpoints/:trackingNumber",
	async (req: Request, res: Response) => {
		try {
			const checkpointsMap = await parseCheckpointCsv(
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

index.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
