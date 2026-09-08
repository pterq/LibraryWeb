import { useEffect, useState } from "react";
import apiBooks from "../../../../api/apiBooks";
import type { BookType } from "../../../../types/DbTypes";
import BookDataCard from "./BookDataCard";

type Props = {
	bookId: number;
	onBack: () => void;
};

const EMPTY_BOOK: BookType = {
	id: 0,
	title: "",
	description: "",
	imageUrl: null,
	isbn: "",
	publishedYear: 0,
	categories: [],
	authors: [],
};

const ViewBook = ({ bookId, onBack }: Props) => {
	const [data, setData] = useState<BookType>(EMPTY_BOOK);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			console.log("Loading book with ID:", bookId);

			try {
				const book = await apiBooks.getBookById(bookId);
				if (!active) return;

				const resolvedCoverUrl = (book.imageUrl ?? book.imageUrl ?? "").trim();

				setData({
					id: book.id,
					title: book.title ?? "",
					description: book.description ?? "",
					imageUrl: resolvedCoverUrl.length > 0 ? resolvedCoverUrl : null,
					isbn: book.isbn ?? "",
					publishedYear: book.publishedYear ?? 0,
					categories: book.categories ?? [],
					authors: book.authors ?? [],
				});
			} catch {
				if (active) setError("Failed to load book.");
			} finally {
				if (active) setIsLoading(false);
			}
		};

		load();

		return () => {
			active = false;
		};
	}, [bookId]);

	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>
			</div>
			{isLoading && <p>Loading book...</p>}
			{error && <p className="text-danger">{error}</p>}
			{!isLoading && !error && <BookDataCard bookData={data} />}
		</div>
	);
};

export default ViewBook;
