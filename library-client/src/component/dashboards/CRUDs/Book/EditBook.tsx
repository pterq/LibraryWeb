import { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import apiAuthors from "../../../../api/apiAuthors";
import apiBooks, { type BookCreatePayload } from "../../../../api/apiBooks";
import apiCategories from "../../../../api/apiCategories";
import type { AuthorType, CategoryType } from "../../../../types/DbTypes";
import BookSearchGoogle from "./BookSearchGoogle";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string, type?: "success" | "danger") => void;
};

type BookFormData = {
	title: string;
	description: string;
	isbn: string;
	publishedYear: string;
	coverImageUrl: string;
	authors: AuthorType[];
	categories: string[];
};

type AutofillFieldKey = "title" | "description" | "isbn" | "publishedYear" | "coverImageUrl";
type AutofillSelection = Record<AutofillFieldKey, boolean>;

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
};

const normalizeCategoriesPayload = (payload: unknown): CategoryType[] => {
	if (Array.isArray(payload)) return payload as CategoryType[];

	if (payload && typeof payload === "object") {
		const record = payload as { categories?: unknown; data?: unknown };

		if (Array.isArray(record.categories)) {
			return record.categories as CategoryType[];
		}

		if (Array.isArray(record.data)) {
			return record.data as CategoryType[];
		}
	}

	return [];
};

const mergeCategoryOptions = (
	apiCategories: CategoryType[],
	bookCategories: { id?: number; name?: string }[],
): CategoryType[] => {
	const fromBook = bookCategories
		.filter((category) => category?.name)
		.map((category, index) => ({
			id: category.id ?? -(index + 1),
			name: category.name ?? "",
		}));

	const merged = [...apiCategories, ...fromBook].filter((category) => category.name.trim());

	const seen = new Set<string>();
	return merged.filter((category) => {
		const key = `${category.id}-${category.name.toLowerCase()}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};

const extractCategoriesFromBooks = (books: ApiBook[]): CategoryType[] => {
	const allCategories = books.flatMap((book) => {
		const categoriesFromList = Array.isArray(book.categories) ? book.categories : [];
		const categoriesFromSingle =
			book.category?.name != null
				? [
						{
							id: book.category.id,
							name: book.category.name,
						},
					]
				: [];

		return [...categoriesFromList, ...categoriesFromSingle];
	});

	const normalized = allCategories
		.filter((category) => (category.name ?? "").trim().length > 0)
		.map((category, index) => ({
			id: category.id ?? -(index + 1),
			name: category.name ?? "",
		}));

	const seen = new Set<string>();
	return normalized.filter((category) => {
		const key = `${category.id}-${category.name.toLowerCase()}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
};

const EMPTY_FORM: BookFormData = {
	title: "",
	description: "",
	isbn: "",
	publishedYear: "",
	coverImageUrl: "",
	authors: [],
	categories: [],
};

const NO_AUTHOR_ID = "NO_AUTHOR_ID";
const NO_CATEGORY_ID = "NO_CATEGORY_ID";

const DEFAULT_AUTOFILL_SELECTION: AutofillSelection = {
	title: true,
	description: true,
	isbn: true,
	publishedYear: true,
	coverImageUrl: true,
};

const normalizePublishedYearValue = (value: string | number | null | undefined) => {
	if (value == null || value === "") return null;

	const asString = String(value);
	const match = asString.match(/^\d{4}/);
	if (!match) return null;

	const year = Number(match[0]);
	return Number.isFinite(year) ? year : null;
};

const EditBook = ({ id, onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<BookFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<BookFormData>(EMPTY_FORM);

	const [authorOptions, setAuthorOptions] = useState<AuthorType[]>([]);
	const [categoryOptions, setCategoryOptions] = useState<CategoryType[]>([]);
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([NO_AUTHOR_ID]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>(NO_CATEGORY_ID);
	const [originalCategoryId, setOriginalCategoryId] = useState<string>(NO_CATEGORY_ID);

	const [isLoading, setIsLoading] = useState(false);
	const [isAuthorLoading, setIsAuthorLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
	const [newAuthor, setNewAuthor] = useState({ firstName: "", lastName: "", biography: "" });
	const [autofillSelection, setAutofillSelection] = useState<AutofillSelection>(
		DEFAULT_AUTOFILL_SELECTION,
	);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setIsAuthorLoading(true);
			setError(null);

			try {
				const bookResponse = await axiosClient.get(`/books/${id}`);

				const [authorsResult, categoriesResult] = await Promise.allSettled([
					apiAuthors.getAuthors(),
					apiCategories.getCategories(),
				]);

				if (!active) return;

				const book = bookResponse.data as ApiBook;
				const resolvedAuthors = Array.isArray(book.authors)
					? book.authors
					: (book.authors?.authors ?? []);

				const resolvedCategoryList =
					book.categories ??
					(book.category?.name
						? [
								{
									id: book.category.id,
									name: book.category.name,
								},
							]
						: []);

				const nextForm: BookFormData = {
					title: book.title ?? "",
					description: book.description ?? "",
					isbn: book.isbn ?? "",
					publishedYear: book.publishedYear != null ? String(book.publishedYear) : "",
					coverImageUrl: book.imageUrl ?? book.coverImageUrl ?? "",
					authors: resolvedAuthors,
					categories: resolvedCategoryList
						.map((category) => category.name ?? "")
						.filter(Boolean),
				};

				setFormData(nextForm);
				setOriginalFormData(nextForm);

				const authors =
					authorsResult.status === "fulfilled" && Array.isArray(authorsResult.value)
						? authorsResult.value
						: [];

				const categoriesPayload =
					categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
				let categories = mergeCategoryOptions(
					normalizeCategoriesPayload(categoriesPayload),
					resolvedCategoryList,
				);

				if (categories.length === 0) {
					const booksForFallback = (await apiBooks.getBooks()) as ApiBook[];
					categories = mergeCategoryOptions(
						extractCategoriesFromBooks(
							Array.isArray(booksForFallback) ? booksForFallback : [],
						),
						resolvedCategoryList,
					);
				}

				if (categories.length === 0) {
					try {
						const categoriesWithCounts = await apiCategories.getCategoriesWithCounts();
						const mapped = Array.isArray(categoriesWithCounts)
							? categoriesWithCounts.map((category) => ({
									id: category.id,
									name: category.name,
								}))
							: [];

						categories = mergeCategoryOptions(mapped, resolvedCategoryList);
					} catch {
						// Keep best-effort categories gathered so far.
					}
				}

				setAuthorOptions(authors);
				setCategoryOptions(categories);

				setSelectedAuthorIds(
					nextForm.authors.length > 0
						? nextForm.authors.map((author) => String(author.id))
						: [NO_AUTHOR_ID],
				);

				const loadedCategoryId =
					resolvedCategoryList[0]?.id != null
						? String(resolvedCategoryList[0].id)
						: book.category?.id != null
							? String(book.category.id)
							: NO_CATEGORY_ID;
				setSelectedCategoryId(loadedCategoryId);
				setOriginalCategoryId(loadedCategoryId);
			} catch {
				if (active) {
					setError("Failed to load book data.");
					setFormData(EMPTY_FORM);
					setOriginalFormData(EMPTY_FORM);
					setSelectedAuthorIds([NO_AUTHOR_ID]);
					setSelectedCategoryId(NO_CATEGORY_ID);
					setOriginalCategoryId(NO_CATEGORY_ID);
				}
			} finally {
				if (active) {
					setIsLoading(false);
					setIsAuthorLoading(false);
				}
			}
		};

		void load();

		return () => {
			active = false;
		};
	}, [id]);

	const getAuthorLabel = (author: AuthorType) =>
		`${author.firstName} ${author.lastName}`.trim() || `Author #${author.id}`;

	const hasCoverImage = Boolean(formData.coverImageUrl.trim());

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleAuthorSelectChange = (index: number, value: string) => {
		setSelectedAuthorIds((prev) => {
			const next = [...prev];
			next[index] = value;
			return next;
		});
	};

	const handleAddNextAuthorDropdown = () => {
		setSelectedAuthorIds((prev) => [...prev, NO_AUTHOR_ID]);
	};

	const handleRemoveAuthorDropdown = (index: number) => {
		setSelectedAuthorIds((prev) => {
			if (prev.length <= 1) return [NO_AUTHOR_ID];
			const next = prev.filter((_, i) => i !== index);
			return next.length > 0 ? next : [NO_AUTHOR_ID];
		});
	};

	const handleAddNewAuthor = async () => {
		if (!newAuthor.firstName.trim() || !newAuthor.lastName.trim()) {
			alert("First name and last name are required.");
			return;
		}

		try {
			const created = await apiAuthors.addAuthor(newAuthor);

			setAuthorOptions((prev) =>
				prev.some((author) => author.id === created.id) ? prev : [...prev, created],
			);

			setSelectedAuthorIds((prev) => {
				const emptyIndex = prev.findIndex((authorId) => authorId === NO_AUTHOR_ID);

				if (emptyIndex >= 0) {
					const next = [...prev];
					next[emptyIndex] = String(created.id);
					return next;
				}

				return [...prev, String(created.id)];
			});

			setShowAddAuthorModal(false);
			setNewAuthor({ firstName: "", lastName: "", biography: "" });
		} catch {
			alert("Failed to add author.");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		const displayTitle = formData.title.trim() || "Untitled";

		const normalizedCoverImageUrl = formData.coverImageUrl.trim();

		const payload: BookCreatePayload = {
			title: formData.title,
			description: formData.description,
			imageUrl: normalizedCoverImageUrl.length > 0 ? normalizedCoverImageUrl : null,
			isbn: formData.isbn,
			publishedYear: normalizePublishedYearValue(formData.publishedYear),
			categoryIds: selectedCategoryId === NO_CATEGORY_ID ? [] : [Number(selectedCategoryId)],
			authorIds: selectedAuthorIds
				.filter((authorId) => authorId !== NO_AUTHOR_ID)
				.map((authorId) => Number(authorId))
				.filter((authorId, index, arr) => arr.indexOf(authorId) === index),
		};

		try {
			await axiosClient.put(`/books/${id}`, payload);

			onReload();
			showMessage(`Book \"${displayTitle}\" has been updated.`);
			onBack();
		} catch {
			const message = `Failed to update book \"${displayTitle}\".`;
			setError(message);
			showMessage(message, "danger");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData(originalFormData);
		setSelectedAuthorIds(
			originalFormData.authors.length > 0
				? originalFormData.authors.map((author) => String(author.id))
				: [NO_AUTHOR_ID],
		);
		setSelectedCategoryId(originalCategoryId);
		onBack();
	};

	const handleDelete = async () => {
		const shouldDelete = window.confirm("Are you sure you want to delete this item?");
		if (!shouldDelete) return;
		const displayTitle = formData.title.trim() || "Untitled";

		try {
			await apiBooks.deleteBookById(id);
			onReload();
			showMessage(`Book \"${displayTitle}\" has been deleted.`);
			onBack();
		} catch {
			const message = `Failed to delete book \"${displayTitle}\".`;
			setError(message);
			showMessage(message, "danger");
		}
	};

	const handleAutofillSelectionChange = (field: AutofillFieldKey) => {
		setAutofillSelection((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const handleAutofillFromGoogle = (book: {
		title: string;
		description: string;
		isbn: string;
		publishedYear: string;
		coverUrl?: string;
	}) => {
		setFormData((prev) => ({
			...prev,
			title: autofillSelection.title ? book.title : prev.title,
			description: autofillSelection.description ? book.description : prev.description,
			isbn: autofillSelection.isbn ? book.isbn : prev.isbn,
			publishedYear: autofillSelection.publishedYear
				? book.publishedYear
				: prev.publishedYear,
			coverImageUrl: autofillSelection.coverImageUrl
				? (book.coverUrl ?? "")
				: prev.coverImageUrl,
		}));
	};

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>
			</div>

			{(isLoading || isAuthorLoading) && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<div className="row g-4 mt-1">
				<div className="col-12 col-lg-7">
					<h2 className="mb-3">Edit Book</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label d-flex justify-content-between align-items-center gap-2">
								<span>Title</span>
								<span className="form-check m-0">
									<input
										id="edit-autofill-title"
										type="checkbox"
										className="form-check-input"
										checked={autofillSelection.title}
										onChange={() => handleAutofillSelectionChange("title")}
									/>
									<span className="ms-2">Autofill</span>
								</span>
							</label>
							<input
								type="text"
								name="title"
								className="form-control"
								value={formData.title}
								onChange={handleChange}
								required
								disabled={isLoading}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label d-flex justify-content-between align-items-center gap-2">
								<span>ISBN</span>
								<span className="form-check m-0">
									<input
										id="edit-autofill-isbn"
										type="checkbox"
										className="form-check-input"
										checked={autofillSelection.isbn}
										onChange={() => handleAutofillSelectionChange("isbn")}
									/>
									<span className="ms-2">Autofill</span>
								</span>
							</label>
							<input
								type="text"
								name="isbn"
								className="form-control"
								value={formData.isbn}
								onChange={handleChange}
								disabled={isLoading}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label d-flex justify-content-between align-items-center gap-2">
								<span>Cover Image URL</span>
								<span className="form-check m-0">
									<input
										id="edit-autofill-cover"
										type="checkbox"
										className="form-check-input"
										checked={autofillSelection.coverImageUrl}
										onChange={() =>
											handleAutofillSelectionChange("coverImageUrl")
										}
									/>
									<span className="ms-2">Autofill</span>
								</span>
							</label>
							<input
								type="text"
								name="coverImageUrl"
								className="form-control"
								value={formData.coverImageUrl}
								onChange={handleChange}
								disabled={isLoading}
							/>
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
							<label className="form-label">Category</label>
							<select
								className="form-select"
								value={selectedCategoryId}
								onChange={(event) => setSelectedCategoryId(event.target.value)}
								disabled={isLoading || isAuthorLoading}
							>
								<option value={NO_CATEGORY_ID}>Select category</option>
								{categoryOptions.map((category) => (
									<option key={category.id} value={String(category.id)}>
										{category.name}
									</option>
								))}
							</select>
						</div>

						<div className="mb-3">
							<label className="form-label">Authors</label>
							{selectedAuthorIds.map((selectedAuthorId, index) => (
								<div key={`author-select-${index}`} className="d-flex gap-2 mb-2">
									<select
										className="form-select"
										value={selectedAuthorId}
										onChange={(event) =>
											handleAuthorSelectChange(index, event.target.value)
										}
										disabled={isLoading || isAuthorLoading}
										required={index === 0}
									>
										<option value={NO_AUTHOR_ID}>Select author</option>
										{authorOptions.map((author) => {
											const authorId = String(author.id);
											const selectedInAnotherDropdown =
												selectedAuthorIds.some(
													(idValue, itemIndex) =>
														itemIndex !== index && idValue === authorId,
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
											disabled={isLoading}
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
									disabled={isLoading || isAuthorLoading}
								>
									Add Next Author
								</button>
								<button
									type="button"
									className="btn btn-outline-primary"
									onClick={() => setShowAddAuthorModal(true)}
									disabled={isLoading}
								>
									Create New Author
								</button>
							</div>
						</div>

						<div className="mb-3">
							<label className="form-label d-flex justify-content-between align-items-center gap-2">
								<span>Published Year</span>
								<span className="form-check m-0">
									<input
										id="edit-autofill-year"
										type="checkbox"
										className="form-check-input"
										checked={autofillSelection.publishedYear}
										onChange={() =>
											handleAutofillSelectionChange("publishedYear")
										}
									/>
									<span className="ms-2">Autofill</span>
								</span>
							</label>
							<input
								type="number"
								name="publishedYear"
								className="form-control"
								value={formData.publishedYear}
								onChange={handleChange}
								disabled={isLoading}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label d-flex justify-content-between align-items-center gap-2">
								<span>Description</span>
								<span className="form-check m-0">
									<input
										id="edit-autofill-description"
										type="checkbox"
										className="form-check-input"
										checked={autofillSelection.description}
										onChange={() =>
											handleAutofillSelectionChange("description")
										}
									/>
									<span className="ms-2">Autofill</span>
								</span>
							</label>
							<textarea
								name="description"
								className="form-control"
								rows={5}
								value={formData.description}
								onChange={handleChange}
								disabled={isLoading}
							/>
						</div>

						<button type="submit" className="btn btn-primary" disabled={isLoading}>
							Save Changes
						</button>
					</form>
				</div>

				<div className="d-none d-lg-flex col-lg-1 justify-content-center">
					<div className="h-100 border-start" />
				</div>

				<div className="col-12 col-lg-4">
					<h2 className="mb-3">Search & Autofill</h2>
					<BookSearchGoogle onSelect={handleAutofillFromGoogle} />
				</div>
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
									placeholder="Biography"
									value={newAuthor.biography}
									onChange={(e) =>
										setNewAuthor((prev) => ({
											...prev,
											biography: e.target.value,
										}))
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

export default EditBook;
