import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
	token: string | null;
	login: (authData: AuthLoginData) => void;
	logout: () => void;
}

interface AuthLoginData {
	accessToken: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

	const login = ({ accessToken, firstName, lastName, email, role }: AuthLoginData) => {
		localStorage.setItem("token", accessToken);
		localStorage.setItem("firstName", firstName);
		localStorage.setItem("lastName", lastName);
		localStorage.setItem("email", email);
		localStorage.setItem("role", role);
		setToken(accessToken);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("firstName");
		localStorage.removeItem("lastName");
		localStorage.removeItem("email");
		localStorage.removeItem("role");
		setToken(null);
	};

	return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
