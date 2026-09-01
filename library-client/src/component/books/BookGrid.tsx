import React, { useEffect, useState } from "react";
import BookTile from "./BookTile";
import PageNav from "../dashboards/page/PageNav";

import type { BookType } from "../../types/BookType";

import { MockData } from "../data/MockData";

interface BookGridProps {
	search: string;
}

const BookGrid: React.FC<BookGridProps> = ({ search }) => {
	// Mock data for books
	const books: BookType[] = MockData.mockBooks;
	const normalizedSearch = search.trim().toLowerCase();
	const filteredBooks = books.filter((book) =>
		book.title.toLowerCase().includes(normalizedSearch),
	);

	const pageSize = 15; // ile kafelków na stronę
	const [page, setPage] = useState(1);

	useEffect(() => {
		setPage(1);
	}, [normalizedSearch]);

	const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));

	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const pageBooks = filteredBooks.slice(start, end);

	return (
		<div>
			<div className=" mt-5 mb-5 p-3 bg-body-tertiary rounded">
				<div className="row row-cols-5 g-1">
					{pageBooks.map((book) => (
						<div className="col" key={book.id}>
							<BookTile book={book} />
						</div>
					))}
					{filteredBooks.length === 0 && (
						<div className="col-12 text-center py-4">
							No books found for this search.
						</div>
					)}
				</div>
			</div>

			{filteredBooks.length > 0 && (
				<PageNav page={page} totalPages={totalPages} onPageChange={setPage} />
			)}
		</div>
	);
};

export default BookGrid;
