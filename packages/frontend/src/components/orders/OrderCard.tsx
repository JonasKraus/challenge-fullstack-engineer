import { Order } from "@challenge/utils";
import "./order.css";
import { useNavigate } from "react-router-dom";

export const OrderCard = ({ order }: { order: Order }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/order/${order.trackings[0].trackingNumber}`);
	};

	return (
		<div className="container clickable" onClick={handleClick}>
			<div className="row">
				<div className="content">
					<p>Order Number</p>
					<h3>{order.trackings[0].orderNo}</h3>
				</div>
				<div className="content">
					<p>Current Status</p>
					<h3>
						{order.checkpoints?.length
							? order.checkpoints[0].status
							: "No status available"}
					</h3>
				</div>
			</div>
			<div className="content">
				<p>Delivery Address</p>
				<h3>{order.trackings[0].street}</h3>
				<h3>
					{order.trackings[0].zipCode} {order.trackings[0].city}
				</h3>
			</div>
		</div>
	);
};
