import React, { useState } from "react";
import BookTile from "./BookTile";
import PageNav from "../common/PageNav";

import type { BookType } from "../../types/BookType";

import { MockData } from "../data/MockData";

const BookGrid: React.FC = () => {
	// Mock data for books
	const books: BookType[] = MockData.mockBooks;

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
