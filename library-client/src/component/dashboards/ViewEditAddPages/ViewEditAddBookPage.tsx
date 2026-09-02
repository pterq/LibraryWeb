import React, { useEffect, useState } from "react";
import ReturnButton from "../../common/ReturnButton";
import axiosClient from "../../../api/axiosClient";

import { actionFromLink, idFromLink, type PageAction } from "../../../context/DataFromLink";
import BookSearch from "./BookSearch";

import type { AuthorType, BookType } from "../../../types/DbTypes";

type BookFormData = {
	title: string;
	description: string;
	isbn: string;
	publishedYear: string;
	authors: AuthorType[]; // pełne obiekty
	categories: string[];
	genre: string[];
	coverImageUrl?: string;
};

type AutofillFieldKey = "title" | "description" | "isbn" | "publishedYear" | "coverImageUrl";

type AutofillSelection = Record<AutofillFieldKey, boolean>;

const EMPTY_FORM: BookFormData = {
	title: "",
	description: "",
	isbn: "",
	publishedYear: "",
	authors: [],
	categories: [],
	genre: [],
	coverImageUrl: "",
};

const DEFAULT_AUTOFILL_SELECTION: AutofillSelection = {
	title: true,
	description: true,
	isbn: true,
	publishedYear: true,
	coverImageUrl: true,
};

const ViewEditAddBookPage = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingBookAction = action === "view";

	const [formData, setFormData] = useState<BookFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<BookFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [autofillSelection, setAutofillSelection] = useState<AutofillSelection>(
		DEFAULT_AUTOFILL_SELECTION,
	);

	// AUTHOR SEARCH
	const [authorQuery, setAuthorQuery] = useState("");
	const [authorResults, setAuthorResults] = useState<AuthorType[]>([]);
	const [isAuthorLoading, setIsAuthorLoading] = useState(false);

	// MODAL ADD AUTHOR
	const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
	const [newAuthor, setNewAuthor] = useState({ firstName: "", lastName: "", bio: "" });

	// =============================================================
	// LOAD BOOK WHEN VIEWING
	// =============================================================
	useEffect(() => {
		if (!isExistingBookAction) {
			setFormData(EMPTY_FORM);
			setAutofillSelection(DEFAULT_AUTOFILL_SELECTION);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing book id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadBook = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/books/${linkId}`);
				const book = response.data as BookType;

				if (!isActive) return;

				const nextFormData: BookFormData = {
					title: book.title ?? "",
					description: book.description ?? "",
					isbn: book.isbn ?? "",
					publishedYear: book.publishedYear ? String(book.publishedYear) : "",
					authors: book.authors?.authors ?? [],
					categories: book.categories?.map((c: { name: string }) => c.name) ?? [],
					genre: [],
					coverImageUrl: book.coverImageUrl ?? "",
				};

				setFormData(nextFormData);
				setOriginalFormData(nextFormData);
			} catch {
				if (!isActive) return;

				setError("Failed to load book data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadBook();

		return () => {
			isActive = false;
		};
	}, [action, isExistingBookAction, linkId]);

	// =============================================================
	// AUTHOR SEARCH HANDLER
	// =============================================================
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

	// debounce author search
	useEffect(() => {
		const timer = setTimeout(() => searchAuthors(authorQuery), 300);
		return () => clearTimeout(timer);
	}, [authorQuery]);

	// =============================================================
	// ADD AUTHOR FROM SEARCH
	// =============================================================
	const addAuthorToForm = (author: AuthorType) => {
		setFormData((prev) => ({
			...prev,
			authors: [...prev.authors, author],
		}));
	};

	// REMOVE AUTHOR
	const removeAuthorFromForm = (id: number) => {
		setFormData((prev) => ({
			...prev,
			authors: prev.authors.filter((a) => a.id !== id),
		}));
	};

	// =============================================================
	// ADD NEW AUTHOR (MODAL)
	// =============================================================
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

	// =============================================================
	// FORM HANDLERS
	// =============================================================
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

		const payload: BookType = {
			id: 0,
			title: formData.title,
			description: formData.description,
			isbn: formData.isbn,
			publishedYear: Number(formData.publishedYear),
			authors: {
				id: 0,
				authors: formData.authors,
			},
			categories: formData.categories.map((name) => ({
				id: 0,
				name,
			})),
			coverImageUrl: formData.coverImageUrl,
		};

		console.log("Submitting:", payload);

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

		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		setError(null);
	};

	const handleClearAddForm = () => {
		setFormData(EMPTY_FORM);
		setAutofillSelection(DEFAULT_AUTOFILL_SELECTION);
		setError(null);
		setAuthorQuery("");
		setAuthorResults([]);
	};

	// =============================================================
	// DELETE HANDLER
	// =============================================================
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

	// =============================================================
	// RENDER
	// =============================================================
	return (
		<div className="container py-3">
			<ReturnButton />

			<div className="d-flex flex-wrap gap-2 mb-3">
				{action === "view" && (
					<button type="button" className="btn btn-danger" onClick={handleDelete}>
						Delete
					</button>
				)}
				{action === "view" && !isEditing && (
					<button className="btn btn-primary" onClick={() => setIsEditing(true)}>
						Edit
					</button>
				)}
				{action === "view" && isEditing && (
					<button type="button" className="btn btn-warning" onClick={handleCancelEdit}>
						Cancel
					</button>
				)}
			</div>

			{isLoading && <p>Loading book data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="row g-4">
					<div className="col-12 col-lg-5">
						<h2>
							{action === "view"
								? isEditing
									? "Edit Book"
									: "View Book"
								: "Add Book"}
						</h2>
						{/* TITLE */}
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

						{/* ISBN */}
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

						{/* COVER */}
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
										onChange={() =>
											handleAutofillSelectionChange("coverImageUrl")
										}
									/>
									<label
										className="form-check-label"
										htmlFor="autofill-cover-image-url"
									>
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

						{/* AUTHORS */}
						<div className="mb-3">
							<label className="form-label">Authors</label>

							<div className="mb-2">
								{formData.authors.map((a) => (
									<div
										key={a.id}
										className="d-flex align-items-center gap-2 mb-1"
									>
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
												onClick={() => addAuthorToForm(a)}
											>
												{a.firstName} {a.lastName}
											</button>
										))}
									</div>

									<button
										type="button"
										className="btn btn-outline-primary"
										onClick={() => setShowAddAuthorModal(true)}
									>
										Add new author
									</button>
								</>
							)}
						</div>

						{/* PUBLISHED YEAR */}
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
										onChange={() =>
											handleAutofillSelectionChange("publishedYear")
										}
									/>
									<label
										className="form-check-label"
										htmlFor="autofill-published-year"
									>
										Autofill
									</label>
								</div>
							</div>
						</div>

						{/* DESCRIPTION */}
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
										onChange={() =>
											handleAutofillSelectionChange("description")
										}
									/>
									<label
										className="form-check-label"
										htmlFor="autofill-description"
									>
										Autofill
									</label>
								</div>
							</div>
						</div>

						{/* SUBMIT */}
						{isEditing && (
							<div className="d-flex gap-2 mt-3">
								{action === "add" && (
									<button
										type="button"
										className="btn btn-secondary"
										onClick={handleClearAddForm}
									>
										Clear
									</button>
								)}
								<button type="submit" className="btn btn-primary">
									{action === "view" ? "Save Changes" : "Create Book"}
								</button>
							</div>
						)}
					</div>

					<div className="d-none d-lg-flex col-lg-2 justify-content-center">
						<div className="h-100 border-start" />
					</div>

					<div className="col-12 col-lg-5">
						<div className="mt-0 pt-0">
							<h2 className="mb-3">Search & Autofill</h2>
							<BookSearch
								onSelect={(book) => {
									setFormData((prev) => ({
										...prev,
										title: autofillSelection.title ? book.title : prev.title,
										description: autofillSelection.description
											? book.description
											: prev.description,
										isbn: autofillSelection.isbn ? book.isbn : prev.isbn,
										publishedYear: autofillSelection.publishedYear
											? book.publishedYear
											: prev.publishedYear,
										coverImageUrl: autofillSelection.coverImageUrl
											? (book.coverUrl ?? "")
											: prev.coverImageUrl,
									}));

									if (action === "view") {
										setIsEditing(true);
									}
								}}
							/>
						</div>
					</div>
				</div>
			</form>

			{/* ADD AUTHOR MODAL */}
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

export default ViewEditAddBookPage;
