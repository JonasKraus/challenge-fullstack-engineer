import { parseCheckpointsCsv } from "./csvParser";

import readline from "readline";

jest.mock("readline");
jest.mock("fs");

describe("parseCheckpoints", () => {
	it("succeeds with correct data", async () => {
		const csvFilePath = "test.csv";

		const csvDataCheckpoints = [
			"tracking_number;location;timestamp;status;status_text;status_details",
			"00340000161200000001;;2018-04-01T00:00:00.000Z;OrderProcessed;Order processed;The order has been processed.",
			"00340000161200000001;;2018-04-04T23:00:00.000Z;PickUpPlanned;Pick-up planned;The goods will be handed over to the logistics company at the latest at the defined time.",
			"00340000161200000001;;2018-04-04T12:17:00.000Z;Upgrade;Finishing;The goods are being finished and personalized.",
			"00340000161200000001;Feucht;2018-04-04T18:14:59.000Z;InboundScan;Dispatched;The goods have been sent.",
			"00340000161200000001;Rüdersdorf;2018-04-06T04:54:00.000Z;DestinationDeliveryCenter;Delivery is being prepared;The goods have arrived in the destination region.",
			"00340000161200000001;;2018-04-06T05:58:00.000Z;Scheduled;Delivery date set;An appointment to make the delivery has been made. The goods will be delivered on Saturday, Apr 7th, 2018, between 9:30 am and 1:00 pm.",
			"00331612197202003141;;2020-03-01T00:00:00.000Z;OrderProcessed;Order processed;The order has been processed.",
		].join("\n");

		(readline.createInterface as jest.Mock).mockImplementation(() => {
			return {
				on: (event: string, callback: (arg?: string) => string[]) => {
					if (event === "line") {
						for (const line of csvDataCheckpoints.split("\n")) {
							callback(line);
						}
					} else if (event === "close") {
						callback();
					}
				},
			};
		});

		const result = await parseCheckpointsCsv(csvFilePath);
		expect(result.size).toBe(2);
		expect(result.get("00340000161200000001")?.length).toBe(6);
		expect(result.get("00331612197202003141")?.length).toBe(1);
	});
});
