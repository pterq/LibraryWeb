import { Link } from "react-router-dom";

import type {
	CartType,
	BookPhysicalResponse,
	BookType,
	AuthorType,
	AuthorsType,
} from "../../types/DbTypes";

const CartItem = ({ item }: { item: CartType }) => {
	const calculateDaysLeft = (expiresAt: Date): number => {
		const currentDate = new Date();
		const expirationDate = new Date(expiresAt);
		const timeDiff = expirationDate.getTime() - currentDate.getTime();
		return Math.ceil(timeDiff / (1000 * 3600 * 24));
	};

	const handleRemoveFromCart = () => {
		// Implement the logic to remove the item from the cart
		console.log(`Removing item with ID: ${item.id} from cart`);
	};

	return (
		<div className="mb-4 p-3 border rounded">
			<div className="d-flex align-items-center">
				{/* LEFT: Cover (1/3) */}
				<div style={{ flex: "1" }}>
					<Link to={`/book/${item.bookPhysical.book.id}`}>
						<img
							src={item.bookPhysical.book.imageUrl}
							alt={item.bookPhysical.book.title}
							className="img-fluid img-thumbnail"
						/>
					</Link>
				</div>

				{/* MIDDLE: Details (2/3) */}
				<div style={{ flex: "2" }} className="ms-3">
					<h4>{item.bookPhysical.book.title}</h4>
					<div>
						by{" "}
						{item.bookPhysical.book.authors.authors
							.map((author: AuthorType) => `${author.firstName} ${author.lastName}`)
							.join(", ")}
					</div>

					<div className="mt-2">
						<strong>Reserved for:</strong> {calculateDaysLeft(item.expiresAt)} days
					</div>
				</div>

				{/* RIGHT: Remove button (narrow column) */}
				<div className="ms-3">
					<button className="btn btn-danger btn-sm" onClick={handleRemoveFromCart}>
						<i className="bi bi-x-lg"></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
