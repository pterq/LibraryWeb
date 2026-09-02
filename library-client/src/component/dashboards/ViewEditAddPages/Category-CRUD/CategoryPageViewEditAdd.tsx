import React, { useEffect, useState } from "react";

import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import ReturnButton from "../../../common/ReturnButton";

import { MockData } from "../../../../types/MockData";

type CategoryFormData = {
	name: string;
};

const EMPTY_FORM: CategoryFormData = { name: "" };

const CategoryPageViewEditAdd = () => {
	const action: PageAction = actionFromLink; // "view" lub "add"
	const linkId = idFromLink;

	const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<CategoryFormData>(EMPTY_FORM);

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ============================
	// LOAD CATEGORY FROM MOCKDATA
	// ============================
	useEffect(() => {
		if (action !== "view") {
			// ADD MODE
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setIsEditing(true);
			return;
		}

		// VIEW MODE
		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing category id in URL.");
			return;
		}

		let isActive = true;

		const loadCategory = () => {
			setIsLoading(true);
			setError(null);

			try {
				const category = MockData.mockCategories.find((c) => c.id === Number(linkId));

				if (!isActive) return;

				if (!category) {
					setError("Category not found in MockData.");
					return;
				}

				const loaded = { name: category.name };

				setFormData(loaded);
				setOriginalFormData(loaded);
			} catch {
				if (!isActive) return;
				setError("Failed to load category data.");
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		loadCategory();

		return () => {
			isActive = false;
		};
	}, [action, linkId]);

	// ============================
	// HANDLERS
	// ============================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (isReadOnly) return;

		console.log("Form submit payload:", formData);
	};

	const handleCancelEdit = () => {
		if (action === "view") {
			setFormData(originalFormData);
			setIsEditing(false);
			setError(null);
			return;
		}

		// ADD MODE
		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		setError(null);
		window.history.back();
	};

	const handleClear = () => {
		if (action === "view") {
			setFormData(originalFormData);
			setError(null);
			return;
		}

		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		setError(null);
	};

	const handleDelete = () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete item: invalid item id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this item?");
		if (!shouldDelete) return;

		console.log("Mock delete item with id:", linkId);
		setError("Mock delete executed. Connect API call here.");
	};

	// ============================
	// RENDER
	// ============================
	const pageTitle =
		action === "view" ? (isEditing ? "Edit Category" : "View Category") : "Add Category";

	return (
		<div className="container py-3">
			<ReturnButton />
			<h2>{pageTitle}</h2>

			{isLoading && <p>Loading category data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label htmlFor="name" className="form-label">
						Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						className="form-control"
						value={formData.name}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					/>
				</div>

				{!isReadOnly && (
					<div className="d-flex gap-2 mt-3">
						<button type="submit" className="btn btn-primary" disabled={isLoading}>
							{action === "view" ? "Save Changes" : "Create Category"}
						</button>

						<button type="button" className="btn btn-secondary" onClick={handleClear}>
							Clear
						</button>
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

export default CategoryPageViewEditAdd;
