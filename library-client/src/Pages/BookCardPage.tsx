import { useParams } from "react-router-dom";
import { MockData } from "../types/MockData";
import ImageFrame from "../component/common/ImageFrame";
import { useAuth } from "../context/AuthContext";
import { getBookById } from "../api/api";

const BookCardPage = () => {
	const { id } = useParams<{ id?: string }>();
	const { role, userId } = useAuth();

	const handleAddToCart = () => {
		console.log("Dodano do koszyka bookId:", book?.id);

		//sprawdź czy istnieje userId, jeśli nie to przekierowanie na stronę logowania
		if (!userId) {
			window.location.href = "/login";
			return;
		}
	};

	if (!id) {
		return <div>Book not found</div>;
	}

	const bookId = parseInt(id, 10);
	const book = MockData.mockBooks.find((b) => b.id === bookId);

	if (!book) {
		return <div>Book not found</div>;
	}

	return (
		<div className="container mt-4 border p-4 position-relative pb-5">
			<h2>Book info</h2>

			<button className="btn btn-secondary" onClick={() => window.history.back()}>
				Return
			</button>

			<div className="row mt-4 g-4 align-items-start">
				<div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center">
					<ImageFrame imageUrl={book.imageUrl ?? null} alt={book.title} />
				</div>

				<div className="col-12 col-md-8 col-lg-9">
					<p>
						<strong>Book Title:</strong> {book.title}
					</p>
					<p>
						<strong>Authors:</strong>{" "}
						{book.authors?.map((a) => `${a.firstName} ${a.lastName}`).join(", ")}
					</p>
					<p>
						<strong>Published Year:</strong> {book.publishedYear}
					</p>
					<p>
						<strong>Description:</strong> {book.description}
					</p>
				</div>
			</div>

			{role !== "LIBRARIAN" && role !== "ADMIN" && (
				<button
					className="btn btn-secondary position-absolute bottom-0 end-0 m-3"
					onClick={handleAddToCart}
				>
					<i className="bi bi-cart"></i>
				</button>
			)}
		</div>
	);
};

export default BookCardPage;
