import { useState } from "react";
import type { UserData } from "../../types/DbTypes";

import { useAuth } from "../../context/AuthContext";

const SettingsPage = () => {
	const { token, firstName, lastName, email, role, updateUserData } = useAuth();
	const userData: UserData | null =
		token && firstName && lastName && email && role
			? {
					token,
					firstName,
					lastName,
					email,
					role,
				}
			: null;
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<UserData | null>(null);

	const [showPasswordForm, setShowPasswordForm] = useState(false);

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
		showPassword: false,
	});

	const startEditing = () => {
		if (!userData) return;
		setFormData({ ...userData });
		setIsEditing(true);
	};

	const handleInputChange = (
		field: keyof Pick<UserData, "firstName" | "lastName" | "email">,
		value: string,
	) => {
		setFormData((prev: UserData | null) => {
			if (!prev) return prev;
			return { ...prev, [field]: value };
		});
	};

	const saveChanges = () => {
		if (!formData) return;

		updateUserData("firstName", formData.firstName);
		updateUserData("lastName", formData.lastName);
		updateUserData("email", formData.email);
		setIsEditing(false);
	};

	const cancelEditing = () => {
		setFormData(null);
		setIsEditing(false);
	};

	// ---------------- PASSWORD FORM ----------------

	const handlePasswordChange = (field: keyof typeof passwordForm, value: string | boolean) => {
		setPasswordForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const saveNewPassword = () => {
		if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
			alert("New passwords do not match!");
			return;
		}

		// TODO: wysłać na backend
		console.log("Password changed:", passwordForm.newPassword);

		setShowPasswordForm(false);
	};

	return (
		<div className="container py-4">
			<h2>User Settings</h2>

			{!userData ? (
				<p>No user data in localStorage.</p>
			) : (
				<div className="card p-4 mt-3">
					{/* ---------------- USER DATA FORM ---------------- */}
					{isEditing && formData ? (
						<>
							<h4>Edit User Data</h4>

							<div className="mb-3">
								<label className="form-label">First Name</label>
								<input
									className="form-control"
									value={formData.firstName}
									onChange={(e) => handleInputChange("firstName", e.target.value)}
								/>
							</div>

							<div className="mb-3">
								<label className="form-label">Last Name</label>
								<input
									className="form-control"
									value={formData.lastName}
									onChange={(e) => handleInputChange("lastName", e.target.value)}
								/>
							</div>

							<div className="mb-3">
								<label className="form-label">Email</label>
								<input
									className="form-control"
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
								/>
							</div>

							<div className="d-flex gap-2 mb-3">
								<button className="btn btn-primary" onClick={saveChanges}>
									Save Changes
								</button>
								<button
									className="btn btn-outline-secondary"
									onClick={cancelEditing}
								>
									Cancel
								</button>
							</div>
						</>
					) : (
						<>
							<p>
								<strong>First Name:</strong> {userData.firstName}
							</p>
							<p>
								<strong>Last Name:</strong> {userData.lastName}
							</p>
							<p>
								<strong>Email:</strong> {userData.email}
							</p>
							<p>
								<strong>Role:</strong> {userData.role}
							</p>

							<div className="mt-3 text-start">
								<button className="btn btn-primary" onClick={startEditing}>
									Edit user data
								</button>
							</div>
						</>
					)}

					{/* ---------------- BUTTON TO OPEN PASSWORD FORM ---------------- */}
					<div className="mt-4">
						<button
							className="btn btn-warning"
							onClick={() => setShowPasswordForm((prev) => !prev)}
						>
							{showPasswordForm ? "Hide Password Form" : "Change Password"}
						</button>
					</div>

					{/* ---------------- PASSWORD FORM UNDER FIRST FORM ---------------- */}
					{showPasswordForm && (
						<div className="mt-4">
							<hr className="my-4" />
							<h4>Change Password</h4>

							<div className="mb-3">
								<label className="form-label">Current Password</label>
								<input
									type={passwordForm.showPassword ? "text" : "password"}
									className="form-control"
									value={passwordForm.currentPassword}
									onChange={(e) =>
										handlePasswordChange("currentPassword", e.target.value)
									}
								/>
							</div>

							<div className="mb-3">
								<label className="form-label">New Password</label>
								<input
									type={passwordForm.showPassword ? "text" : "password"}
									className="form-control"
									value={passwordForm.newPassword}
									onChange={(e) =>
										handlePasswordChange("newPassword", e.target.value)
									}
								/>
							</div>

							<div className="mb-3">
								<label className="form-label">Confirm New Password</label>
								<input
									type={passwordForm.showPassword ? "text" : "password"}
									className="form-control"
									value={passwordForm.confirmNewPassword}
									onChange={(e) =>
										handlePasswordChange("confirmNewPassword", e.target.value)
									}
								/>
							</div>

							<div className="form-check mb-3">
								<input
									type="checkbox"
									className="form-check-input"
									id="showPassword"
									checked={passwordForm.showPassword}
									onChange={(e) =>
										handlePasswordChange("showPassword", e.target.checked)
									}
								/>
								<label className="form-check-label" htmlFor="showPassword">
									Show Passwords
								</label>
							</div>

							<button className="btn btn-warning" onClick={saveNewPassword}>
								Save New Password
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SettingsPage;
