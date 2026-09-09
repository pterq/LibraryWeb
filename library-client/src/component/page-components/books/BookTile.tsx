import { Link } from "react-router-dom";
import "./book-tile.css";
import TileImage from "./TileImage";
import type { BookType, AuthorType } from "../../types/DbTypes";
import { useAuth } from "../../context/AuthContext";
import apiLoans from "../../api/apiLoans";

interface BookTileProps {
	book: BookType;
}

const BookTile: React.FC<BookTileProps> = ({ book }) => {
	const { role, userId, showToast, notifyCartChanged } = useAuth();

	const handleAddToCart = () => {
		if (!userId) {
			window.location.href = "/login";
			return;
		}

		console.log("Add to cart clicked: ", { userId, bookId: book.id });

		apiLoans
			.addLoanReserve({ userId, bookId: book.id })
			.then((data) => {
				console.log("Added to cart item:", data);
				showToast("Book added to cart.");
				notifyCartChanged();
			})
			.catch((err) => {
				console.error(err);
				showToast("Failed to add book to cart.");
			});
	};

	return (
		<div
			className="card text-center w-100 border-0 bg-white book-tile"
			style={{ transition: "0.2s", cursor: "pointer" }}
			onMouseEnter={(e) => e.currentTarget.classList.add("bg-primary-subtle")}
			onMouseLeave={(e) => e.currentTarget.classList.remove("bg-primary-subtle")}
		>
			<TileImage src={book.imageUrl ?? "/src/assets/book-placeholder.jpg"} alt={book.title} />

			<div className="card-body d-flex flex-column h-100">
				<h5 className="card-title">{book.title}</h5>

				<h6 className="card-subtitle mb-2 text-muted">
					{book.authors
						.map((author: AuthorType) => author.firstName + " " + author.lastName)
						.join(", ")}
				</h6>

				<p className="card-text flex-grow-1">
					{book.description.length > 60
						? book.description.slice(0, 60) + "..."
						: book.description}
				</p>

				<div className="d-flex justify-content-center gap-2 mt-auto">
					<Link to={`/book/${book.id}`} className="btn btn-primary flex-shrink-0">
						Details
					</Link>

					<button className="btn btn-secondary flex-shrink-0" onClick={handleAddToCart}>
						<i className="bi bi-cart"></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default BookTile;
