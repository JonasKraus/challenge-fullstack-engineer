import { Tracking } from "@challenge/utils";
import "../order.css";

export const Article = ({ tracking }: { tracking: Tracking }) => {
	if (!tracking.productName) {
		return <></>;
	}

	return (
		<div className="container">
			<div className="row">
				<div className={"image_container"}>
					<img
						className={"article-image"}
						src={tracking.articleImageUrl}
						alt={"article image"}
					/>
				</div>
				<div className={"content"}>
					<p>{`${tracking.quantity}x ${tracking.productName}`}</p>
					<p>{tracking.articleNo}</p>
				</div>
			</div>
		</div>
	);
};
