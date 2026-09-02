import React, { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";

import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import ReturnButton from "../../../common/ReturnButton";

type CategoryFormData = {
	name: string;
};

const EMPTY_FORM: CategoryFormData = {
	name: "",
};

const ViewEditAddCategoryPage = () => {
	const action: PageAction = actionFromLink; // teraz tylko "view" lub "add"
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingCategoryAction = action === "view";

	const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<CategoryFormData>(EMPTY_FORM);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isExistingCategoryAction) {
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing category id in URL.");
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadCategory = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/categories/${linkId}`);
				const category = response.data as { name?: string };

				if (!isActive) return;

				const loaded = { name: category.name ?? "" };

				setFormData(loaded);
				setOriginalFormData(loaded);
			} catch {
				if (!isActive) return;

				setError("Failed to load category data.");
				setFormData(EMPTY_FORM);
				setOriginalFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		void loadCategory();

		return () => {
			isActive = false;
		};
	}, [action, linkId, isExistingCategoryAction]);

	const pageTitle =
		action === "view" ? (isEditing ? "Edit Category" : "View Category") : "Add Category";

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
		if (!shouldDelete) return;

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
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{action === "view" ? "Save Changes" : "Create Category"}
					</button>
				)}
			</form>
		</div>
	);
};

export default ViewEditAddCategoryPage;
