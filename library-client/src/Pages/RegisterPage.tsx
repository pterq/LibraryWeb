import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../component/common/RegisterForm";

import type { EmptyRegisterUserForm, RegisterUserResponse } from "../types/DbTypes";

interface BackendError {
	message?: string;
	error?: string;
	details?: string;
}

const RegisterPage = () => {
	const [form, setForm] = useState<EmptyRegisterUserForm>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		password2: "",
		phone: "",
	});

	const navigate = useNavigate();
	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [message, setMessage] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (form.password !== form.password2) {
			setMessage("Passwords do not match.");
			return;
		}

		try {
			const response = await axios.post<RegisterUserResponse>(
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
					setMessage("Email already exists.");
					break;

				case 400:
					setMessage("Invalid registration data.");
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
		<>
			<RegisterForm
				form={form}
				setForm={setForm}
				onSubmit={handleSubmit}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				error={message}
				title="Register"
			/>
		</>
	);
};

export default RegisterPage;
