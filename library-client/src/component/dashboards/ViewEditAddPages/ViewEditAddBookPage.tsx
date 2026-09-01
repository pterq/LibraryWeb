import React, { useEffect, useState } from "react";

import axiosClient from "../../../api/axiosClient";

type PageAction = "view" | "add";

type BookFormData = {
	title: string;
	authors: string[];
	description: string;
	isbn: string;
	publishedYear: string;
	categories: string[];
};

const EMPTY_FORM: BookFormData = {
	title: "",
	authors: [],
	categories: [],
	description: "",
	isbn: "",
	publishedYear: "",
};

const ViewEditAddBookPage = () => {
	const path = window.location.pathname;
	const action: PageAction = path.includes("/view") ? "view" : "add";

	const rawId = path.split("/").pop() ?? "";
	const parsedBookId = Number(rawId);
	const bookId = Number.isFinite(parsedBookId) ? parsedBookId : null;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingBookAction = action === "view";

	const [formData, setFormData] = useState<BookFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isExistingBookAction) {
			setFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!bookId) {
			setError("Invalid or missing book id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadBook = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/books/${bookId}`);
				const book = response.data as {
					title?: string;
					authors?: string[];
					categories?: string[];
					description?: string;
					isbn?: string;
					publishedYear?: number;
				};

				if (!isActive) {
					return;
				}

				setFormData({
					title: book.title ?? "",
					authors: book.authors ?? [],
					categories: book.categories ?? [],
					description: book.description ?? "",
					isbn: book.isbn ?? "",
					publishedYear:
						typeof book.publishedYear === "number" ? String(book.publishedYear) : "",
				});
			} catch {
				if (!isActive) {
					return;
				}

				setError("Failed to load book data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadBook();

		return () => {
			isActive = false;
		};
	}, [action, isExistingBookAction, bookId]);

	const pageTitle = action === "view" ? (isEditing ? "Edit Book" : "View Book") : "Add Book";

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (isReadOnly) {
			return;
		}

		// API write actions can be attached here later.
		console.log("Form submit payload:", formData);
	};

	return (
		<div className="container py-3">
			<div className="d-flex flex-wrap gap-2 mb-3">
				<button className="btn btn-secondary" onClick={() => window.history.back()}>
					Back
				</button>
				{action === "view" && !isEditing && (
					<button className="btn btn-primary" onClick={() => setIsEditing(true)}>
						Edit
					</button>
				)}
			</div>
			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading book data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						type="text"
						id="title"
						name="title"
						className="form-control"
						value={formData.title}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="isbn" className="form-label">
						ISBN
					</label>
					<input
						type="text"
						id="isbn"
						name="isbn"
						className="form-control"
						value={formData.isbn}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="authors" className="form-label">
						Authors
					</label>
					<input
						type="text"
						id="authors"
						name="authors"
						className="form-control"
						value={formData.authors.join(", ")}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								authors: e.target.value.split(",").map((author) => author.trim()),
							}))
						}
						disabled={isReadOnly || isLoading}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="publishedYear" className="form-label">
						Published Year
					</label>
					<input
						type="number"
						id="publishedYear"
						name="publishedYear"
						className="form-control"
						value={formData.publishedYear}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="description" className="form-label">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						className="form-control"
						rows={4}
						value={formData.description}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
					/>
				</div>

				{!isReadOnly && (
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{action === "view" ? "Save Changes" : "Create Book"}
					</button>
				)}
			</form>
		</div>
	);
};

export default ViewEditAddBookPage;
