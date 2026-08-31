import CartItem from "./CartItem";
import type { Reservation } from "../../types/ReservationType";

const CartPanel = () => {
	const getCartItems = async () => {};

	// przykładowe dane – w prawdziwej aplikacji pobierzesz z API
	const items: Reservation[] = Array.from({ length: 5 }).map((_, i) => ({
		id: i + 1,
		title: `Book ${i + 1}`,
		authors: [`Author ${i + 1}`],
		reservedAt: new Date().toISOString(),
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		bookId: i + 1,
		coverImageUrl: `https://m.media-amazon.com/images/I/71drokvxIVL._AC_UF894,1000_QL80_.jpg`,
	}));

	return (
		<div>
			<p>
				Shopping Cart page content - here is the list of books added to the
				cart(reservations)
			</p>

			<div className="container mt-5 mb-5 p-3 bg-body-tertiary rounded">
				<div className="row row-cols-1 g-1">
					{items.map((item) => (
						<div className="col" key={item.id}>
							<CartItem item={item} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CartPanel;
