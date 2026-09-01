import React, { useEffect, useState } from "react";

import axiosClient from "../../../api/axiosClient";

type PageAction = "view" | "add";
type CopyStatus = "AVAILABLE" | "RESERVED" | "BORROWED" | "DAMAGED" | "LOST";

type BookCopyFormData = {
	bookId: string;
	inventoryCode: string;
	status: CopyStatus;
};

const COPY_STATUSES: CopyStatus[] = ["AVAILABLE", "RESERVED", "BORROWED", "DAMAGED", "LOST"];

const EMPTY_FORM: BookCopyFormData = {
	bookId: "",
	inventoryCode: "",
	status: "AVAILABLE",
};

const ViewEditAddBookCopyPage = () => {
	const path = window.location.pathname;
	const action: PageAction = path.includes("/view") ? "view" : "add";

	const rawId = path.split("/").pop() ?? "";
	const parsedCopyId = Number(rawId);
	const copyId = Number.isFinite(parsedCopyId) ? parsedCopyId : null;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingCopyAction = action === "view";

	const [formData, setFormData] = useState<BookCopyFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isExistingCopyAction) {
			setFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!copyId) {
			setError("Invalid or missing book copy id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadCopy = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/copies/${copyId}`);
				const copy = response.data as {
					book?: { id?: number | string | null } | null;
					inventoryCode?: string;
					status?: CopyStatus;
				};

				if (!isActive) {
					return;
				}

				setFormData({
					bookId:
						typeof copy.book?.id === "number" || typeof copy.book?.id === "string"
							? String(copy.book.id)
							: "",
					inventoryCode: copy.inventoryCode ?? "",
					status: copy.status ?? "AVAILABLE",
				});
			} catch {
				if (!isActive) {
					return;
				}

				setError("Failed to load book copy data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadCopy();

		return () => {
			isActive = false;
		};
	}, [action, copyId, isExistingCopyAction]);

	const pageTitle =
		action === "view" ? (isEditing ? "Edit Book Copy" : "View Book Copy") : "Add Book Copy";

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (isReadOnly) {
			return;
		}

		console.log("Form submit payload:", {
			book: { id: Number(formData.bookId) },
			inventoryCode: formData.inventoryCode,
			status: formData.status,
		});
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

			{isLoading && <p>Loading book copy data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label htmlFor="bookId" className="form-label">
						Book Id
					</label>
					<input
						type="number"
						id="bookId"
						name="bookId"
						className="form-control"
						value={formData.bookId}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						min="1"
						required
					/>
				</div>

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
					>
						{COPY_STATUSES.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
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
