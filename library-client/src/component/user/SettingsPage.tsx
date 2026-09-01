import { useState } from "react";
import type { UserData } from "../../types/DbTypes";
import { getUserDataFromLocalStorage } from "./UserDataFromStorage";

const SettingsPage = () => {
	const [userData, setUserData] = useState<UserData | null>(() => getUserDataFromLocalStorage());
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<UserData | null>(null);

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

		// post data to backend if needed, for now just update localStorage
		// if post successful, download user data from backend and update localStorage
		//TODO

		localStorage.setItem("firstName", formData.firstName);
		localStorage.setItem("lastName", formData.lastName);
		localStorage.setItem("email", formData.email);
		setUserData(formData);
		setIsEditing(false);
	};

	const cancelEditing = () => {
		setFormData(null);
		setIsEditing(false);
	};

	return (
		<div className="container py-4">
			<h2>User Settings</h2>

			{!userData ? (
				<p>No user data in localStorage.</p>
			) : isEditing && formData ? (
				<div className="card p-4 mt-3">
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

					<div className="d-flex gap-2">
						<button className="btn btn-primary" onClick={saveChanges}>
							Save Changes
						</button>
						<button className="btn btn-outline-secondary" onClick={cancelEditing}>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="card p-4 mt-3">
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

					<button className="btn btn-primary mt-3" onClick={startEditing}>
						Edit
					</button>
				</div>
			)}
		</div>
	);
};

export default SettingsPage;
