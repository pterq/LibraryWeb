import { useEffect, useMemo, useState } from "react";
import apiUsers from "../../../../api/apiUsers";
import { useAuth } from "../../../../context/AuthContext";
import type { UserType } from "../../../../types/DbTypes";
import ReturnButton from "../../../common/ReturnButton";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

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

const EditUser = ({ id, onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState<UserFormData>(EMPTY_FORM);
	const [hasFee, setHasFee] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const auth = useAuth();

	// 🔥 Poprawiona logika — tylko ADMIN może ustawiać ADMIN + LIBRARIAN
	const allowedRoles = useMemo<UserType["role"][]>(() => {
		if (auth.role === "ADMIN") return ["ADMIN", "LIBRARIAN", "USER"];
		return ["USER"]; // LIBRARIAN i USER mogą ustawiać tylko USER
	}, [auth.role]);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const data = await apiUsers.getUserById(id);
				if (!active) return;

				const next = {
					firstName: data.firstName ?? "",
					lastName: data.lastName ?? "",
					email: data.email ?? "",
					phone: data.phone ?? "",
					role: allowedRoles.includes(data.role) ? data.role : "USER",
				};

				setFormData(next);
				setOriginalFormData(next);
				setHasFee(data.hasFee ?? false);
			} catch {
				if (active) setError("Failed to load user data.");
			} finally {
				if (active) setIsLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [id, allowedRoles]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await apiUsers.updateUserById(id, {
				id,
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone.trim() || null,
				role: formData.role,
				hasFee,
			});

			onReload();
			showMessage("User has been updated.");
			onBack();
		} catch {
			setError("Failed to save changes.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData(originalFormData);
		onBack();
	};

	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<ReturnButton onBack={onBack} onReload={onReload} />
				<h2>Edit User</h2>
			</div>

			{isLoading && <p>Loading...</p>}
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
						required
						disabled={isLoading}
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
						required
						disabled={isLoading}
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
						required
						disabled={isLoading}
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

				<p className="text-muted">Has unpaid fees: {hasFee ? "Yes" : "No"}</p>

				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					Save Changes
				</button>
			</form>
		</div>
	);
};

export default EditUser;
