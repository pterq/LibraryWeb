import React from "react";
import type { EmptyRegisterUserForm } from "../../types/DbTypes";

type Props = {
	form: EmptyRegisterUserForm;
	setForm: (data: EmptyRegisterUserForm) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	showPassword: boolean;
	setShowPassword: (v: boolean) => void;
	isLoading?: boolean;
	error?: string | null;
	title?: string;
};

const RegisterForm: React.FC<Props> = ({
	form,
	setForm,
	onSubmit,
	showPassword,
	setShowPassword,
	isLoading = false,
	error = null,
	title = "Register",
}) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	return (
		<div className="container mt-4" style={{ maxWidth: "500px" }}>
			<h2 className="mb-3 text-center">{title}</h2>

			{error && <p className="text-danger text-center">{error}</p>}

			<form onSubmit={onSubmit}>
				<div className="mb-3">
					<label className="form-label">First Name</label>
					<input
						type="text"
						name="firstName"
						className="form-control"
						value={form.firstName}
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
						value={form.lastName}
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
						value={form.email}
						onChange={handleChange}
						disabled={isLoading}
						required
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Password</label>
					<div className="input-group">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							className="form-control"
							value={form.password}
							onChange={handleChange}
							disabled={isLoading}
							required
						/>
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => setShowPassword(!showPassword)}
						>
							<i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
						</button>
					</div>
				</div>

				<div className="mb-3">
					<label className="form-label">Confirm Password</label>
					<div className="input-group">
						<input
							type={showPassword ? "text" : "password"}
							name="password2"
							className="form-control"
							value={form.password2}
							onChange={handleChange}
							disabled={isLoading}
							required
						/>
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => setShowPassword(!showPassword)}
						>
							<i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
						</button>
					</div>
				</div>

				<div className="mb-3">
					<label className="form-label">Phone</label>
					<input
						type="text"
						name="phone"
						className="form-control"
						value={form.phone}
						onChange={handleChange}
						disabled={isLoading}
						placeholder="Optional"
					/>
				</div>

				<button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
					{title}
				</button>
			</form>
		</div>
	);
};

export default RegisterForm;
