import { useState } from "react";

interface BookResult {
	title: string;
	coverUrl?: string;
	isbn: string;
	authors: string[];
	description: string;
	publishedYear: string;
	categories: string[];
	genre: string[];
}

interface BookSearchProps {
	onSelect: (book: BookResult) => void;
}

const normalizePublishedYear = (publishedDate?: string) => {
	if (!publishedDate) return "";

	const match = publishedDate.match(/^\d{4}/);
	return match ? match[0] : "";
};

const BookSearchGoogle: React.FC<BookSearchProps> = ({ onSelect }) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<BookResult[]>([]);
	const [loading, setLoading] = useState(false);

	const API_KEY = import.meta.env.VITE_BOOKS_API_KEY;

	const searchBooks = async () => {
		if (!query.trim()) return;

		setLoading(true);

		try {
			const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
				query,
			)}&maxResults=10&key=${API_KEY}`;

			const res = await fetch(url);
			const data = await res.json();

			if (!data.items) {
				setResults([]);
				setLoading(false);
				return;
			}

			const mapped: BookResult[] = data.items.map((item: any) => {
				const info = item.volumeInfo;

				// ISBN
				let isbn = "";
				if (info.industryIdentifiers?.length) {
					const id = info.industryIdentifiers.find(
						(x: any) => x.type === "ISBN_13" || x.type === "ISBN_10",
					);
					if (id) isbn = id.identifier;
				}

				// Okładka
				const coverUrl = info.imageLinks?.thumbnail?.replace("http://", "https://");

				// Kategorie / gatunki
				const categories = info.categories ?? [];
				const knownGenres = [
					"Fantasy",
					"Science Fiction",
					"Romance",
					"Horror",
					"Mystery",
					"Thriller",
					"Adventure",
					"Historical",
					"Biography",
					"Poetry",
					"Drama",
					"Children",
					"Young Adult",
				];

				const genre = categories.filter((c: string) =>
					knownGenres.some((g) => c.toLowerCase().includes(g.toLowerCase())),
				);

				return {
					title: info.title ?? "Unknown",
					coverUrl,
					isbn,
					authors: info.authors ?? [],
					description: info.description ?? "",
					publishedYear: normalizePublishedYear(info.publishedDate),
					categories,
					genre,
				};
			});

			setResults(mapped);
		} catch (err) {
			console.error("Google Books API error:", err);
		}

		setLoading(false);
	};

	const clearSearch = () => {
		setQuery("");
		setResults([]);
		setLoading(false);
	};

	return (
		<div className="my-4">
			<h4>Search book</h4>

			<div className="d-flex gap-2 mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Enter book title..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							void searchBooks();
						}
					}}
				/>

				<button type="button" className="btn btn-primary" onClick={searchBooks}>
					Search
				</button>

				<button type="button" className="btn btn-secondary" onClick={clearSearch}>
					Clear Search
				</button>
			</div>

			{loading && <p>Loading...</p>}

			<div className="list-group">
				{results.map((book, idx) => (
					<button
						key={idx}
						type="button"
						className="list-group-item list-group-item-action d-flex gap-3 align-items-center"
						onClick={() => onSelect(book)}
						style={{ minHeight: "110px" }}
					>
						<img
							src={book.coverUrl ?? "/src/assets/book-placeholder.jpg"}
							alt={book.title}
							style={{
								width: "60px",
								height: "90px",
								objectFit: "cover",
								flexShrink: 0,
							}}
						/>

						<div className="text-start flex-grow-1">
							<h6 className="mb-1">{book.title}</h6>
							<p className="mb-1">
								<b>Authors:</b> {book.authors.join(", ")}
							</p>
							<p className="mb-1">
								<b>ISBN:</b> {book.isbn || "—"}
							</p>
							<p className="mb-1">
								<b>Year:</b> {book.publishedYear || "—"}
							</p>

							<p className="mb-1">
								<b>Genre:</b> {book.genre.length > 0 ? book.genre.join(", ") : "—"}
							</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default BookSearchGoogle;
