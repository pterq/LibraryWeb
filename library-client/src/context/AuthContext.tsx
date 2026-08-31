import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
	token: string | null;
	role: string | null;
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
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		localStorage.removeItem("firstName");
		localStorage.removeItem("lastName");
		localStorage.removeItem("email");
		localStorage.removeItem("role");
		setToken(null);
	};

	return (
		<AuthContext.Provider value={{ token, role, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
