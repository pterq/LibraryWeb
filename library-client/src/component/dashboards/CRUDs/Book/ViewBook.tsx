import { useEffect, useState } from "react";
import apiBooks from "../../../../api/apiBooks";
import type { BookType } from "../../../../types/DbTypes";

const BOOK_PLACEHOLDER_IMAGE = "/src/assets/book-placeholder.jpg";

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

	const authorNames =
		data.authors.length > 0
			? data.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")
			: "-";

	const categoryNames =
		data.categories.length > 0 ? data.categories.map((c) => c.name).join(", ") : "-";

	const displayCover = data.imageUrl?.trim() ? data.imageUrl : BOOK_PLACEHOLDER_IMAGE;

	return (
		<div className="card mb-3">
			<div className="card-body">
				{isLoading && <p>Loading book...</p>}
				{error && <p className="text-danger">{error}</p>}

				{!isLoading && !error && (
					<div className="d-flex gap-3">
						<img
							src={displayCover}
							alt={data.title || "Book cover"}
							style={{ width: "120px", height: "180px", objectFit: "cover" }}
							className="border rounded"
							onError={(e) => (e.currentTarget.src = BOOK_PLACEHOLDER_IMAGE)}
						/>

						<div>
							<h5>Book information</h5>

							<p>
								<strong>Title:</strong> {data.title || "-"}
							</p>
							<p>
								<strong>Authors:</strong> {authorNames}
							</p>
							<p>
								<strong>ISBN:</strong> {data.isbn || "-"}
							</p>
							<p>
								<strong>Published year:</strong> {data.publishedYear || "-"}
							</p>
							<p>
								<strong>Categories:</strong> {categoryNames}
							</p>
							<p>
								<strong>Description:</strong>
							</p>
							<p>{data.description || "-"}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewBook;
