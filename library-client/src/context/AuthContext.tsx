import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
	token: string | null;
	role: string | null;
	userId: number | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	login: (authData: AuthLoginData) => void;
	logout: () => void;
}

interface AuthLoginData {
	userId: number;
	accessToken: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
	const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
	const [userId, setUserId] = useState<number | null>(
		localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")!) : null,
	);
	const [firstName, setFirstName] = useState<string | null>(localStorage.getItem("firstName"));
	const [lastName, setLastName] = useState<string | null>(localStorage.getItem("lastName"));
	const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));

	const login = ({ userId, accessToken, firstName, lastName, email, role }: AuthLoginData) => {
		console.log("Logging in user:", { userId, accessToken, firstName, lastName, email, role });

		localStorage.setItem("token", accessToken);
		localStorage.setItem("userId", userId.toString());
		localStorage.setItem("firstName", firstName);
		localStorage.setItem("lastName", lastName);
		localStorage.setItem("email", email);
		localStorage.setItem("role", role);
		setToken(accessToken);
		setRole(role);
		setUserId(userId);
		setFirstName(firstName);
		setLastName(lastName);
		setEmail(email);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		localStorage.removeItem("firstName");
		localStorage.removeItem("lastName");
		localStorage.removeItem("email");
		localStorage.removeItem("role");
		setToken(null);
		setRole(null);
		setUserId(null);
		setFirstName(null);
		setLastName(null);
		setEmail(null);
	};

	return (
		<AuthContext.Provider
			value={{ token, role, userId, firstName, lastName, email, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
