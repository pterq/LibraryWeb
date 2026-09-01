import CartItem from "./CartItem";
import type { ReservationType } from "../../types/DbTypes";
import { MockData } from "../data/MockData";

const CartPanel = () => {
	const getCartItems = async () => {};

	// przykładowe dane – w prawdziwej aplikacji pobierzesz z API
	const items = MockData.mockReservations.reservations;

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
