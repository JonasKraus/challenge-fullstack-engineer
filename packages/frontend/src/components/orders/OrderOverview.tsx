import { useLocation } from "react-router-dom";
import useGetData from "../../restApi/get";
import { BACKEND_ROUTES, Order } from "@challenge/utils";
import { OrderCard } from "./OrderCard";

export const OrderOverview = () => {
	const location = useLocation();
	const emailRegex = /\/user\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})\//;
	const match = location.pathname.match(emailRegex);
	const email = match ? match[1] : "";
	const { data, loading, error } = useGetData<Order[]>(
		BACKEND_ROUTES.ORDERS,
		email
	);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	const renderList = () => {
		return <ul>
			{data?.map((order, index) => (
				<li key={index}>
					<OrderCard order={order} />
				</li>
			))}
		</ul>
	}

	const renderContent = () => {
		if (data?.length) {
			return renderList()
		}
		return <h1>No orders</h1>
	}

	return renderContent()
}
