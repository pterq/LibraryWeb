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
	setHasFees: (hasFees: boolean) => void;
	hasFees: boolean;
}

interface AuthLoginData {
	userId: number;
	accessToken: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	hasFees?: boolean;
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
	const [hasFees, setHasFees] = useState<boolean>(
		localStorage.getItem("hasFees") === "false" ? false : true,
	);

	const updateHasFees = (nextValue: boolean) => {
		localStorage.setItem("hasFees", nextValue.toString());
		setHasFees(nextValue);
	};

	const login = ({
		userId,
		accessToken,
		firstName,
		lastName,
		email,
		role,
		hasFees,
	}: AuthLoginData) => {
		const nextHasFees =
			typeof hasFees === "boolean" ? hasFees : localStorage.getItem("hasFees") === "true";
		console.log("Logging in user:", {
			userId,
			accessToken,
			firstName,
			lastName,
			email,
			role,
			hasFees: nextHasFees,
		});

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
		updateHasFees(nextHasFees);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		localStorage.removeItem("firstName");
		localStorage.removeItem("lastName");
		localStorage.removeItem("email");
		localStorage.removeItem("role");
		localStorage.removeItem("hasFees");
		setToken(null);
		setRole(null);
		setUserId(null);
		setFirstName(null);
		setLastName(null);
		setEmail(null);
		updateHasFees(false);
	};

	return (
		<AuthContext.Provider
			value={{
				token,
				role,
				userId,
				firstName,
				lastName,
				email,
				hasFees,
				login,
				logout,
				setHasFees: updateHasFees,
			}}
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
