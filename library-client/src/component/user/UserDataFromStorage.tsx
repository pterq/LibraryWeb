import type { ReactNode } from "react";
import type { UserData } from "../../types/UserType";

interface UserDataFromStorageProps {
	children: (userData: UserData | null) => ReactNode;
}

const getUserDataFromLocalStorage = (): UserData | null => {
	const token = localStorage.getItem("token");
	const firstName = localStorage.getItem("firstName");
	const lastName = localStorage.getItem("lastName");
	const email = localStorage.getItem("email");
	const role = localStorage.getItem("role");

	if (!token || !firstName || !lastName || !email || !role) {
		return null;
	}

	return {
		token,
		firstName,
		lastName,
		email,
		role,
	};
};

const UserDataFromStorage = ({ children }: UserDataFromStorageProps) => {
	const userData = getUserDataFromLocalStorage();
	return <>{children(userData)}</>;
};

export default UserDataFromStorage;
export { getUserDataFromLocalStorage };
