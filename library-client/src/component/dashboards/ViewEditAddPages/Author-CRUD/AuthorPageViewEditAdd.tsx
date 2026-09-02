import React, { useEffect, useState } from "react";

import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import ReturnButton from "../../../common/ReturnButton";

import { MockData } from "../../../../types/MockData";

type AuthorFormData = {
	firstName: string;
	lastName: string;
	biography: string;
};

const EMPTY_FORM: AuthorFormData = {
	firstName: "",
	lastName: "",
	biography: "",
};

const AuthorPageViewEditAdd = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingAuthorAction = action === "view";

	const [formData, setFormData] = useState<AuthorFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isExistingAuthorAction) {
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing author id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadAuthor = () => {
			setIsLoading(true);
			setError(null);

			try {
				const author = MockData.mockAuthors.find((a) => a.id === Number(linkId));

				if (!isActive) {
					return;
				}

				if (!author) {
					setError("Author not found in MockData.");
					setFormData(EMPTY_FORM);
					return;
				}

				const nextFormData = {
					firstName: author.firstName ?? "",
					lastName: author.lastName ?? "",
					biography: author.bio ?? "",
				};

				setFormData(nextFormData);
				setOriginalFormData(nextFormData);
			} catch {
				if (!isActive) {
					return;
				}

				setError("Failed to load author data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		loadAuthor();

		return () => {
			isActive = false;
		};
	}, [action, linkId, isExistingAuthorAction]);

	const pageTitle =
		action === "view" ? (isEditing ? "Edit Author" : "View Author") : "Add Author";

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

	const [originalFormData, setOriginalFormData] = useState<AuthorFormData>(EMPTY_FORM);
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

	const handleClearAddForm = () => {
		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		setError(null);
	};

	//=============================================================

	const handleDelete = () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete item: invalid item id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this item?");
		if (!shouldDelete) {
			return;
		}

		// Mock delete action - replace with API call when backend endpoint is ready.
		console.log("Mock delete item with id:", linkId);
		setError("Mock delete executed. Connect API call here.");
	};

	//=============================================================

	return (
		<div className="container py-3">
			<ReturnButton />

			{isLoading && <p>Loading author data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<h2>{pageTitle}</h2>

				<div className="mb-3">
					<label htmlFor="firstName" className="form-label">
						First Name
					</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						className="form-control"
						value={formData.firstName}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="lastName" className="form-label">
						Last Name
					</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						className="form-control"
						value={formData.lastName}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="biography" className="form-label">
						Biography
					</label>
					<textarea
						id="biography"
						name="biography"
						className="form-control"
						rows={5}
						value={formData.biography}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
					/>
				</div>

				{!isReadOnly && (
					<div className="d-flex gap-2 mt-3">
						<button type="submit" className="btn btn-primary" disabled={isLoading}>
							{action === "view" ? "Save Changes" : "Create Author"}
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={handleClearAddForm}
							disabled={isLoading}
						>
							Clear Form
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

export default AuthorPageViewEditAdd;
