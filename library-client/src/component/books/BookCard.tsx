import { useParams } from "react-router-dom";
import { MockData } from "../../types/MockData";
import ImageFrame from "../common/ImageFrame";

const BookCard = () => {
	const { id } = useParams<{ id?: string }>();

	if (!id) {
		return <div>Book not found</div>;
	}

	const bookId = parseInt(id, 10);
	const book = MockData.mockBooks.find((b) => b.id === bookId);

	if (!book) {
		return <div>Book not found</div>;
	}

	return (
		<div className="container mt-4 border p-4">
			<h2>Book info</h2>

			<button className="btn btn-secondary" onClick={() => window.history.back()}>
				Return
			</button>

			<div className="row mt-4 g-4 align-items-start">
				<div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center">
					<ImageFrame imageUrl={book.coverImageUrl ?? null} alt={book.title} />
				</div>

				<div className="col-12 col-md-8 col-lg-9">
					<p>
						<strong>Book Title:</strong> {book.title}
					</p>
					<p>
						<strong>Authors:</strong>{" "}
						{book.authors.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")}
					</p>
					<p>
						<strong>Published Year:</strong> {book.publishedYear}
					</p>
					<p>
						<strong>Description:</strong> {book.description}
					</p>
				</div>
			</div>
		</div>
	);
};

export default BookCard;
