import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface LoginForm {
	email: string;
	password: string;
}

interface LoginResponse {
	userId: number;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	accessToken: string;
	tokenType: string;
}

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login, role } = useAuth();

	const [form, setForm] = useState<LoginForm>({
		email: "",
		password: "",
	});

	const [message, setMessage] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await axios.post<LoginResponse>(
				`${import.meta.env.VITE_BACKEND_URL}/login`,
				form,
			);

			login({
				userId: response.data.userId,
				accessToken: response.data.accessToken,
				firstName: response.data.firstName,
				lastName: response.data.lastName,
				email: response.data.email,
				role: response.data.role,
			});
			setMessage("Logged in successfully");

			navigate("/", { replace: true });
		} catch (error) {
			const err = error as AxiosError;
			console.error("Axios error:", err);

			if (!err.response) {
				setMessage("Server not responding — check your connection.");
				return;
			}

			setMessage("Wrong email or password.");
		}
	};

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<h2 className="mb-4 text-center">Login</h2>

			<form onSubmit={handleSubmit}>
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
					Login
				</button>
			</form>

			<div className="text-center mt-3">
				<Link to="/register">Nie masz konta? Zarejestruj się</Link>
			</div>

			{message && <p className="mt-3 text-center">{message}</p>}
		</div>
	);
};

export default LoginPage;
