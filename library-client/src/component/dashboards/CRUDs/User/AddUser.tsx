import { useMemo, useState } from "react";
import apiUsers from "../../../../api/apiUsers";
import { useAuth } from "../../../../context/AuthContext";
import type { UserType, RegisterForm, RegisterResponse } from "../../../../types/DbTypes";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

type UserFormData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	phone: string;
};

const USER_ROLES: UserType["role"][] = ["ADMIN", "LIBRARIAN", "USER"];

const EMPTY_FORM: UserFormData = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
	phone: "",
};

const AddUser = ({ onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const auth = useAuth();

	const allowedRoles = useMemo<UserType["role"][]>(() => {
		if (auth.role === "ADMIN") return ["ADMIN", "LIBRARIAN", "USER"];
		if (auth.role === "LIBRARIAN") return ["USER"];
		return ["USER"];
	}, [auth.role]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await apiUsers.registerUser({
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				password: formData.password,
				phone: formData.phone.trim() || null,
			});

			onReload();
			showMessage("User has been added.");
			onBack();
		} catch {
			setError("Failed to create user.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>
			</div>

			<h2>Add User</h2>

			{error && <p className="text-danger">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label className="form-label">First Name</label>
					<input
						type="text"
						name="firstName"
						className="form-control"
						value={formData.firstName}
						onChange={handleChange}
						disabled={isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Last Name</label>
					<input
						type="text"
						name="lastName"
						className="form-control"
						value={formData.lastName}
						onChange={handleChange}
						disabled={isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Email</label>
					<input
						type="email"
						name="email"
						className="form-control"
						value={formData.email}
						onChange={handleChange}
						disabled={isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Password</label>
					<input
						type="password"
						name="password"
						className="form-control"
						value={formData.password}
						onChange={handleChange}
						disabled={isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Confirm Password</label>
					<input
						type="password"
						name="confirmPassword"
						className="form-control"
						value={formData.confirmPassword}
						onChange={handleChange}
						disabled={isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Phone</label>
					<input
						type="text"
						name="phone"
						className="form-control"
						value={formData.phone}
						onChange={handleChange}
						disabled={isLoading}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Role</label>
					<select
						name="role"
						className="form-select"
						value={formData.role}
						onChange={handleChange}
						disabled={isLoading}
					>
						{USER_ROLES.filter((role) => allowedRoles.includes(role)).map((role) => (
							<option key={role} value={role}>
								{role}
							</option>
						))}
					</select>
				</div>

				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					Create User
				</button>
			</form>
		</div>
	);
};

export default AddUser;
