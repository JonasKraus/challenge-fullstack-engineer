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
app.get(BACKEND_ROUTES.ORDERS.valueOf(),
	async (req: Request, res: Response) => {
		try {
			checkpointsMapPromise = checkpointsMapPromise ? checkpointsMapPromise : parseCheckpoints(
				path.join(__dirname, "../data/checkpoints.csv"),
			);
			trackingsMapPromise = trackingsMapPromise ? trackingsMapPromise : parseTrackings(
				path.join(__dirname, "../data/trackings.csv"),
			);
			// email for which we should send data
			const email = req.params.email;
			// parsed all trackings
			const trackings = await trackingsMapPromise;
			// parsed all checkpoints
			const checkpoints = await checkpointsMapPromise;
			// map that stores all trackings of email
			const trackingsByTrackingNumber: Map<string, Tracking[]> = new Map<string /* orderNumber */, Tracking[]>();
			trackings.get(email)?.forEach((tracking) => {
				const list = trackingsByTrackingNumber.get(tracking.trackingNumber) ?? [];
				list.push(tracking);
				trackingsByTrackingNumber.set(tracking.trackingNumber, list);
			});
			const orders: Order[] = [];
			trackingsByTrackingNumber.forEach((trackings) => {
				orders.push({trackings: trackings, checkpoints: checkpoints.get(trackings[0].trackingNumber)})
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
app.get(BACKEND_ROUTES.ORDER,
	async (req: Request, res: Response) => {
		try {
			checkpointsMapPromise = checkpointsMapPromise ? checkpointsMapPromise : parseCheckpoints(
				path.join(__dirname, "../data/checkpoints.csv"),
			);
			trackingsMapPromise = trackingsMapPromise ? trackingsMapPromise : parseTrackings(
				path.join(__dirname, "../data/trackings.csv"),
			);
			const trackingNumber = req.params.trackingNumber;
			// parsed all trackings
			const trackings = await trackingsMapPromise;
			// parsed all checkpoints
			const checkpoints = await checkpointsMapPromise;
			// map that stores all trackings of given trackingNumber
			const trackingsByTrackingNumber: Tracking[] = Array.from(trackings.values()).flatMap((trackings) =>
				trackings.filter((tracking) => tracking.trackingNumber === trackingNumber)
			);
			const order: Order = {trackings: trackingsByTrackingNumber ?? [], checkpoints: checkpoints.get(trackingNumber)};
			res.status(200).json(order);
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
