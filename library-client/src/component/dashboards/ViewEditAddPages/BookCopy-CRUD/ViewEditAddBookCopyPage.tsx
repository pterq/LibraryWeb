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
	}));

const ViewEditAddBookCopyPage = () => {
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
					status: copy.status ?? "AVAILABLE",
				};

				setFormData(loadedData);
				setOriginalFormData(loadedData);
			} catch {
				if (!isActive) return;

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
	}, [action, linkId, isExistingBookCopyAction]);

	const pageTitle =
		action === "view" ? (isEditing ? "Edit Book Copy" : "View Book Copy") : "Add Book Copy";
	const selectedBook =
		bookOptions.find((book) => Number(book.id) === Number(formData.bookId)) ?? null;

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

			<div className="d-flex flex-wrap gap-2 mb-3">
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
					<button className="btn btn-primary" onClick={() => setIsEditing(true)}>
						Edit
					</button>
				)}
				{isEditing && (
					<button type="button" className="btn btn-warning" onClick={handleCancelEdit}>
						Cancel
					</button>
				)}
			</div>

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
							value={formData.bookId}
							onChange={handleChange}
							disabled={isReadOnly || isLoading}
							required
						>
							<option value="">Select a book</option>
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
							<h5 className="card-title">Book information</h5>
							<p className="mb-1">
								<strong>Title:</strong> {selectedBook.title}
							</p>
							<p className="mb-1">
								<strong>Author(s):</strong> {selectedBook.authorsLabel}
							</p>
							<p className="mb-1">
								<strong>ISBN:</strong> {selectedBook.isbn || "-"}
							</p>
							<p className="mb-1">
								<strong>Published year:</strong> {selectedBook.publishedYear ?? "-"}
							</p>
							<p className="mb-0">
								<strong>Description:</strong>{" "}
								{selectedBook.description || "No description."}
							</p>
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
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{action === "view" ? "Save Changes" : "Create Book Copy"}
					</button>
				)}
			</form>
		</div>
	);
};

export default ViewEditAddBookCopyPage;
