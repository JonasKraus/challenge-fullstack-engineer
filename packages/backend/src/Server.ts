import express, { Express, Request, Response } from "express";
import cors from "cors";
import {
	BACKEND_ROUTES, Checkpoint, Order,
	parseCheckpoints,
	parseTrackings, Tracking
} from "@challenge/utils";
import path from "path";

export class Server {
	private static app: Express;

	private static trackingsMapPromise: Promise<Map<string, Tracking[]>> | undefined;
	private static checkpointsMapPromise: Promise<Map<string, Checkpoint[]>> | undefined;

	private constructor() {}

	public static getServer(): Express {
		if (!Server.app) {
			const app = express();
			Server.app = app;
			try {
				Server.app.use(
					cors({
						origin: "http://localhost:5173",
					}),
				);
				Server.app.get(
					BACKEND_ROUTES.ORDERS.valueOf(),
					async (req: Request, res: Response) => {
						try {
							Server.checkpointsMapPromise = Server.checkpointsMapPromise
								? Server.checkpointsMapPromise
								: parseCheckpoints(
									path.join(__dirname, "../data/checkpoints.csv"),
								);
							Server.trackingsMapPromise = Server.trackingsMapPromise
								? Server.trackingsMapPromise
								: parseTrackings(path.join(__dirname, "../data/trackings.csv"));
							// email for which we should send data
							const email = req.params.email;
							// parsed all trackings
							const trackings = await Server.trackingsMapPromise;
							// parsed all checkpoints
							const checkpoints = await Server.checkpointsMapPromise;
							// map that stores all trackings of email
							const trackingsByTrackingNumber: Map<string, Tracking[]> = new Map<
								string /* orderNumber */,
								Tracking[]
							>();
							trackings.get(email)?.forEach((tracking) => {
								const list =
									trackingsByTrackingNumber.get(tracking.trackingNumber) ??
									[];
								list.push(tracking);
								trackingsByTrackingNumber.set(tracking.trackingNumber, list);
							});
							const orders: Order[] = [];
							trackingsByTrackingNumber.forEach((trackings) => {
								orders.push({
									trackings: trackings,
									checkpoints: checkpoints.get(trackings[0].trackingNumber),
								});
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
				Server.app.get(BACKEND_ROUTES.ORDER, async (req: Request, res: Response) => {
					try {
						Server.checkpointsMapPromise = Server.checkpointsMapPromise
							? Server.checkpointsMapPromise
							: parseCheckpoints(path.join(__dirname, "../data/checkpoints.csv"));
						Server.trackingsMapPromise = Server.trackingsMapPromise
							? Server.trackingsMapPromise
							: parseTrackings(path.join(__dirname, "../data/trackings.csv"));
						const trackingNumber = req.params.trackingNumber;
						// parsed all trackings
						const trackings = await Server.trackingsMapPromise;
						// parsed all checkpoints
						const checkpoints = await Server.checkpointsMapPromise;
						// map that stores all trackings of given trackingNumber
						const trackingsByTrackingNumber: Tracking[] = Array.from(
							trackings.values(),
						).flatMap((trackings) =>
							trackings.filter(
								(tracking) => tracking.trackingNumber === trackingNumber,
							),
						);
						const order: Order = {
							trackings: trackingsByTrackingNumber ?? [],
							checkpoints: checkpoints.get(trackingNumber),
						};
						res.status(200).json(order);
					} catch (e) {
						res.status(500).json({
							status: "error",
							statusMessage: `failed due to ${e}`,
						});
					}
				});
			} catch (e) {
				console.error(e);
				throw e;
			}
		}
		return Server.app;
	}
}
