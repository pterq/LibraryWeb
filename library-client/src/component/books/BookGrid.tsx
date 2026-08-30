import React, { useState } from "react";
import BookTile from "./BookTile";
import PageNav from "../common/PageNav";

import type { Book } from "../../types/Book";

const BookGrid: React.FC = () => {
	// przykładowe dane – w prawdziwej aplikacji pobierzesz z API
	const books: Book[] = Array.from({ length: 46 }).map((_, i) => ({
		id: i + 1,
		title: `Book ${i + 1}`,
		description: `Description for Book ${i + 1}`,
	}));

	const pageSize = 15; // ile kafelków na stronę
	const [page, setPage] = useState(1);

	const totalPages = Math.ceil(books.length / pageSize);

	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const pageBooks = books.slice(start, end);

	return (
		<div>
			<div className="container mt-5 mb-5 p-3 bg-body-tertiary rounded">
				<div className="row row-cols-5 g-1">
					{pageBooks.map((book) => (
						<div className="col" key={book.id}>
							<BookTile book={book} />
						</div>
					))}
				</div>
			</div>

			<PageNav page={page} totalPages={totalPages} onPageChange={setPage} />
		</div>
	);
};

export default BookGrid;
