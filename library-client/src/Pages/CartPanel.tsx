import CartItem from "../component/cart/CartItem";
import type { LoanResponse } from "../types/DbTypes";
import { useAuth } from "../context/AuthContext";

import apiLoans from "../api/apiLoans";
import { useEffect, useState } from "react";

const CartPanel = () => {
	const { userId } = useAuth();

	const [reservations, setReservations] = useState<LoanResponse[]>([]);

	useEffect(() => {
		if (userId == null) return;

		console.log("User id:", userId);

		apiLoans
			.getLoansByUserId(userId)
			.then((data) => {
				setReservations(data);
				console.log("Fetched cart items:", data);
			})
			.catch(console.error);
	}, [userId]);
	return (
		<div className="container">
			<div className="d-flex justify-content-center mb-3">Items</div>

			<div className="container mt-5 mb-5 p-3 bg-body-tertiary rounded">
				{reservations.length === 0 ? (
					<div className="text-center py-5">
						<h5>No books in shopping cart</h5>
						<p className="text-muted">Your cart items will appear here.</p>
					</div>
				) : (
					<div className="row row-cols-1 g-1">
						{reservations.map((item) => (
							<div className="col" key={item.id}>
								<CartItem item={item} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CartPanel;
