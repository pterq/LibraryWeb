import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiUser from "../api/apiUsers";
import UserDataCard from "../component/common/UserDataCard";

const MySettingsPage = () => {
	const { firstName, lastName, email, role, userId, hasFees, phone } = useAuth();

	const [isPasswordEditing, setIsPasswordEditing] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
		showPassword: false,
	});

	const handlePasswordChange = (field: keyof typeof passwordForm, value: string | boolean) => {
		setPasswordForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const saveNewPassword = async () => {
		setMessage(null);

		if (!userId) {
			setMessage("No user ID — please log in again.");
			return;
		}

		// --- WALIDACJA PÓL ---
		if (passwordForm.currentPassword === passwordForm.newPassword) {
			setMessage("New password cannot be the same as current password.");
			return;
		}

		if (!passwordForm.currentPassword.trim()) {
			setMessage("Current password is required.");
			return;
		}

		if (!passwordForm.newPassword.trim()) {
			setMessage("New password is required.");
			return;
		}

		if (!passwordForm.confirmNewPassword.trim()) {
			setMessage("Confirm new password is required.");
			return;
		}

		if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
			setMessage("New passwords do not match!");
			return;
		}

		try {
			console.log("User id:", userId);

			await apiUser.changeUserPassword(userId, {
				currentPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword,
			});

			setMessage("Password changed successfully.");
			setIsPasswordEditing(false);

			setPasswordForm({
				currentPassword: "",
				newPassword: "",
				confirmNewPassword: "",
				showPassword: false,
			});
		} catch (error: any) {
			const backendMessage =
				error?.response?.data?.message ||
				error?.response?.data?.error ||
				"Failed to change password.";

			setMessage(backendMessage);
		}
	};

	return (
		<div className="container py-4">
			<h2>User Settings</h2>

			<div className="card p-4 mt-3">
				{/* ---------------- USER DATA (READONLY) ---------------- */}
				<UserDataCard
					userData={{
						id: userId ?? 0,
						firstName: firstName ?? "NO DATA",
						lastName: lastName ?? "NO DATA",
						email: email ?? "NO DATA",
						phone: phone ?? "NO DATA",
						role: role ?? "",
						hasFee: hasFees ?? false,
					}}
				/>

				{/* ---------------- PASSWORD FORM (ALWAYS VISIBLE) ---------------- */}
				<div className="mt-4">
					<hr className="my-4" />

					{/* ---------------- CHANGE PASSWORD / CANCEL BUTTON ---------------- */}
					<div className="mt-4 mb-2">
						<button
							className={isPasswordEditing ? "btn btn-danger" : "btn btn-warning"}
							onClick={() => setIsPasswordEditing((prev) => !prev)}
						>
							{isPasswordEditing ? "Cancel" : "Change Password"}
						</button>
					</div>

					<h4>Change Password</h4>

					<div className="mb-3">
						<label className="form-label">Current Password</label>
						<input
							type={passwordForm.showPassword ? "text" : "password"}
							className="form-control"
							value={passwordForm.currentPassword}
							disabled={!isPasswordEditing}
							onChange={(e) =>
								handlePasswordChange("currentPassword", e.target.value)
							}
							required
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">New Password</label>
						<input
							type={passwordForm.showPassword ? "text" : "password"}
							className="form-control"
							value={passwordForm.newPassword}
							disabled={!isPasswordEditing}
							onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
							required
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">Confirm New Password</label>
						<input
							type={passwordForm.showPassword ? "text" : "password"}
							className="form-control"
							value={passwordForm.confirmNewPassword}
							disabled={!isPasswordEditing}
							onChange={(e) =>
								handlePasswordChange("confirmNewPassword", e.target.value)
							}
							required
						/>
					</div>

					<div className="form-check mb-3">
						<input
							type="checkbox"
							className="form-check-input"
							id="showPassword"
							checked={passwordForm.showPassword}
							disabled={!isPasswordEditing}
							onChange={(e) => handlePasswordChange("showPassword", e.target.checked)}
							required
						/>
						<label className="form-check-label" htmlFor="showPassword">
							Show Passwords
						</label>
					</div>

					{/* ---------------- SAVE BUTTON ONLY WHEN EDITING ---------------- */}
					{isPasswordEditing && (
						<button className="btn btn-warning" onClick={saveNewPassword}>
							Save New Password
						</button>
					)}

					{/* ---------------- MESSAGE ---------------- */}
					{message && <p className="mt-3 text-center">{message}</p>}
				</div>
			</div>
		</div>
	);
};

export default MySettingsPage;
