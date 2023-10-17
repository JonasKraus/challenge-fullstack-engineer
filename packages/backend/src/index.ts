import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import {
	parseCheckpoints,
	parseTrackings,
	Tracking, Checkpoint, BACKEND_ROUTES, Order
} from "@challenge/utils";
import cors from "cors"; // Import the 'cors' middleware


dotenv.config();

export const app: Application = express();
const port = process.env.PORT || 3000;
app.use(
	cors({
		origin: "http://localhost:5173",
	}),
);

let trackingsMapPromise: Promise<Map<string, Tracking[]>> | undefined;
let checkpointsMapPromise: Promise<Map<string, Checkpoint[]>> | undefined;
app.get(BACKEND_ROUTES.TRACKINGS.valueOf(), async (req: Request, res: Response) => {
	try {
		trackingsMapPromise = trackingsMapPromise ? trackingsMapPromise : parseTrackings(
			path.join(__dirname, "../data/trackings.csv"),
		);
		const email = req.params.email;
		const trackings = await trackingsMapPromise;
		res.status(200).json(trackings.get(email) ?? []);
	} catch (e) {
		res.status(500).json({
			status: "error",
			statusMessage: `failed due to ${e}`,
		});
	}
});
app.get(BACKEND_ROUTES.CHECKPOINTS.valueOf(),
	async (req: Request, res: Response) => {
		try {
			checkpointsMapPromise = checkpointsMapPromise ? checkpointsMapPromise : parseCheckpoints(
				path.join(__dirname, "../data/checkpoints.csv"),
			);
			const trackingNumber = req.params.trackingNumber;
			const checkpoints = await checkpointsMapPromise;
			res.status(200).json(checkpoints.get(trackingNumber) ?? []);
		} catch (e) {
			res.status(500).json({
				status: "error",
				statusMessage: `failed due to ${e}`,
			});
		}
	},
);
app.get(BACKEND_ROUTES.ORDERS.valueOf(),
	async (req: Request, res: Response) => {
		try {
			checkpointsMapPromise = checkpointsMapPromise ? checkpointsMapPromise : parseCheckpoints(
				path.join(__dirname, "../data/checkpoints.csv"),
			);
			trackingsMapPromise = trackingsMapPromise ? trackingsMapPromise : parseTrackings(
				path.join(__dirname, "../data/trackings.csv"),
			);
			const email = req.params.email;
			const trackings = await trackingsMapPromise;
			const checkpoints = await checkpointsMapPromise;
			const orders: Order[] = [];
			trackings.get(email)?.map((tracking) => {
				orders.push({tracking: tracking, checkpoints: checkpoints.get(tracking.trackingNumber)})
			});
			res.status(200).json(orders);
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
