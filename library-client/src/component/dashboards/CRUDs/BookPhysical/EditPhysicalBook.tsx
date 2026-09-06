import { useEffect, useState } from "react";
import apiBooksPhysical from "../../../../api/apiBooksPhysical";
import apiBooks from "../../../../api/apiBooks";
import type { BookPhysicalStatusType, BookType } from "../../../../types/DbTypes";
import ViewBook from "../Book/ViewBook";

type Props = {
	bookId: number;
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

const EditPhysicalBook = ({ bookId, onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<FormData>(EMPTY_FORM);

	const [booksLoading, setBooksLoading] = useState(false);
	const [bookOptions, setBookOptions] = useState<any[]>([]);
	const [selectedBook, setSelectedBook] = useState<any | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// LOAD BOOK COPY
	useEffect(() => {
		let active = true;

		const loadCopy = async () => {
			setIsLoading(true);
			try {
				const copy = await apiBooksPhysical.getBookCopyById(bookId);
				if (!active) return;

				const next: FormData = {
					bookId: copy.book?.id ? String(copy.book.id) : "NO_BOOK_ID",
					inventoryCode: copy.inventoryCode ?? "",
					status: copy.status ?? "AVAILABLE",
				};

				console.log("Loaded copy:", copy);

				setFormData(next);
				setOriginalFormData(next);
			} catch {
				setError("Failed to load physical book.");
			} finally {
				setIsLoading(false);
			}
		};

		loadCopy();
		return () => {
			active = false;
		};
	}, [bookId]);

	// LOAD BOOK OPTIONS
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

				console.log("Mapped books:", mapped);

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

	// SELECTED BOOK PREVIEW
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
				.updateBookCopyById(bookId, {
					bookId: Number(formData.bookId),
					inventoryCode: formData.inventoryCode,
					status: formData.status,
				})
				.then(() => {
					// Success handler if needed
				})
				.catch((error) => {
					setError("Failed to update physical book.");
					console.error(error);
				});

			onReload();
			showMessage("Physical book has been updated.");
			onBack();
		} catch {
			setError("Failed to save changes.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>
			</div>

			<h2>Edit Physical Book</h2>

			{error && <p className="text-danger">{error}</p>}
			{isLoading && <p>Loading...</p>}

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
				{!booksLoading && selectedBook && (
					<ViewBook bookId={selectedBook.id} onBack={() => {}} />
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
					Save Changes
				</button>
			</form>
		</div>
	);
};

export default EditPhysicalBook;
