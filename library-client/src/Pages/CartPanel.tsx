// CartPanel.tsx
import CartItem from "../component/page-components/cart/CartItem";
import type { LoanResponse } from "../types/DbTypes";
import { useAuth } from "../context/AuthContext";
import apiLoans from "../api/apiLoans";
import { useEffect, useState } from "react";

const CartPanel = () => {
	const { userId, cartChanged } = useAuth();

	const [cartItems, setCartItems] = useState<LoanResponse[]>([]);

	const refreshCart = () => {
		if (!userId) return;

		apiLoans
			.getLoansByUserId(userId)
			.then((data) => {
				let filtered = [...data];

				// Cart items are loans with status "RESERVED"
				filtered = filtered.filter((loan) => loan.status === "RESERVED");

				setCartItems(filtered);
			})
			.catch(console.error);
	};

	useEffect(() => {
		refreshCart();
	}, [userId, cartChanged]);

	return (
		<div className="container">
			<div className="d-flex justify-content-center mb-3">Items</div>

			<div className="container mt-5 mb-5 p-3 bg-body-tertiary rounded">
				{cartItems.length === 0 ? (
					<div className="text-center py-5">
						<h5>No books in shopping cart</h5>
						<p className="text-muted">Your cart items will appear here.</p>
					</div>
				) : (
					<div className="row row-cols-1 g-1">
						{cartItems.map((item) => (
							<div className="col" key={item.loanId}>
								<CartItem item={item} refreshCart={refreshCart} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CartPanel;
