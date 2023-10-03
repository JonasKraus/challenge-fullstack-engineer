import * as fs from "fs";
import * as readline from "readline";

// trackingNumber as unique key
export interface Checkpoint {
	location: string,
	timestamp: number,
	status: string,
	statusText: string,
	statusDetails: string
}

// email as id
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

const checkpointMap = new Map([
	["tracking_number", "trackingNumber"],
	["location", "location"],
	["timestamp", "timestamp"],
	["status", "status"],
	["status_text", "statusText"],
	["status_details", "statusDetails"]
])

async function parseCSV(csvFilePath: string): Promise<string[][]> {
	return new Promise((resolve, reject) => {
		const fileStream = fs.createReadStream(csvFilePath);
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		const data: string[][] = []
		rl.on("line", (line) => {
			const values = line.split(";");
			data.push(values)
		});

		rl.on("error", () => {
			console.log("CSV parsing failed.");
			return reject();
		});

		rl.on("close", () => {
			console.log("CSV parsing completed.");
			return resolve(data);
		});
	});
}

function createCheckpointsMap(parsedFile: string[][]): Map<string, Checkpoint[]> {
	const header = parsedFile.shift()?.values();
	const map = new Map<string/* trackingNumber */, Checkpoint[]>();
	parsedFile.map((line) => {
		const uniqueKey = line[0];
		const checkpoint: Checkpoint = {
			location: line[1],
			timestamp: new Date(line[2]).getTime(),
			status: line[3],
			statusText: line[4],
			statusDetails: line[5]
		};
		const list = map.get(uniqueKey) ?? [];
		list.push(checkpoint);
		list.sort((a, b) => a.timestamp - b.timestamp);
		map.set(uniqueKey, list)
	});
	return map;
}

function createTrackingsMap(parsedFile: string[][]): Map<string, Tracking[]> {
	const header = parsedFile.shift()?.values();
	const map = new Map<string/* email */, Tracking[]>();
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
			productName: line[11]
		};
		const list = map.get(uniqueKey) ?? [];
		list.push(checkpoint);
		// list.sort((a, b) => a.timestamp - b.timestamp);
		map.set(uniqueKey, list)
	});
	return map;
}

export async function parseCheckpointCsv(csvFilePath: string) {
	return createCheckpointsMap(await parseCSV(csvFilePath));
}
export async function parseTrackingsCsv(csvFilePath: string) {
	return createTrackingsMap(await parseCSV(csvFilePath));
}
