import React from "react";
import CartItemsTable from "./CartItemsTable";
import ReturnButton from "../../common/ReturnButton";

import { actionFromLink, idFromLink, type PageAction } from "../../../context/DataFromLink";

const ViewEditAddCartPage = () => {
	// tylko dla "view" próbujemy pobrać userId z URL
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const pageTitle = action === "view" ? "View User's Shopping Cart" : "Add User's Shopping Cart";

	return (
		<div className="container py-3">
			<div className="d-flex flex-wrap gap-2 mb-3">
				<ReturnButton />
			</div>

			<h2>{pageTitle}</h2>

			{/* VIEW MODE */}
			{action === "view" && (
				<>
					{!linkId && (
						<p className="text-danger mb-3">Invalid or missing user id in URL.</p>
					)}

					{linkId && (
						<>
							<h4 className="mb-3">User Id: {linkId}</h4>
							<CartItemsTable userId={linkId} />
						</>
					)}
				</>
			)}

			{/* ADD MODE */}
			{action === "add" && (
				<>
					<h4 className="mb-3">New Shopping Cart — User not created yet</h4>

					{/* CartItemsTable bez userId → wyświetla pustą tabelę */}
					<CartItemsTable userId={null} />
				</>
			)}
		</div>
	);
};

export default ViewEditAddCartPage;
