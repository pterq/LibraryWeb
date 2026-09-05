import { useParams } from "react-router-dom";
import ImageFrame from "../component/common/ImageFrame";
import { useAuth } from "../context/AuthContext";
import apiBooks from "../api/apiBooks";
import apiCarts from "../api/apiCarts";
import { useEffect, useState } from "react";

import type { BookType } from ".././/types/DbTypes";

const BookCardPage = () => {
	const { id } = useParams<{ id?: string }>();
	const bookId = Number(id);
	const { role, userId } = useAuth();

	const [bookData, setBookData] = useState<BookType | null>(null);

	const handleAddToCart = () => {
		console.log("Dodano do koszyka bookId:");

		//sprawdź czy istnieje userId, jeśli nie to przekierowanie na stronę logowania
		if (!userId) {
			window.location.href = "/login";
			return;
		} else {
		}
	};

	if (!id) {
		return <div>Book not found</div>;
	}

	useEffect(() => {
		apiBooks
			.getBookById(bookId)
			.then((data) => {
				setBookData(data);

				console.log("Fetched 1 book data:", data);
			})
			.catch(console.error);
	}, []);

	if (!bookData) {
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
					<ImageFrame imageUrl={bookData.imageUrl ?? null} alt={bookData.title} />
				</div>

				<div className="col-12 col-md-8 col-lg-9">
					<p>
						<strong>Book Title:</strong> {bookData.title}
					</p>
					<p>
						<strong>Authors:</strong>{" "}
						{bookData.authors
							?.map(
								(a: { firstName: string; lastName: string }) =>
									`${a.firstName} ${a.lastName}`,
							)
							.join(", ")}
					</p>
					<p>
						<strong>Published Year:</strong> {bookData.publishedYear}
					</p>
					<p>
						<strong>Description:</strong> {bookData.description}
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
