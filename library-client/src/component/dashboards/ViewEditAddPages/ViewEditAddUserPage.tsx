import React, { useEffect, useState } from "react";

import axiosClient from "../../../api/axiosClient";
import type { UserType } from "../../../types/DbTypes";
import { useAuth } from "../../../context/AuthContext";
import { actionFromLink, idFromLink, type PageAction } from "../../../context/DataFromLink";

type UserFormData = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	role: UserType["role"];
};

const USER_ROLES: UserType["role"][] = ["ADMIN", "LIBRARIAN", "USER"];

const EMPTY_FORM: UserFormData = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	role: "USER",
};

const ViewEditAddUserPage = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;
	const isExistingUserAction = action === "view";

	const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	//=============================================================

	const auth = useAuth();
	const LoggedInUsersRole = auth.role;

	const allowedRoles = [];
	if (LoggedInUsersRole === "ADMIN") {
		allowedRoles.push("ADMIN", "LIBRARIAN", "USER");
	} else if (LoggedInUsersRole === "LIBRARIAN") {
		allowedRoles.push("USER");
	} else if (LoggedInUsersRole === "USER") {
		allowedRoles.push("USER");
	}

	//=============================================================

	useEffect(() => {
		if (!isExistingUserAction) {
			setFormData(EMPTY_FORM);
			setError(null);
			setIsEditing(true);
			return;
		}

		setIsEditing(false);

		if (!linkId) {
			setError("Invalid or missing user id in URL.");
			setFormData(EMPTY_FORM);
			return;
		}

		let isActive = true;

		const loadUser = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await axiosClient.get(`/user/${linkId}`);
				const user = response.data as {
					firstName?: string;
					lastName?: string;
					email?: string;
					phone?: string | null;
					role?: UserType["role"];
				};

				if (!isActive) {
					return;
				}

				setFormData({
					firstName: user.firstName ?? "",
					lastName: user.lastName ?? "",
					email: user.email ?? "",
					phone: user.phone ?? "",
					role: user.role ?? "USER",
				});
			} catch {
				if (!isActive) {
					return;
				}

				setError("Failed to load user data.");
				setFormData(EMPTY_FORM);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadUser();

		return () => {
			isActive = false;
		};
	}, [action, isExistingUserAction, linkId]);

	const pageTitle = action === "view" ? (isEditing ? "Edit User" : "View User") : "Add User";

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	//=============================================================

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (isReadOnly) {
			return;
		}

		// API write actions can be attached here later.
		console.log("Form submit payload:", formData);
	};

	const [originalFormData, setOriginalFormData] = useState<UserFormData>(EMPTY_FORM);
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

	//=============================================================

	const handleDelete = () => {
		if (action !== "view" || !linkId) {
			setError("Cannot delete user: invalid user id.");
			return;
		}

		const shouldDelete = window.confirm("Are you sure you want to delete this user?");
		if (!shouldDelete) {
			return;
		}

		// Mock delete action - replace with API call when backend endpoint is ready.
		console.log("Mock delete user with id:", linkId);
		setError("Mock delete executed. Connect API call here.");
	};

	//=============================================================

	return (
		<div className="container py-3">
			<div className="mb-2">
				<button className="btn btn-secondary" onClick={() => window.history.back()}>
					Back
				</button>
			</div>

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

			{isLoading && <p>Loading user data...</p>}
			{error && <p className="text-danger mb-3">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
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
					<label htmlFor="email" className="form-label">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						className="form-control"
						value={formData.email}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="phone" className="form-label">
						Phone
					</label>
					<input
						type="text"
						id="phone"
						name="phone"
						className="form-control"
						value={formData.phone}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="role" className="form-label">
						Role
					</label>
					<select
						id="role"
						name="role"
						className="form-select"
						value={formData.role}
						onChange={handleChange}
						disabled={isReadOnly || isLoading}
					>
						{USER_ROLES.map((role) => (
							<option key={role} value={role}>
								{role}
							</option>
						))}
					</select>
				</div>

				{!isReadOnly && (
					<button type="submit" className="btn btn-primary" disabled={isLoading}>
						{action === "view" ? "Save Changes" : "Create User"}
					</button>
				)}
			</form>
		</div>
	);
};

export default ViewEditAddUserPage;
