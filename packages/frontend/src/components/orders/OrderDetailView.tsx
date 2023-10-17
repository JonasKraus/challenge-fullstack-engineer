import { BACKEND_ROUTES, Order } from "@challenge/utils";
import useGetData from "../../restApi/get";
import { useLocation } from "react-router-dom";
import { Article } from "./article/Article";

export const OrderDetailView = () => {
	const location = useLocation();
	const trackingNumber = location.pathname.split("/").pop();
	const {data, loading, error} = useGetData<Order>(BACKEND_ROUTES.ORDER, trackingNumber ?? "");

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	const renderDetails = () => {
		if (!data || !data.trackings.length) {
			return <h1>No order found</h1>
		}
		return (
			<div className="container">
				<div className="row">
					<div className="content">
						<p>Order Number</p>
						<h3>{data.trackings[0].orderNo}</h3>
					</div>
					<div className="content">
						<p>Current Status</p>
						<h3>
							{data.checkpoints?.length
								? data.checkpoints[0].statusText
								: "No status available"}
						</h3>
						<p>{data.checkpoints?.length ? data.checkpoints[0].statusDetails : ""}</p>
					</div>
				</div>
				<div className="content">
					<p>Delivery Address</p>
					<h3>{data.trackings[0].street}</h3>
					<h3>
						{data.trackings[0].zipCode} {data.trackings[0].city}
					</h3>
				</div>
				<div className="content">
					<p>Tracking Number</p>
					<h3>{data.trackings[0].trackingNumber}</h3>
				</div>
				<ul>
					{data.trackings.map((tracking, index) => (
						<li key={index}>
							<Article tracking={tracking} />
						</li>
					))}
				</ul>

			</div>
		);
	}

	return data ? renderDetails() : <h1>"No order found"</h1>;
};
