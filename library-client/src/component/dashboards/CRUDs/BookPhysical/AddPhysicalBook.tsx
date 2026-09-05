import { useEffect, useState } from "react";
import apiBooksPhysical from "../../../../api/apiBooksPhysical";
import apiBooks from "../../../../api/apiBooks";
import type { BookPhysicalStatusType, BookType, BookPhysicalForm } from "../../../../types/DbTypes";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

type FormData = {
	bookId: string;
	inventoryCode: string;
	status: "AVAILABLE" | "BORROWED" | "RESERVED";
};

const EMPTY_FORM: FormData = {
	bookId: "NO_BOOK_ID",
	inventoryCode: "",
	status: "AVAILABLE",
};

const AddPhysicalBook = ({ onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

	const [booksLoading, setBooksLoading] = useState(false);
	const [bookOptions, setBookOptions] = useState<any[]>([]);
	const [selectedBook, setSelectedBook] = useState<any | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const loadBooks = async () => {
			setBooksLoading(true);
			try {
				const books = await apiBooks.getBooks();
				if (!active) return;

				const mapped = books.map((b: any) => ({
					id: b.id,
					title: b.title,
					authorsLabel: b.authors
						?.map((a: any) => `${a.firstName} ${a.lastName}`)
						.join(", "),
					publishedYear: b.publishedYear,
					coverImageUrl: b.coverImageUrl,
					description: b.description,
					isbn: b.isbn,
				}));

				setBookOptions(mapped);
			} catch {
				setError("Failed to load books.");
			} finally {
				setBooksLoading(false);
			}
		};

		loadBooks();
		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		const found = bookOptions.find((b) => String(b.id) === formData.bookId);
		setSelectedBook(found || null);
	}, [formData.bookId, bookOptions]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await apiBooksPhysical
				.addBookCopy({
					bookId: Number(formData.bookId),
					inventoryCode: formData.inventoryCode,
					status: formData.status,
				})
				.then(() => {
					// Success handler if needed
				})
				.catch((error) => {
					setError("Failed to create physical book.");
					console.error(error);
				});

			onReload();
			showMessage("Physical book has been added.");
			onBack();
		} catch {
			setError("Failed to create physical book.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container py-3">
			<button className="btn btn-secondary mb-3" onClick={onBack}>
				Back
			</button>

			<h2>Add Physical Book</h2>

			{error && <p className="text-danger">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				{/* BOOK SELECT */}
				<div className="mb-3">
					<label className="form-label">Book</label>

					{booksLoading ? (
						<p>Loading books...</p>
					) : (
						<select
							name="bookId"
							className="form-select"
							value={formData.bookId}
							onChange={handleChange}
							required
						>
							<option value="NO_BOOK_ID">No BookID</option>
							{bookOptions.map((book) => (
								<option key={book.id} value={String(book.id)}>
									{book.title} - {book.authorsLabel} - {book.publishedYear ?? "-"}{" "}
									(ID: {book.id})
								</option>
							))}
						</select>
					)}
				</div>

				{/* BOOK PREVIEW */}
				{selectedBook && (
					<div className="card mb-3">
						<div className="card-body">
							<div className="d-flex gap-3">
								<img
									src={
										selectedBook.coverImageUrl ??
										"/src/assets/book-placeholder.jpg"
									}
									alt={selectedBook.title}
									className="img-fluid border rounded"
									style={{ width: "120px", height: "180px", objectFit: "cover" }}
								/>

								<div>
									<h5>Book information</h5>
									<p>
										<strong>Title:</strong> {selectedBook.title}
									</p>
									<p>
										<strong>Authors:</strong> {selectedBook.authorsLabel}
									</p>
									<p>
										<strong>ISBN:</strong> {selectedBook.isbn || "-"}
									</p>
									<p>
										<strong>Published year:</strong>{" "}
										{selectedBook.publishedYear ?? "-"}
									</p>
									<p>
										<strong>Description:</strong>{" "}
										{selectedBook.description || "No description."}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* INVENTORY CODE */}
				<div className="mb-3">
					<label className="form-label">Inventory Code</label>
					<input
						type="text"
						name="inventoryCode"
						className="form-control"
						value={formData.inventoryCode}
						onChange={handleChange}
						required
					/>
				</div>

				{/* STATUS */}
				<div className="mb-3">
					<label className="form-label">Status</label>
					<select
						name="status"
						className="form-select"
						value={formData.status}
						onChange={handleChange}
						required
					>
						<option value="AVAILABLE">AVAILABLE</option>
						<option value="BORROWED">BORROWED</option>
						<option value="RESERVED">RESERVED</option>
					</select>
				</div>

				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					Create Physical Book
				</button>
			</form>
		</div>
	);
};

export default AddPhysicalBook;
