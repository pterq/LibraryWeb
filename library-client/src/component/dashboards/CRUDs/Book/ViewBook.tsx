import { useEffect, useState } from "react";
import apiBooks from "../../../../api/apiBooks";
import type { BookType } from "../../../../types/DbTypes";

type ApiBook = {
	id: number;
	title?: string;
	description?: string;
	imageUrl?: string | null;
	coverImageUrl?: string | null;
	isbn?: string;
	publishedYear?: number;
	categories?: BookType["categories"];
	authors?: BookType["authors"];
};

const BOOK_PLACEHOLDER_IMAGE = "/src/assets/book-placeholder.jpg";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
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

const ViewBook = ({ id, onBack, onReload, showMessage }: Props) => {
	const [data, setData] = useState<BookType>(EMPTY_BOOK);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const book = (await apiBooks.getBookById(id)) as ApiBook;
				if (!active) return;

				const resolvedCoverUrl = (book.imageUrl ?? book.coverImageUrl ?? "").trim();

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

		void load();

		return () => {
			active = false;
		};
	}, [id]);

	const authorNames =
		data.authors.length > 0
			? data.authors.map((author) => `${author.firstName} ${author.lastName}`).join(", ")
			: "-";

	const categoryNames =
		data.categories.length > 0
			? data.categories.map((category) => category.name).join(", ")
			: "-";

	const displayCover = data.imageUrl?.trim() ? data.imageUrl : BOOK_PLACEHOLDER_IMAGE;

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button
					className="btn btn-secondary"
					onClick={() => {
						onBack();
						onReload();
						//showMessage("Returned from book view.");
					}}
				>
					Back
				</button>
			</div>

			<h2>View Book</h2>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<div className="mt-3">
				<img
					src={displayCover}
					alt={data.title || "Book cover"}
					style={{ width: "150px", height: "220px", objectFit: "cover" }}
					className="mb-3"
					onError={(event) => {
						event.currentTarget.src = BOOK_PLACEHOLDER_IMAGE;
					}}
				/>

				<p>
					<strong>Title:</strong> {data.title || "-"}
				</p>
				<p>
					<strong>ISBN:</strong> {data.isbn || "-"}
				</p>
				<p>
					<strong>Published Year:</strong> {data.publishedYear || "-"}
				</p>
				<p>
					<strong>Authors:</strong> {authorNames}
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
	);
};

export default ViewBook;
