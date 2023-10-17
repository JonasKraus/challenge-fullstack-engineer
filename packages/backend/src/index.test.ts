import request from "supertest";
import { Server } from "./Server";

describe("Express App", () => {

	it("should respond with a 200 status code for GET orders", async () => {
		const response = await request(Server.getServer()).get(
			"/user/julian@parcellab.com/order",
		);
		expect(response.status).toBe(200);
		expect(response.type).toMatch(/json/);
		expect(response.body[0]["trackings"]).toBeInstanceOf(Array);
		expect(response.body[0]["checkpoints"]).toBeInstanceOf(Array);
	});

	it("should respond with a JSON array for GET order", async () => {
		const response = await request(Server.getServer()).get(
			"/order/00331612197202003141",
		);
		expect(response.status).toBe(200);
		expect(response.type).toMatch(/json/);
		expect(response.body).toBeInstanceOf(Object);
		expect(response.body["trackings"]).toBeInstanceOf(Array);
		expect(response.body["checkpoints"]).toBeInstanceOf(Array);
	});

	it("should respond with a 404 status code for invalid requests", async () => {
		const response = await request(Server.getServer()).get(
			"/invalid-route",
		);
		expect(response.status).toBe(404);
	});
});
