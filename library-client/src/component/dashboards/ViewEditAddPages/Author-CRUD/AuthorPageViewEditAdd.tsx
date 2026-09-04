import React, { useEffect, useState } from "react";

import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import ReturnButton from "../../../common/ReturnButton";

import DeleteButton from "../../ViewEditAddPages/DeleteButton";
import type {} from "../../../../types/DbTypes";

import {
	getAuthorById,
	deleteAuthorById,
	updateAuthorById,
	addAuthorById,
} from "../../../../api/api";

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
	const [originalFormData, setOriginalFormData] = useState<AuthorFormData>(EMPTY_FORM);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// =============================================================
	// LOAD AUTHOR FROM API
	// =============================================================
	useEffect(() => {
		if (!isExistingAuthorAction) {
			setFormData(EMPTY_FORM);
			setOriginalFormData(EMPTY_FORM);
			setError(null);
			setSuccess(null);
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

		const loadAuthor = async () => {
			setIsLoading(true);
			setError(null);
			setSuccess(null);

			try {
				const author = await getAuthorById(Number(linkId));
				if (!isActive) return;

				if (!author) {
					setError("Author not found.");
					setFormData(EMPTY_FORM);
					return;
				}

				const nextFormData = {
					firstName: author.firstName ?? "",
					lastName: author.lastName ?? "",
					biography: author.biography ?? "",
				};

				setFormData(nextFormData);
				setOriginalFormData(nextFormData);
			} catch {
				if (!isActive) return;
				setError("Failed to load author data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) setIsLoading(false);
			}
		};

		loadAuthor();

		return () => {
			isActive = false;
		};
	}, [action, linkId, isExistingAuthorAction]);

	// =============================================================
	// PAGE TITLE
	// =============================================================
	const pageTitle =
		action === "view" ? (isEditing ? "Edit Author" : "View Author") : "Add Author";

	// =============================================================
	// FORM CHANGE HANDLER
	// =============================================================
	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// =============================================================
	// SUBMIT HANDLER (ADD / UPDATE)
	// =============================================================
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (isReadOnly) return;

		setError(null);
		setSuccess(null);

		// ADD MODE → CREATE
		if (action === "add") {
			try {
				setIsLoading(true);

				await addAuthorById(formData);

				setSuccess("Author created successfully.");
				setFormData(EMPTY_FORM);
				setOriginalFormData(EMPTY_FORM);
			} catch {
				setError("Failed to create author.");
			} finally {
				setIsLoading(false);
			}

			return;
		}

		// VIEW/EDIT MODE → UPDATE
		if (!linkId) {
			setError("Cannot update author: missing id.");
			return;
		}

		try {
			setIsLoading(true);

			await updateAuthorById(Number(linkId), formData);

			setOriginalFormData(formData);
			setIsEditing(false);
			setSuccess("Author updated successfully.");
		} catch {
			setError("Failed to update author.");
		} finally {
			setIsLoading(false);
		}
	};

	// =============================================================
	// CANCEL EDIT
	// =============================================================
	const handleCancelEdit = () => {
		setError(null);
		setSuccess(null);

		if (action === "view") {
			setFormData(originalFormData);
			setIsEditing(false);
			return;
		}

		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		window.history.back();
	};

	// =============================================================
	// CLEAR FORM (ADD MODE)
	// =============================================================
	const handleClearAddForm = () => {
		setFormData(EMPTY_FORM);
		setOriginalFormData(EMPTY_FORM);
		setError(null);
		setSuccess(null);
	};

	// =============================================================
	// DELETE AUTHOR
	// =============================================================
	const handleDelete = async () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete author: invalid id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this author?");
		if (!shouldDelete) return;

		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await deleteAuthorById(Number(linkId));
			setSuccess("Author deleted successfully.");
			window.history.back();
		} catch {
			setError("Failed to delete author.");
		} finally {
			setIsLoading(false);
		}
	};

	// =============================================================
	// RENDER
	// =============================================================
	return (
		<div className="container py-3">
			<ReturnButton />

			{isLoading && <p>Loading author data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}
			{success && <p className="text-success mb-3">{success}</p>}

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

						{action === "add" && (
							<button
								type="button"
								className="btn btn-secondary"
								onClick={handleClearAddForm}
								disabled={isLoading}
							>
								Clear Form
							</button>
						)}
					</div>
				)}
			</form>

			<div className="d-flex flex-wrap gap-2 mt-3">
				{action === "view" && (
					<DeleteButton
						id={Number(linkId)}
						name={`${formData.firstName} ${formData.lastName}`}
						entityName="author"
						onDelete={() => handleDelete()}
					/>
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
