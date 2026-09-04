import React, { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import type { AuthorType, CategoryType } from "../../../../types/DbTypes";
import type { PageAction } from "../../../../context/DataFromLink";
import { addBook, getCategories, type BookCreatePayload } from "../../../../api/api";
import { Navigate, useNavigate } from "react-router";

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

const normalizePublishedYearValue = (value: string | number | null | undefined) => {
	if (value == null || value === "") return null;

	const asString = String(value);
	const match = asString.match(/^\d{4}/);
	if (!match) return null;

	const year = Number(match[0]);
	return Number.isFinite(year) ? year : null;
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
	const navigate = useNavigate();

	const [authorOptions, setAuthorOptions] = useState<AuthorType[]>([]);
	const [categoryOptions, setCategoryOptions] = useState<CategoryType[]>([]);
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(["NO_AUTHOR_ID"]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>("NO_CATEGORY_ID");
	const [isAuthorLoading, setIsAuthorLoading] = useState(false);
	const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
	const [newAuthor, setNewAuthor] = useState({ firstName: "", lastName: "", bio: "" });

	const getAuthorLabel = (author: AuthorType) =>
		`${author.firstName} ${author.lastName}`.trim() || `Author #${author.id}`;

	useEffect(() => {
		let isActive = true;

		const loadAuthors = async () => {
			setIsAuthorLoading(true);

			try {
				const res = await axiosClient.get("/authors");
				const apiAuthors = res.data as AuthorType[];

				if (!isActive) return;

				if (Array.isArray(apiAuthors) && apiAuthors.length > 0) {
					setAuthorOptions(apiAuthors);
					return;
				}

				setAuthorOptions([]);
			} catch {
				if (!isActive) return;
				setAuthorOptions([]);
			} finally {
				if (isActive) setIsAuthorLoading(false);
			}
		};

		const loadCategories = async () => {
			try {
				const data = await getCategories();
				if (!isActive) return;
				setCategoryOptions(Array.isArray(data) ? data : []);
			} catch {
				if (!isActive) return;
				setCategoryOptions([]);
			}
		};

		void loadAuthors();
		void loadCategories();

		return () => {
			isActive = false;
		};
	}, []);

	type ApiBook = {
		title?: string;
		description?: string;
		isbn?: string;
		publishedYear?: number | string | null;
		authors?: { authors?: AuthorType[] } | AuthorType[] | null;
		category?: { id?: number; name?: string } | null;
		categories?: { id?: number; name?: string }[] | null;
		imageUrl?: string | null;
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
			setSelectedAuthorIds(["NO_AUTHOR_ID"]);
			setSelectedCategoryId("NO_CATEGORY_ID");
			setShowLoading(false);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing book id in URL.");
			setFormData(EMPTY_BOOK_FORM);
			setOriginalFormData(EMPTY_BOOK_FORM);
			setSelectedAuthorIds(["NO_AUTHOR_ID"]);
			setSelectedCategoryId("NO_CATEGORY_ID");
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
					coverImageUrl: book.imageUrl ?? book.coverImageUrl ?? book.coverUrl ?? "",
				};

				setFormData(loadedData);
				setOriginalFormData(loadedData);
				setSelectedAuthorIds(
					loadedData.authors.length > 0
						? loadedData.authors.map((author) => String(author.id))
						: ["NO_AUTHOR_ID"],
				);
				setSelectedCategoryId(
					book.category?.id != null ? String(book.category.id) : "NO_CATEGORY_ID",
				);
			} catch {
				if (!isActive) return;

				setError("Failed to load book data.");
				setFormData(EMPTY_BOOK_FORM);
				setOriginalFormData(EMPTY_BOOK_FORM);
				setSelectedAuthorIds(["NO_AUTHOR_ID"]);
				setSelectedCategoryId("NO_CATEGORY_ID");
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

		setAutofillSelection,
		setError,
		setFormData,
		setIsEditing,
		setOriginalFormData,
		setShowLoading,
	]);

	useEffect(() => {
		setFormData((prev) => {
			const selectedAuthors = selectedAuthorIds
				.filter((authorId) => authorId !== "NO_AUTHOR_ID")
				.map((authorId) => Number(authorId))
				.filter((authorId, index, array) => array.indexOf(authorId) === index)
				.map(
					(authorId) =>
						authorOptions.find((author) => author.id === authorId) ??
						prev.authors.find((author) => author.id === authorId),
				)
				.filter((author): author is AuthorType => Boolean(author));

			const hasSameAuthors =
				prev.authors.length === selectedAuthors.length &&
				prev.authors.every((author, index) => author.id === selectedAuthors[index]?.id);

			if (hasSameAuthors) return prev;

			return {
				...prev,
				authors: selectedAuthors,
			};
		});
	}, [selectedAuthorIds, authorOptions, setFormData]);

	const handleAuthorSelectChange = (index: number, value: string) => {
		setSelectedAuthorIds((prev) => {
			const next = [...prev];
			next[index] = value;
			return next;
		});
	};

	const handleCategorySelectChange = (value: string) => {
		setSelectedCategoryId(value);
	};

	const handleAddNextAuthorDropdown = () => {
		setSelectedAuthorIds((prev) => [...prev, "NO_AUTHOR_ID"]);
	};

	const handleRemoveAuthorDropdown = (index: number) => {
		setSelectedAuthorIds((prev) => {
			if (prev.length <= 1) return ["NO_AUTHOR_ID"];
			const next = prev.filter((_, itemIndex) => itemIndex !== index);
			return next.length > 0 ? next : ["NO_AUTHOR_ID"];
		});
	};

	const handleAddNewAuthor = async () => {
		try {
			const res = await axiosClient.post("/authors", newAuthor);
			const created = res.data as AuthorType;

			setAuthorOptions((prev) =>
				prev.some((author) => author.id === created.id) ? prev : [...prev, created],
			);
			setSelectedAuthorIds((prev) => {
				const emptyIndex = prev.findIndex((id) => id === "NO_AUTHOR_ID");

				if (emptyIndex >= 0) {
					const next = [...prev];
					next[emptyIndex] = String(created.id);
					return next;
				}

				return [...prev, String(created.id)];
			});
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

		const normalizedCoverImageUrl = formData.coverImageUrl?.trim() ?? "";

		const payload: BookCreatePayload = {
			title: formData.title,
			description: formData.description,
			imageUrl: normalizedCoverImageUrl.length > 0 ? normalizedCoverImageUrl : null,
			isbn: formData.isbn,
			publishedYear: normalizePublishedYearValue(formData.publishedYear),
			categoryId: selectedCategoryId === "NO_CATEGORY_ID" ? null : Number(selectedCategoryId),
			authorIds: selectedAuthorIds
				.filter((authorId) => authorId !== "NO_AUTHOR_ID")
				.map((authorId) => Number(authorId))
				.filter((authorId, index, array) => array.indexOf(authorId) === index),
		};

		try {
			if (action === "add") {
				await addBook(payload);

				console.log("Book added!");

				handleClearAddForm();
				navigate("/admin-panel", { replace: true });
			}
		} catch {
			alert("Failed to save");
		}
	};

	const handleCancelEdit = () => {
		if (action === "view") {
			setFormData(originalFormData);
			setSelectedAuthorIds(
				originalFormData.authors.length > 0
					? originalFormData.authors.map((author) => String(author.id))
					: ["NO_AUTHOR_ID"],
			);
			setSelectedCategoryId(
				originalFormData.categories.length > 0
					? String(
							categoryOptions.find(
								(category) => category.name === originalFormData.categories[0],
							)?.id ?? "NO_CATEGORY_ID",
						)
					: "NO_CATEGORY_ID",
			);
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
		setSelectedAuthorIds(["NO_AUTHOR_ID"]);
		setSelectedCategoryId("NO_CATEGORY_ID");
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

	const hasCoverImage = Boolean(formData.coverImageUrl?.trim());

	return (
		<div className="col-12 col-lg-5">
			<form onSubmit={handleSubmit} className="">
				<h2>{action === "view" ? (isEditing ? "Edit Book" : "View Book") : "Add Book"}</h2>
				{showLoading && <p>Loading book data...</p>}
				{error && <p className="text-danger mb-3">{error}</p>}

				<div className="mb-3">
					<div className="d-flex align-items-center gap-3">
						<div className="flex-grow-1">
							<label className="form-label">Title : </label>
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
							<label className="form-label">ISBN : </label>
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
							<label className="form-label">Cover Image URL : </label>
							{!isEditing ? (
								<div className="form-control-plaintext">
									{hasCoverImage ? formData.coverImageUrl : "No cover image URL"}
								</div>
							) : (
								<input
									type="text"
									name="coverImageUrl"
									className="form-control"
									value={formData.coverImageUrl}
									onChange={handleChange}
									disabled={isReadOnly}
								/>
							)}
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

				{hasCoverImage && (
					<img
						src={formData.coverImageUrl}
						alt="Cover"
						style={{ width: "150px", height: "220px", objectFit: "cover" }}
						className="mb-3"
						onError={(event) => {
							event.currentTarget.style.display = "none";
						}}
					/>
				)}

				<div className="mb-3">
					<label className="form-label">Category : </label>
					{!isEditing ? (
						<div className="form-control-plaintext">
							{formData.categories.length > 0
								? formData.categories.join(", ")
								: "No category"}
						</div>
					) : (
						<select
							className="form-select"
							value={selectedCategoryId}
							onChange={(event) => handleCategorySelectChange(event.target.value)}
							disabled={isReadOnly}
						>
							<option value="NO_CATEGORY_ID">Select category</option>
							{categoryOptions.map((category) => (
								<option key={category.id} value={String(category.id)}>
									{category.name}
								</option>
							))}
						</select>
					)}
				</div>

				<div className="mb-3">
					<label className="form-label">Authors : </label>

					{!isEditing && (
						<div className="mb-2">
							{formData.authors.length === 0 && (
								<p className="text-muted mb-2">No authors added yet.</p>
							)}
							{formData.authors.map((a) => (
								<div key={a.id} className="mb-1">
									{a.firstName} {a.lastName}
								</div>
							))}
						</div>
					)}

					{isEditing && (
						<>
							{selectedAuthorIds.map((selectedAuthorId, index) => (
								<div key={`author-select-${index}`} className="d-flex gap-2 mb-2">
									<select
										className="form-select"
										value={selectedAuthorId}
										onChange={(event) =>
											handleAuthorSelectChange(index, event.target.value)
										}
										disabled={isReadOnly || isAuthorLoading}
										required={index === 0}
									>
										<option value="NO_AUTHOR_ID">Select author</option>
										{authorOptions.map((author) => {
											const authorId = String(author.id);
											const selectedInAnotherDropdown =
												selectedAuthorIds.some(
													(id, itemIndex) =>
														itemIndex !== index && id === authorId,
												);

											return (
												<option
													key={author.id}
													value={authorId}
													disabled={selectedInAnotherDropdown}
												>
													{getAuthorLabel(author)} (ID: {author.id})
												</option>
											);
										})}
									</select>

									{selectedAuthorIds.length > 1 && (
										<button
											type="button"
											className="btn btn-outline-danger"
											onClick={() => handleRemoveAuthorDropdown(index)}
										>
											Remove
										</button>
									)}
								</div>
							))}

							<div className="d-flex flex-wrap gap-2">
								<button
									type="button"
									className="btn btn-outline-secondary"
									onClick={handleAddNextAuthorDropdown}
									disabled={isAuthorLoading}
								>
									Add Next Author
								</button>
								<button
									type="button"
									className="btn btn-outline-primary"
									onClick={() => setShowAddAuthorModal(true)}
								>
									Create New Author
								</button>
							</div>

							{isAuthorLoading && (
								<p className="text-muted mt-2 mb-0">Loading authors...</p>
							)}
						</>
					)}
				</div>

				<div className="mb-3">
					<div className="d-flex align-items-center gap-3">
						<div className="flex-grow-1">
							<label className="form-label">Published Year : </label>
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
							<label className="form-label">Description : </label>
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
