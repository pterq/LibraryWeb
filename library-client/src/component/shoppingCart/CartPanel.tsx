import CartItem from "./CartItem";
import type { ReservationType } from "../../types/DbTypes";
import { useAuth } from "../../context/AuthContext";

import { getReservationByUserId } from "../../api/api";
import { useEffect, useState } from "react";

const CartPanel = () => {
	const { userId } = useAuth();

	const [reservations, setReservations] = useState<ReservationType[] | null>(null);

	useEffect(() => {
		getReservationByUserId(userId)
			.then((data) => {
				setReservations(data);
				console.log("Fetched reservations:", data);
			})
			.catch(console.error);
	}, []);

	const items: ReservationType[] = reservations ?? [];

	return (
		<div className="container">
			<div className="d-flex justify-content-center mb-3">Items</div>

			<div className="container mt-5 mb-5 p-3 bg-body-tertiary rounded">
				{items.length === 0 ? (
					<div className="text-center py-5">
						<h5>No books in shopping cart</h5>
						<p className="text-muted">Your reservations will appear here.</p>
					</div>
				) : (
					<div className="row row-cols-1 g-1">
						{items.map((item) => (
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
