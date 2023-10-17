import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OrderOverview } from "./OrderOverview";
import useGetData from "../../restApi/get";
import { Order } from "@challenge/utils";

jest.mock("../../restApi/get");

describe("OrderOverview Component", () => {
	test("renders loading message when data is loading", async () => {
		(useGetData as jest.Mock).mockReturnValue({ loading: true });

		await act(async () => {
			render(
				<MemoryRouter
					initialEntries={["/user/john@example.com/orders"]}
				>
					<OrderOverview />
				</MemoryRouter>,
			);
		});

		const loadingText = screen.getByText("Loading...");
		expect(loadingText).toBeInTheDocument();
	});

	test("renders error message when there is an error", async () => {
		(useGetData as jest.Mock).mockReturnValue({
			error: new Error("Data loading failed"),
		});

		await act(async () => {
			render(
				<MemoryRouter
					initialEntries={["/user/john@example.com/orders"]}
				>
					<OrderOverview />
				</MemoryRouter>,
			);
		});

		const errorText = screen.getByText("Error: Data loading failed");
		expect(errorText).toBeInTheDocument();
	});

	test("renders list of orders when data is loaded", async () => {
		const mockData: Order[] = [
			{
				tracking: {
					orderNo: "order-nr-123",
					trackingNumber: "987",
					courier: "DHL",
					street: "Sesamstraße 99",
					zipCode: "80444",
					city: "München",
					destinationCountry: "DE",
					articleNo: "ord-nr-1",
					articleImageUrl: "",
					quantity: "1",
					productName: "Fancy product 1",
				},
				checkpoints: [
					{
						location: "Near by",
						timestamp: 1697541829,
						status: "processed",
						statusText: "item processed",
						statusDetails: "details",
					},
				],
			},
		];

		(useGetData as jest.Mock).mockReturnValue({ data: mockData });

		await act(async () => {
			render(
				<MemoryRouter
					initialEntries={["/user/john@example.com/orders"]}
				>
					<OrderOverview />
				</MemoryRouter>,
			);
		});

		const orderNr = screen.getByText("order-nr-123");
		const latestStatus = screen.getByText("processed");
		expect(orderNr).toBeInTheDocument();
		expect(latestStatus).toBeInTheDocument();
	});

	test('renders "No orders" message when there are no orders', async () => {
		(useGetData as jest.Mock).mockReturnValue({ data: [] });

		await act(async () => {
			render(
				<MemoryRouter
					initialEntries={["/user/john@example.com/orders"]}
				>
					<OrderOverview />
				</MemoryRouter>,
			);
		});

		const noOrdersText = screen.getByText("No orders");
		expect(noOrdersText).toBeInTheDocument();
	});
});
