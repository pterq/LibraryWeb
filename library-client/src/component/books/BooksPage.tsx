import React from "react";
import SearchBar from "../common/SearchBar";
import BookGrid from "./BookGrid";
import { useParams } from "react-router-dom";
import { MockData } from "../data/MockData";

const BooksPage = () => {
	const { id } = useParams<{ id?: string }>();
	const [search, setSearch] = React.useState("");

	if (id) {
		const bookId = parseInt(id, 10);
		const book = MockData.mockBooks.find((b) => b.id === bookId);

		if (!book) {
			return <div>Book not found</div>;
		}

		return (
			<div>
				<h2>Book info</h2>

				<button className="btn btn-secondary" onClick={() => window.history.back()}>
					Return
				</button>

				<div className="row mt-4 g-4 align-items-start">
					<div className="col-12 col-md-4 col-lg-3">
						<img
							src={book.coverImageUrl ?? "/src/assets/book-placeholder.jpg"}
							className="img-fluid rounded shadow-sm"
							alt={book.title}
						/>
					</div>

					<div className="col-12 col-md-8 col-lg-9">
						<p>Book Title: {book.title}</p>
						<p>
							Author:{" "}
							{book.authors.authors
								.map((a) => `${a.firstName} ${a.lastName}`)
								.join(", ")}
						</p>
						<p>ISBN: {book.isbn}</p>
						<p>Published Year: {book.publishedYear}</p>
						<p>Description: {book.description}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h2 className="d-flex justify-content-center mb-3">Books search and add to cart</h2>

			<SearchBar search={search} setSearch={setSearch} placeholder="Search Book by title" />

			<BookGrid search={search} />
		</div>
	);
};

export default BooksPage;
