import { Order } from "@challenge/utils";
import "./OrderCard.css";

export const OrderCard = ({ order }: { order: Order }) => {

	const handleClick = () => {
		console.info(order);
	}
	return (
		<div className="container" onClick={handleClick}>
			<div className="row">
				<div className="content">
					<p>Order Number</p>
					<h3>{order.tracking.orderNo}</h3>
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
				<h3>{order.tracking.street}</h3>
				<h3>
					{order.tracking.zipCode} {order.tracking.city}
				</h3>
			</div>
		</div>
	);
};
