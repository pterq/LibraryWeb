import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RegisterForm, RegisterResponse } from "../types/DbTypes";

interface BackendError {
	message?: string;
	error?: string;
	details?: string;
}

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [form, setForm] = useState<RegisterForm>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
	});

	const [message, setMessage] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await axios.post<RegisterResponse>(
				`${import.meta.env.VITE_BACKEND_URL}/register`,
				form,
			);

			login({
				userId: response.data.userId,
				accessToken: response.data.accessToken,
				firstName: response.data.firstName,
				lastName: response.data.lastName,
				email: response.data.email,
				role: response.data.role,
				tokenExpiresAt: response.data.tokenExpiresAt,
				phone: response.data.phone,
			});

			setMessage("Registered successfully");
			navigate("/", { replace: true });
		} catch (error) {
			const err = error as AxiosError<BackendError>;

			if (!err.response) {
				setMessage("Server not responding — check your connection.");
				return;
			}

			const backendMessage =
				err.response.data?.message ||
				err.response.data?.error ||
				err.response.data?.details ||
				null;

			switch (err.response.status) {
				case 409:
					setMessage(backendMessage || "Email already exists.");
					break;

				case 400:
					setMessage(backendMessage || "Invalid registration data.");
					break;

				case 500:
					setMessage("Server error — try again later.");
					break;

				default:
					setMessage(backendMessage || "Registration failed.");
			}
		}
	};

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<h2 className="mb-4 text-center">Register</h2>

			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label className="form-label">First Name</label>
					<input
						type="text"
						name="firstName"
						className="form-control"
						value={form.firstName}
						onChange={handleChange}
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
						required
					/>
				</div>

				{/* Telefon opcjonalny */}
				<div className="mb-3">
					<label className="form-label">Phone</label>
					<input
						type="tel"
						name="phone"
						className="form-control"
						value={form.phone}
						onChange={handleChange}
						placeholder="Optional"
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
							required
						/>

						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => setShowPassword((prev) => !prev)}
						>
							<i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
						</button>
					</div>
				</div>

				<button type="submit" className="btn btn-primary w-100">
					Zarejestruj się
				</button>
			</form>

			<div className="text-center mt-3">
				<Link to="/login">Masz już konto? Zaloguj się</Link>
			</div>

			{message && <p className="mt-3 text-center">{message}</p>}
		</div>
	);
};

export default RegisterPage;
