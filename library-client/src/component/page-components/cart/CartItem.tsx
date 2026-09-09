// CartItem.tsx
import { Link } from "react-router-dom";
import type { LoanResponse, AuthorType } from "../../../types/DbTypes";
import apiLoans from "../../../api/apiLoans";
import { useAuth } from "../../../context/AuthContext";

const calculateDaysLeft = (expiresAt: Date): number => {
	const currentDate = new Date();
	const expirationDate = new Date(expiresAt);
	const timeDiff = expirationDate.getTime() - currentDate.getTime();
	return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const CartItem = ({ item, refreshCart }: { item: LoanResponse; refreshCart: () => void }) => {
	const { showToast, notifyCartChanged } = useAuth();

	const handleRemoveFromCart = () => {
		apiLoans
			.deleteLoanById(item.loanId)
			.then(() => {
				showToast("Book removed from cart.");
				refreshCart();
				notifyCartChanged();
			})
			.catch(() => {
				showToast("Failed to remove book from cart.");
			});
	};

	return (
		<div className="mb-4 p-3 border rounded">
			<div className="d-flex align-items-center">
				<div style={{ flex: "1" }}>
					<Link to={`/book/${item.copy.book.id}`}>
						<img
							src={
								item.copy.book.imageUrl
									? item.copy.book.imageUrl
									: "../../assets/default-book-cover.jpg"
							}
							alt={item.copy.book.title}
							className="img-fluid img-thumbnail"
						/>
					</Link>
				</div>

				<div style={{ flex: "2" }} className="ms-3">
					<h4>{item.copy.book.title}</h4>
					<div>
						by{" "}
						{item.copy.book.authors
							.map((a: AuthorType) => `${a.firstName} ${a.lastName}`)
							.join(", ")}
					</div>

					<div className="mt-2">
						<strong>Reserved for:</strong> {calculateDaysLeft(item.expiresAt)} days
					</div>
				</div>

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
