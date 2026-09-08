// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserRoleType, LoginUserResponse } from "../types/DbTypes";

type AuthUserDataField = "firstName" | "lastName" | "email" | "phone";

interface AuthContextType {
	token: string | null;
	role: UserRoleType | null;
	userId: number | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	hasFees: boolean | null;
	tokenExpiresAt: string | null;
	phone: string | null;

	login: (authData: LoginUserResponse) => void;
	logout: (showManualToast?: boolean) => void;
	updateUserData: (field: AuthUserDataField, value: string) => void;
	setHasFees: (hasFees: boolean) => void;
	setTokenExpiresAt: (value: string | null) => void;

	showToast: (msg: string) => void;

	cartChanged: boolean;
	notifyCartChanged: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const parseUserRole = (value: string | null): UserRoleType | null => {
	if (value === "ADMIN" || value === "USER" || value === "LIBRARIAN") {
		return value;
	}
	return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
	const [role, setRole] = useState<UserRoleType | null>(
		parseUserRole(localStorage.getItem("role")),
	);
	const [userId, setUserId] = useState<number | null>(
		localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")!) : null,
	);
	const [firstName, setFirstName] = useState<string | null>(localStorage.getItem("firstName"));
	const [lastName, setLastName] = useState<string | null>(localStorage.getItem("lastName"));
	const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));
	const [hasFees, setHasFeesState] = useState<boolean | null>(
		localStorage.getItem("hasFees") === "false"
			? false
			: localStorage.getItem("hasFees") === "true"
				? true
				: null,
	);
	const [phone, setPhone] = useState<string | null>(localStorage.getItem("phone"));
	const [tokenExpiresAt, setTokenExpiresAtState] = useState<string | null>(
		localStorage.getItem("tokenExpiresAt"),
	);

	const [toastMessage, setToastMessage] = useState<string | null>(null);

	const showToast = (msg: string) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(null), 3000);
	};

	const [cartChanged, setCartChanged] = useState(false);

	const notifyCartChanged = () => {
		setCartChanged((prev) => !prev); // flip → trigger useEffect
	};

	// AUTO LOGOUT
	useEffect(() => {
		if (!token || !tokenExpiresAt) return;

		const expires = new Date(tokenExpiresAt).getTime();
		const now = Date.now();
		const msLeft = expires - now;

		if (msLeft <= 0) {
			showToast("Session expired — please log in again.");
			logout(false);
			return;
		}

		const timer = setTimeout(() => {
			showToast("Session expired — please log in again.");
			logout(false);
		}, msLeft);

		return () => clearTimeout(timer);
	}, [token, tokenExpiresAt]);

	const updateHasFees = (nextValue: boolean | null) => {
		if (nextValue === null) {
			localStorage.removeItem("hasFees");
		} else {
			localStorage.setItem("hasFees", nextValue.toString());
		}
		setHasFeesState(nextValue);
	};

	const updateTokenExpiresAt = (value: string | null) => {
		if (value === null) {
			localStorage.removeItem("tokenExpiresAt");
		} else {
			localStorage.setItem("tokenExpiresAt", value);
		}
		setTokenExpiresAtState(value);
	};

	const updateUserData = (field: AuthUserDataField, value: string | null) => {
		if (value === null) {
			localStorage.removeItem(field);
		} else {
			localStorage.setItem(field, value);
		}

		if (field === "firstName") return setFirstName(value);
		if (field === "lastName") return setLastName(value);
		if (field === "email") return setEmail(value);

		setPhone(value);
	};

	const login = ({
		userId,
		accessToken,
		firstName,
		lastName,
		email,
		phone,
		role,
		hasFees,
		tokenExpiresAt,
	}: LoginUserResponse) => {
		const nextHasFees =
			typeof hasFees === "boolean" ? hasFees : localStorage.getItem("hasFees") === "true";

		localStorage.setItem("token", accessToken);
		localStorage.setItem("userId", userId.toString());
		updateUserData("firstName", firstName);
		updateUserData("lastName", lastName);
		updateUserData("email", email);
		updateUserData("phone", phone);

		const nextRole = parseUserRole(role);
		if (!nextRole) throw new Error(`Unsupported user role: ${role}`);

		localStorage.setItem("role", nextRole);

		setToken(accessToken);
		setRole(nextRole);
		setUserId(userId);
		updateHasFees(nextHasFees);
		updateTokenExpiresAt(tokenExpiresAt ?? null);

		showToast("Login successful.");
	};

	const logout = (showManualToast: boolean = false) => {
		if (showManualToast) showToast("Logout successful.");

		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		localStorage.removeItem("firstName");
		localStorage.removeItem("lastName");
		localStorage.removeItem("email");
		localStorage.removeItem("role");
		localStorage.removeItem("hasFees");
		localStorage.removeItem("tokenExpiresAt");
		localStorage.removeItem("phone");

		setToken(null);
		setRole(null);
		setUserId(null);
		setFirstName(null);
		setLastName(null);
		setEmail(null);
		updateHasFees(null);
		updateTokenExpiresAt(null);
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
				phone,
				hasFees,
				tokenExpiresAt,
				login,
				logout,
				updateUserData,
				setHasFees: updateHasFees,
				setTokenExpiresAt: updateTokenExpiresAt,
				showToast,
				cartChanged,
				notifyCartChanged,
			}}
		>
			{toastMessage && (
				<div
					style={{
						position: "fixed",
						bottom: "20px",
						right: "20px",
						backgroundColor: toastMessage.startsWith("Session") ? "#ff4d4d" : "#28a745",
						color: "#fff",
						padding: "14px 20px",
						borderRadius: "10px",
						boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
						zIndex: 9999,
						fontSize: "16px",
						fontWeight: "bold",
					}}
				>
					{toastMessage}
				</div>
			)}

			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext)!;
