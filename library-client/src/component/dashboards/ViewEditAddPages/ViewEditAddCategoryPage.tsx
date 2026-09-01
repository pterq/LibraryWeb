import React, { useEffect, useState } from "react";

import axiosClient from "../../../api/axiosClient";

type PageAction = "view" | "add";

type CategoryFormData = {
	name: string;
};

const EMPTY_FORM: CategoryFormData = {
	name: "",
};

const ViewEditAddCategoryPage = () => {
	const path = window.location.pathname;
	const action: PageAction = path.includes("/view") ? "view" : "add";

	const rawId = path.split("/").pop() ?? "";
	const parsedCategoryId = Number(rawId);
	const categoryId = Number.isFinite(parsedCategoryId) ? parsedCategoryId : null;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingCategoryAction = action === "view";

	const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isExistingCategoryAction) {
			setFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!categoryId) {
			setError("Invalid or missing category id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadCategory = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/categories/${categoryId}`);
				const category = response.data as {
					name?: string;
				};

				if (!isActive) {
					return;
				}

				setFormData({
					name: category.name ?? "",
				});
			} catch {
				if (!isActive) {
					return;
				}

				setError("Failed to load category data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadCategory();

		return () => {
			isActive = false;
		};
	}, [action, categoryId, isExistingCategoryAction]);

	const pageTitle =
		action === "view" ? (isEditing ? "Edit Category" : "View Category") : "Add Category";

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (isReadOnly) {
			return;
		}

		console.log("Form submit payload:", formData);
	};

	const [originalFormData, setOriginalFormData] = useState<CategoryFormData>(EMPTY_FORM);
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
				{isEditing && (
					<button type="button" className="btn btn-danger" onClick={handleCancelEdit}>
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
