import useGetData from "./get";
import { BACKEND_ROUTES, Checkpoint } from "@challenge/utils";
import { render, screen, waitFor } from "@testing-library/react";

describe("useGetData", () => {
	// Mock the global fetch function
	global.fetch = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const TestComponent = () => {
		const { data } = useGetData<Checkpoint[]>(
			BACKEND_ROUTES.ORDERS,
			"123",
		);
		return (
			<>
				<div data-testid="dataLength">
					Number of data: {data?.length}
				</div>
			</>
		);
	};

	it("test with renderer", async () => {
		const responseData: Checkpoint[] = [
			{
				status: "status",
				timestamp: 1222,
				statusDetails: "datails",
				statusText: "status text",
				location: "location",
			},
		];
		const jsonPromise = Promise.resolve(responseData);
		const response = {
			ok: true,
			json: () => jsonPromise,
		};
		(global.fetch as jest.Mock).mockResolvedValue(response);
		render(<TestComponent />);
		await waitFor(() => {
			expect(screen.getByTestId("dataLength")).toHaveTextContent("Number of data: 1");
		});
	});

});
