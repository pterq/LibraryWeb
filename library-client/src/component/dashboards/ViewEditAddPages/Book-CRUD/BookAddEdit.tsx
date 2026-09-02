import React, { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import type { AuthorType } from "../../../../types/DbTypes";
import type { PageAction } from "../../../../context/DataFromLink";
import { MockData } from "../../../../types/MockData";

type BookCreatePayload = {
	title: string;
	description: string;
	isbn: string;
	publishedYear: number | null;
	categoryId: number | null;
	authorIds: number[];
};

export type BookFormData = {
	title: string;
	description: string;
	isbn: string;
	publishedYear: string;
	authors: AuthorType[];
	categories: string[];
	genre: string[];
	coverImageUrl?: string;
};

export type AutofillFieldKey = "title" | "description" | "isbn" | "publishedYear" | "coverImageUrl";

export type AutofillSelection = Record<AutofillFieldKey, boolean>;

export const EMPTY_BOOK_FORM: BookFormData = {
	title: "",
	description: "",
	isbn: "",
	publishedYear: "",
	authors: [],
	categories: [],
	genre: [],
	coverImageUrl: "",
};

export const DEFAULT_AUTOFILL_SELECTION: AutofillSelection = {
	title: true,
	description: true,
	isbn: true,
	publishedYear: true,
	coverImageUrl: true,
};

type AddBookProps = {
	action: PageAction;
	linkId: string | null;
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	isReadOnly: boolean;
	formData: BookFormData;
	setFormData: React.Dispatch<React.SetStateAction<BookFormData>>;
	originalFormData: BookFormData;
	setOriginalFormData: React.Dispatch<React.SetStateAction<BookFormData>>;
	error: string | null;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	autofillSelection: AutofillSelection;
	setAutofillSelection: React.Dispatch<React.SetStateAction<AutofillSelection>>;
	showLoading: boolean;
	setShowLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const BookAddEdit = ({
	action,
	linkId,
	isEditing,
	setIsEditing,
	isReadOnly,
	formData,
	setFormData,
	originalFormData,
	setOriginalFormData,
	error,
	setError,
	autofillSelection,
	setAutofillSelection,
	showLoading,
	setShowLoading,
}: AddBookProps) => {
	const isExistingBookAction = action === "view";
	const mockBook =
		linkId != null
			? MockData.mockBooks.find((book) => Number(book.id) === Number(linkId))
			: undefined;

	const [authorQuery, setAuthorQuery] = useState("");
	const [authorResults, setAuthorResults] = useState<AuthorType[]>([]);
	const [isAuthorLoading, setIsAuthorLoading] = useState(false);
	const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
	const [newAuthor, setNewAuthor] = useState({ firstName: "", lastName: "", bio: "" });

	type ApiBook = {
		title?: string;
		description?: string;
		isbn?: string;
		publishedYear?: number | string | null;
		authors?: { authors?: AuthorType[] } | AuthorType[] | null;
		categories?: { name?: string }[] | null;
		coverImageUrl?: string | null;
		coverUrl?: string | null;
	};

	useEffect(() => {
		if (!isExistingBookAction) {
			setFormData(EMPTY_BOOK_FORM);
			setOriginalFormData(EMPTY_BOOK_FORM);
			setAutofillSelection(DEFAULT_AUTOFILL_SELECTION);
			setError(null);
			setIsEditing(true);
			setAuthorQuery("");
			setAuthorResults([]);
			setShowLoading(false);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing book id in URL.");
			setFormData(EMPTY_BOOK_FORM);
			setOriginalFormData(EMPTY_BOOK_FORM);
			setShowLoading(false);
			return;
		}

		let isActive = true;

		const loadBook = async () => {
			setShowLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/books/${linkId}`);
				const book = response.data as ApiBook;

				if (!isActive) return;

				const resolvedAuthors = Array.isArray(book.authors)
					? book.authors
					: (book.authors?.authors ?? []);

				const loadedData: BookFormData = {
					title: book.title ?? "",
					description: book.description ?? "",
					isbn: book.isbn ?? "",
					publishedYear: book.publishedYear != null ? String(book.publishedYear) : "",
					authors: resolvedAuthors,
					categories:
						book.categories?.map((category) => category.name ?? "").filter(Boolean) ??
						[],
					genre: [],
					coverImageUrl: book.coverImageUrl ?? book.coverUrl ?? "",
				};

				setFormData(loadedData);
				setOriginalFormData(loadedData);
			} catch {
				if (!isActive) return;

				if (mockBook) {
					const fallbackData: BookFormData = {
						title: mockBook.title ?? "",
						description: mockBook.description ?? "",
						isbn: mockBook.isbn ?? "",
						publishedYear:
							mockBook.publishedYear != null ? String(mockBook.publishedYear) : "",
						authors: mockBook.authors?.authors ?? [],
						categories:
							mockBook.categories
								?.map((category) => category.name ?? "")
								.filter(Boolean) ?? [],
						genre: [],
						coverImageUrl: mockBook.coverImageUrl ?? "",
					};

					setFormData(fallbackData);
					setOriginalFormData(fallbackData);
					setError("Loaded book from mock data.");
					return;
				}

				setError("Failed to load book data.");
				setFormData(EMPTY_BOOK_FORM);
				setOriginalFormData(EMPTY_BOOK_FORM);
			} finally {
				if (isActive) setShowLoading(false);
			}
		};

		void loadBook();

		return () => {
			isActive = false;
		};
	}, [
		isExistingBookAction,
		linkId,
		mockBook,
		setAutofillSelection,
		setError,
		setFormData,
		setIsEditing,
		setOriginalFormData,
		setShowLoading,
	]);

	const searchAuthors = async (query: string) => {
		if (!query.trim()) {
			setAuthorResults([]);
			return;
		}

		setIsAuthorLoading(true);

		try {
			const res = await axiosClient.get(`/authors/search?query=${query}`);
			setAuthorResults(res.data as AuthorType[]);
		} catch {
			setAuthorResults([]);
		}

		setIsAuthorLoading(false);
	};

	useEffect(() => {
		const timer = setTimeout(() => searchAuthors(authorQuery), 300);
		return () => clearTimeout(timer);
	}, [authorQuery]);

	const addAuthorToForm = (author: AuthorType) => {
		setFormData((prev) => ({
			...prev,
			authors: prev.authors.some((a) => a.id === author.id)
				? prev.authors
				: [...prev.authors, author],
		}));
	};

	const removeAuthorFromForm = (id: number) => {
		setFormData((prev) => ({
			...prev,
			authors: prev.authors.filter((a) => a.id !== id),
		}));
	};

	const handleAddNewAuthor = async () => {
		try {
			const res = await axiosClient.post("/authors", newAuthor);
			const created = res.data as AuthorType;

			addAuthorToForm(created);
			setShowAddAuthorModal(false);
			setNewAuthor({ firstName: "", lastName: "", bio: "" });
		} catch {
			alert("Failed to add author");
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleAutofillSelectionChange = (field: AutofillFieldKey) => {
		setAutofillSelection((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (isReadOnly) return;

		const payload: BookCreatePayload = {
			title: formData.title,
			description: formData.description,
			isbn: formData.isbn,
			publishedYear: formData.publishedYear ? Number(formData.publishedYear) : null,
			categoryId: null,
			authorIds: formData.authors.map((author) => author.id),
		};

		try {
			if (action === "add") {
				await axiosClient.post("/books", payload);
			} else {
				await axiosClient.put(`/books/${linkId}`, payload);
			}
			alert("Saved!");
		} catch {
			alert("Failed to save");
		}
	};

	const handleCancelEdit = () => {
		if (action === "view") {
			setFormData(originalFormData);
			setIsEditing(false);
			setError(null);
			return;
		}

		setFormData(EMPTY_BOOK_FORM);
		setOriginalFormData(EMPTY_BOOK_FORM);
		setError(null);
	};

	const handleClearAddForm = () => {
		setFormData(EMPTY_BOOK_FORM);
		setAutofillSelection(DEFAULT_AUTOFILL_SELECTION);
		setError(null);
		setAuthorQuery("");
		setAuthorResults([]);
	};

	const handleDelete = async () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete item: invalid item id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this item?");
		if (!shouldDelete) return;

		try {
			await axiosClient.delete(`/books/${linkId}`);
			alert("Deleted");
		} catch {
			alert("Failed to delete");
		}
	};

	return (
		<div className="col-12 col-lg-5">
			<form onSubmit={handleSubmit} className="">
				<h2>{action === "view" ? (isEditing ? "Edit Book" : "View Book") : "Add Book"}</h2>
				{showLoading && <p>Loading book data...</p>}
				{error && <p className="text-danger mb-3">{error}</p>}

				<div className="mb-3">
					<div className="d-flex align-items-center gap-3">
						<div className="flex-grow-1">
							<label className="form-label">Title</label>
							<input
								type="text"
								name="title"
								className="form-control"
								value={formData.title}
								onChange={handleChange}
								disabled={isReadOnly}
								required
							/>
						</div>
						<div className="form-check mt-4 pt-2">
							<input
								id="autofill-title"
								type="checkbox"
								className="form-check-input"
								checked={autofillSelection.title}
								onChange={() => handleAutofillSelectionChange("title")}
							/>
							<label className="form-check-label" htmlFor="autofill-title">
								Autofill
							</label>
						</div>
					</div>
				</div>

				<div className="mb-3">
					<div className="d-flex align-items-center gap-3">
						<div className="flex-grow-1">
							<label className="form-label">ISBN</label>
							<input
								type="text"
								name="isbn"
								className="form-control"
								value={formData.isbn}
								onChange={handleChange}
								disabled={isReadOnly}
								required
							/>
						</div>
						<div className="form-check mt-4 pt-2">
							<input
								id="autofill-isbn"
								type="checkbox"
								className="form-check-input"
								checked={autofillSelection.isbn}
								onChange={() => handleAutofillSelectionChange("isbn")}
							/>
							<label className="form-check-label" htmlFor="autofill-isbn">
								Autofill
							</label>
						</div>
					</div>
				</div>

				<div className="mb-3">
					<div className="d-flex align-items-center gap-3">
						<div className="flex-grow-1">
							<label className="form-label">Cover Image URL</label>
							<input
								type="text"
								name="coverImageUrl"
								className="form-control"
								value={formData.coverImageUrl}
								onChange={handleChange}
								disabled={isReadOnly}
							/>
						</div>
						<div className="form-check mt-4 pt-2">
							<input
								id="autofill-cover-image-url"
								type="checkbox"
								className="form-check-input"
								checked={autofillSelection.coverImageUrl}
								onChange={() => handleAutofillSelectionChange("coverImageUrl")}
							/>
							<label className="form-check-label" htmlFor="autofill-cover-image-url">
								Autofill
							</label>
						</div>
					</div>
				</div>

				{formData.coverImageUrl && (
					<img
						src={formData.coverImageUrl}
						alt="Cover"
						style={{ width: "150px", height: "220px", objectFit: "cover" }}
						className="mb-3"
					/>
				)}

				<div className="mb-3">
					<label className="form-label">Authors</label>

					<div className="mb-2">
						{formData.authors.length === 0 && (
							<p className="text-muted mb-2">No authors added yet.</p>
						)}
						{formData.authors.map((a) => (
							<div key={a.id} className="d-flex align-items-center gap-2 mb-1">
								<span>
									{a.firstName} {a.lastName}
								</span>
								{isEditing && (
									<button
										type="button"
										className="btn btn-sm btn-danger"
										onClick={() => removeAuthorFromForm(a.id)}
									>
										Remove
									</button>
								)}
							</div>
						))}
					</div>

					{isEditing && (
						<>
							<input
								type="text"
								className="form-control mb-2"
								placeholder="Search author..."
								value={authorQuery}
								onChange={(e) => setAuthorQuery(e.target.value)}
							/>

							{isAuthorLoading && <p>Searching...</p>}

							<div className="list-group mb-2">
								{authorResults.map((a) => (
									<button
										key={a.id}
										type="button"
										className="list-group-item list-group-item-action"
										disabled={formData.authors.some(
											(selected) => selected.id === a.id,
										)}
										onClick={() => addAuthorToForm(a)}
									>
										{a.firstName} {a.lastName}
										{formData.authors.some((selected) => selected.id === a.id)
											? " (added)"
											: ""}
									</button>
								))}
							</div>

							<button
								type="button"
								className="btn btn-outline-primary"
								onClick={() => setShowAddAuthorModal(true)}
							>
								Create New Author
							</button>
						</>
					)}
				</div>

				<div className="mb-3">
					<div className="d-flex align-items-center gap-3">
						<div className="flex-grow-1">
							<label className="form-label">Published Year</label>
							<input
								type="number"
								name="publishedYear"
								className="form-control"
								value={formData.publishedYear}
								onChange={handleChange}
								disabled={isReadOnly}
							/>
						</div>
						<div className="form-check mt-4 pt-2">
							<input
								id="autofill-published-year"
								type="checkbox"
								className="form-check-input"
								checked={autofillSelection.publishedYear}
								onChange={() => handleAutofillSelectionChange("publishedYear")}
							/>
							<label className="form-check-label" htmlFor="autofill-published-year">
								Autofill
							</label>
						</div>
					</div>
				</div>

				<div className="mb-3">
					<div className="d-flex align-items-start gap-3">
						<div className="flex-grow-1">
							<label className="form-label">Description</label>
							<textarea
								name="description"
								className="form-control"
								rows={4}
								value={formData.description}
								onChange={handleChange}
								disabled={isReadOnly}
							/>
						</div>
						<div className="form-check mt-4 pt-2">
							<input
								id="autofill-description"
								type="checkbox"
								className="form-check-input"
								checked={autofillSelection.description}
								onChange={() => handleAutofillSelectionChange("description")}
							/>
							<label className="form-check-label" htmlFor="autofill-description">
								Autofill
							</label>
						</div>
					</div>
				</div>

				{isEditing && (
					<div className="d-flex gap-2 mt-3">
						<button type="submit" className="btn btn-primary">
							{action === "view" ? "Save Changes" : "Create Book"}
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={handleClearAddForm}
						>
							Clear Form
						</button>
					</div>
				)}
			</form>

			<div className="d-flex flex-wrap gap-2 mt-3">
				{action === "view" && (
					<button type="button" className="btn btn-danger" onClick={handleDelete}>
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

			{showAddAuthorModal && (
				<div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Add Author</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowAddAuthorModal(false)}
								/>
							</div>
							<div className="modal-body">
								<input
									type="text"
									className="form-control mb-2"
									placeholder="First name"
									value={newAuthor.firstName}
									onChange={(e) =>
										setNewAuthor((prev) => ({
											...prev,
											firstName: e.target.value,
										}))
									}
								/>
								<input
									type="text"
									className="form-control mb-2"
									placeholder="Last name"
									value={newAuthor.lastName}
									onChange={(e) =>
										setNewAuthor((prev) => ({
											...prev,
											lastName: e.target.value,
										}))
									}
								/>
								<textarea
									className="form-control"
									placeholder="Bio"
									value={newAuthor.bio}
									onChange={(e) =>
										setNewAuthor((prev) => ({ ...prev, bio: e.target.value }))
									}
								/>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setShowAddAuthorModal(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleAddNewAuthor}
								>
									Add Author
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BookAddEdit;
