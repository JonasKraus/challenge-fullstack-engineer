import request from 'supertest';
import { Application } from "express";

import { app } from './index';

describe('Express App', () => {
	let server: Application;

	beforeAll(() => {
		server = app;
	});

	describe("Server.ts tests", () => {
		test("Math test", () => {
			expect(2 + 2).toBe(4);
		});
	});

	it('should respond with a 200 status code for GET /trackings', async () => {
		const response = await request(server).get('/user/julian@parcellab.com/tracking');
		expect(response.status).toBe(200);
	});

	it('should respond with a JSON array for GET /trackings', async () => {
		const response = await request(server).get('/user/julian@parcellab.com/tracking');
		expect(response.status).toBe(200);
		expect(response.type).toMatch(/json/);
		expect(response.body).toBeInstanceOf(Array);
	});

	it('should respond with a 500 status code for invalid requests', async () => {
		const response = await request(server).get('/invalid-route');
		expect(response.status).toBe(500);
	});
});
