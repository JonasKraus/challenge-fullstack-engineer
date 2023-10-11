import * as fs from "fs";
import * as readline from "readline";
import { Checkpoint, Tracking } from "./index";

/**
 * Generic method to parse CSV files. Returns the file represented as 2 dim array.
 * @param csvFilePath to parse.
 */
async function parseCSV(csvFilePath: string): Promise<string[][]> {
	return new Promise((resolve, reject) => {
		const fileStream = fs.createReadStream(csvFilePath);
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		const data: string[][] = [];
		rl.on("line", (line) => {
			const values = line.split(";");
			data.push(values);
		});

		rl.on("error", () => {
			return reject();
		});

		rl.on("close", () => {
			return resolve(data);
		});
	});
}

/**
 * Maps a parsed csv file to the format of checkpoints -
 * having the trackingNumber as the unique key - like it might be done with a db.
 * @param parsedFile represented as 2 dim array.
 */
function createCheckpointsMap(
	parsedFile: string[][],
): Map<string, Checkpoint[]> {
	parsedFile.shift()?.values(); // Removing unnecessary header line
	const map = new Map<string /* trackingNumber */, Checkpoint[]>();
	parsedFile.map((line) => {
		const uniqueKey = line[0];
		const checkpoint: Checkpoint = {
			location: line[1],
			timestamp: new Date(line[2]).getTime(),
			status: line[3],
			statusText: line[4],
			statusDetails: line[5],
		};
		const list = map.get(uniqueKey) ?? [];
		list.push(checkpoint);
		list.sort((a, b) => a.timestamp - b.timestamp);
		map.set(uniqueKey, list);
	});
	return map;
}

/**
 * Maps a parsed csv file to the format of trackings -
 * having the email as the unique key - like it might be done with a db.
 * @param parsedFile represented as 2 dim array.
 */
function createTrackingsMap(parsedFile: string[][]): Map<string, Tracking[]> {
	parsedFile.shift()?.values(); // Removing unnecessary header line
	const map = new Map<string /* email */, Tracking[]>();
	parsedFile.map((line) => {
		const uniqueKey = line[7];
		const checkpoint: Tracking = {
			orderNo: line[0],
			trackingNumber: line[1],
			courier: line[2],
			street: line[3],
			zipCode: line[4],
			city: line[5],
			destinationCountry: line[6],
			articleNo: line[8],
			articleImageUrl: line[9],
			quantity: line[10],
			productName: line[11],
		};
		const list = map.get(uniqueKey) ?? [];
		list.push(checkpoint);
		// list.sort((a, b) => a.timestamp - b.timestamp);
		map.set(uniqueKey, list);
	});
	return map;
}

/**
 * Parses a given checkpoints csv file path and returns a map that can be used to "query" data.
 * @param csvFilePath to parse.
 */
export async function parseCheckpointsCsv(csvFilePath: string) {
	return createCheckpointsMap(await parseCSV(csvFilePath));
}

/**
 * Parses a given trackings csv file path and returns a map that can be used to "query" data.
 * @param csvFilePath to parse.
 */
export async function parseTrackingsCsv(csvFilePath: string) {
	return createTrackingsMap(await parseCSV(csvFilePath));
}
