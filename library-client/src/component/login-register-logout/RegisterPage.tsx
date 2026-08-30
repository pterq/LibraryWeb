import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";

// Typ danych wysyłanych do backendu
interface RegisterForm {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

// Typ odpowiedzi z backendu (możesz rozszerzyć)
interface RegisterResponse {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}

const RegisterPage: React.FC = () => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [form, setForm] = useState<RegisterForm>({
		firstName: "",
		lastName: "",
		email: "",
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
				"http://localhost:8080/api/register",
				form,
			);

			setMessage("Rejestracja zakończona sukcesem!");
			console.log("Server response:", response.data);
		} catch (error) {
			const err = error as AxiosError;
			console.error("Axios error:", err);

			setMessage("Wystąpił błąd podczas rejestracji.");
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
