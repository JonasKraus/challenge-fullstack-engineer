import {parseCheckpointsCsv, parseTrackingsCsv} from "./csvParser";

// trackingNumber as unique key
export interface Checkpoint {
	location: string,
	timestamp: number,
	status: string,
	statusText: string,
	statusDetails: string
}

// email as unique key
export interface Tracking {
	orderNo: string,
	trackingNumber: string,
	courier: string,
	street: string,
	zipCode: string,
	city: string,
	destinationCountry: string,
	articleNo: string,
	articleImageUrl: string,
	quantity: string,
	productName: string
}

export const BACKEND_BASE_URL = "http://localhost:3000"
export enum BACKEND_ROUTES {
	TRACKINGS = "/user/:email/tracking",
	CHECKPOINTS = "/checkpoints/:trackingNumber"
}

/**
 * Helper function to parse checkpoints from a csv file.
 * @param csvFilePath to parse.
 */
export async function parseCheckpoints(csvFilePath: string): Promise<Map<string, Checkpoint[]>> {
	return parseCheckpointsCsv(csvFilePath);
}

/**
 * Helper function to parse trackins from a csv file.
 * @param csvFilePath to parse.
 */
export async function parseTrackings(csvFilePath: string): Promise<Map<string, Tracking[]>> {
	return parseTrackingsCsv(csvFilePath);
}
