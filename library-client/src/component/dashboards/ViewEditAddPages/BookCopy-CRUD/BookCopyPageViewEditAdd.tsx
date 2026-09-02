import React, { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";
import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import { MockData } from "../../../../types/MockData";
import type { BookPhysicalStatusType } from "../../../../types/DbTypes";
import ReturnButton from "../../../common/ReturnButton";

type BookOption = {
	id: number;
	title: string;
	authorsLabel: string;
	isbn: string;
	description: string;
	publishedYear?: number | null;
	coverImageUrl?: string;
};

type BookCopyFormData = {
	bookId: string;
	inventoryCode: string;
	status: BookPhysicalStatusType;
};

type BookAuthor = {
	firstName?: string;
	lastName?: string;
};

type ApiBook = {
	id?: number | string | null;
	title?: string;
	authors?:
		| {
				authors?: BookAuthor[];
		  }
		| BookAuthor[]
		| null;
	isbn?: string;
	description?: string;
	publishedYear?: number | null;
	coverImageUrl?: string;
	coverUrl?: string;
};

const EMPTY_FORM: BookCopyFormData = {
	bookId: "",
	inventoryCode: "",
	status: "AVAILABLE",
};

const getAuthorsLabel = (authors: ApiBook["authors"]): string => {
	if (Array.isArray(authors)) {
		const labels = authors
			.map((author) => `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim())
			.filter(Boolean);

		return labels.join(", ") || "Unknown author";
	}

	const nestedAuthors = authors?.authors ?? [];
	const labels = nestedAuthors
		.map((author) => `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim())
		.filter(Boolean);

	return labels.join(", ") || "Unknown author";
};

const loadBooksFromMockData = (): BookOption[] =>
	MockData.mockBooks.map((book) => ({
		id: Number(book.id ?? 0),
		title: book.title ?? "Unknown title",
		authorsLabel: getAuthorsLabel(book.authors),
		isbn: book.isbn ?? "",
		description: book.description ?? "",
		publishedYear: book.publishedYear ?? null,
		coverImageUrl: book.coverImageUrl ?? "/src/assets/book-placeholder.jpg",
	}));

const BookCopyPageViewEditAdd = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingBookCopyAction = action === "view";

	const [formData, setFormData] = useState<BookCopyFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<BookCopyFormData>(EMPTY_FORM);
	const [bookOptions, setBookOptions] = useState<BookOption[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [booksLoading, setBooksLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mockBookCopy =
		linkId != null
			? MockData.mockBookPhysicals.find((copy) => Number(copy.id) === Number(linkId))
			: undefined;

	useEffect(() => {
		const loadBooks = async () => {
			setBooksLoading(true);

			try {
				const response = await axiosClient.get("/books");
				const books = response.data as ApiBook[];

				if (books.length <= 2) {
					setBookOptions(loadBooksFromMockData());
					return;
				}

				setBookOptions(
					books.map((book) => ({
						id: Number(book.id ?? 0),
						title: book.title ?? "Unknown title",
						authorsLabel: getAuthorsLabel(book.authors),
						isbn: book.isbn ?? "",
						description: book.description ?? "",
						publishedYear: book.publishedYear ?? null,
						coverImageUrl:
							book.coverImageUrl ??
							book.coverUrl ??
							"/src/assets/book-placeholder.jpg",
					})),
				);
			} catch {
				setBookOptions(loadBooksFromMockData());
			} finally {
				setBooksLoading(false);
			}
		};

		void loadBooks();
	}, []);

	useEffect(() => {
		if (!isExistingBookCopyAction) {
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing book copy id in URL.");
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadBookCopy = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/copies/${linkId}`);
				const copy = response.data as {
					book?: { id?: number | string | null } | null;
					inventoryCode?: string;
					status?: BookPhysicalStatusType | null;
				};

				if (!isActive) return;

				const loadedData: BookCopyFormData = {
					bookId: copy.book?.id != null ? String(copy.book.id) : "",
					inventoryCode: copy.inventoryCode ?? "",
					status: copy.status ?? mockBookCopy?.status ?? "AVAILABLE",
				};

				setFormData(loadedData);
				setOriginalFormData(loadedData);
			} catch {
				if (!isActive) return;

				if (mockBookCopy) {
					const fallbackData: BookCopyFormData = {
						bookId: String(mockBookCopy.book.id),
						inventoryCode: mockBookCopy.inventoryCode,
						status: mockBookCopy.status,
					};

					setFormData(fallbackData);
					setOriginalFormData(fallbackData);
					setError("Loaded book copy from mock data.");
					return;
				}

				setError("Failed to load book copy data.");
				setFormData(EMPTY_FORM);
				setOriginalFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadBookCopy();

		return () => {
			isActive = false;
		};
	}, [action, linkId, isExistingBookCopyAction, mockBookCopy]);

	const pageTitle =
		action === "view" ? (isEditing ? "Edit Book Copy" : "View Book Copy") : "Add Book Copy";
	const selectedBookId =
		action === "view" && !formData.bookId && linkId != null ? String(linkId) : formData.bookId;
	const selectedBook =
		bookOptions.find((book) => Number(book.id) === Number(selectedBookId)) ?? null;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "status" ? (value as BookPhysicalStatusType) : value,
		}));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (isReadOnly) return;

		console.log("Form submit payload:", {
			book: { id: Number(formData.bookId) },
			inventoryCode: formData.inventoryCode,
			status: formData.status,
		});
	};

	const handleCancelEdit = () => {
		if (action === "view") {
			setFormData(originalFormData);
			setIsEditing(false);
			setError(null);
			return;
		}

		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		setError(null);
		window.history.back();
	};

	const handleDelete = () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete item: invalid item id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this item?");
		if (!shouldDelete) {
			return;
		}

		console.log("Mock delete item with id:", linkId);
		setError("Mock delete executed. Connect API call here.");
	};

	return (
		<div className="container py-3">
			<ReturnButton />

			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading book copy data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label htmlFor="bookId" className="form-label">
						Book
					</label>
					{booksLoading ? (
						<p className="text-muted mb-0">Loading books...</p>
					) : (
						<select
							id="bookId"
							name="bookId"
							className="form-select"
							value={selectedBookId || "NO_BOOK_ID"}
							onChange={handleChange}
							disabled={isReadOnly || isLoading}
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

				{selectedBook && (
					<div className="card mb-3">
						<div className="card-body">
							<div className="d-flex align-items-start gap-3">
								<div className="flex-shrink-0">
									<img
										src={
											selectedBook.coverImageUrl ??
											"/src/assets/book-placeholder.jpg"
										}
										alt={selectedBook.title}
										className="img-fluid border rounded"
										style={{
											width: "120px",
											height: "180px",
											objectFit: "cover",
										}}
										onError={(event) => {
											const target = event.currentTarget;
											target.onerror = null;
											target.src = "/src/assets/book-placeholder.jpg";
										}}
									/>
								</div>

								<div className="flex-grow-1">
									<h5 className="card-title">Book information</h5>
									<div className="row g-3">
										<div className="col-12 col-md-6">
											<p className="mb-2">
												<strong>Title:</strong> {selectedBook.title}
											</p>
											<p className="mb-2">
												<strong>Authors:</strong>{" "}
												{selectedBook.authorsLabel}
											</p>
											<p className="mb-2">
												<strong>ISBN:</strong> {selectedBook.isbn || "-"}
											</p>
											<p className="mb-0">
												<strong>Published year:</strong>{" "}
												{selectedBook.publishedYear ?? "-"}
											</p>
										</div>
										<div className="col-12 col-md-6">
											<p className="mb-0">
												<strong>Description:</strong>
											</p>
											<p className="mb-0 mt-1">
												{selectedBook.description || "No description."}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="mb-3">
					<label htmlFor="inventoryCode" className="form-label">
						Inventory Code
					</label>
					<input
						type="text"
						id="inventoryCode"
						name="inventoryCode"
						className="form-control"
						value={formData.inventoryCode}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="status" className="form-label">
						Status
					</label>
					<select
						id="status"
						name="status"
						className="form-select"
						value={formData.status}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					>
						<option value="AVAILABLE">AVAILABLE</option>
						<option value="BORROWED">BORROWED</option>
						<option value="RESERVED">RESERVED</option>
					</select>
				</div>

				{!isReadOnly && (
					<div className="d-flex gap-2 mt-3">
						<button type="submit" className="btn btn-primary" disabled={isLoading}>
							{action === "view" ? "Save Changes" : "Create Book Copy"}
						</button>
						{(action === "add" || action === "view") && (
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => {
									if (action === "view") {
										setFormData(originalFormData);
										setError(null);
										return;
									}
									setFormData(EMPTY_FORM);
									setOriginalFormData(EMPTY_FORM);
									setError(null);
								}}
							>
								Clear
							</button>
						)}
					</div>
				)}
			</form>

			<div className="d-flex flex-wrap gap-2 mt-3">
				{action === "view" && (
					<button
						type="button"
						className="btn btn-danger"
						onClick={handleDelete}
						disabled={isLoading}
					>
						Delete
					</button>
				)}
				{action === "view" && !isEditing && (
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setIsEditing(true)}
					>
						Edit
					</button>
				)}
				{action === "view" && isEditing && (
					<button type="button" className="btn btn-warning" onClick={handleCancelEdit}>
						Cancel
					</button>
				)}
			</div>
		</div>
	);
};

export default BookCopyPageViewEditAdd;
