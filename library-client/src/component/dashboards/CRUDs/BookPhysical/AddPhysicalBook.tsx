import { useEffect, useState } from "react";
import apiBooksPhysical from "../../../../api/apiBooksPhysical";
import apiBooks from "../../../../api/apiBooks";
import type { BookType } from "../../../../types/DbTypes";
import ViewBook from "../Book/ViewBook";

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
	const [bookOptions, setBookOptions] = useState<BookType[]>([]);
	const [selectedBook, setSelectedBook] = useState<BookType | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// LOAD BOOKS
	useEffect(() => {
		let active = true;

		const loadBooks = async () => {
			setBooksLoading(true);
			try {
				const books = await apiBooks.getBooks();
				if (!active) return;

				setBookOptions(books);
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
			await apiBooksPhysical.addBookCopy({
				bookId: Number(formData.bookId),
				inventoryCode: formData.inventoryCode,
				status: formData.status,
			});

			onReload();
			showMessage("Physical book has been added.");
			onBack();
		} catch (err) {
			console.error(err);
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
									{book.title} –{" "}
									{book.authors
										.map((a) => `${a.firstName} ${a.lastName}`)
										.join(", ")}{" "}
									– {book.publishedYear ?? "-"} (ID: {book.id})
								</option>
							))}
						</select>
					)}
				</div>

				{/* BOOK PREVIEW */}
				{selectedBook && <ViewBook bookId={selectedBook.id} onBack={() => {}} />}

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
