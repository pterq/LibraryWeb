import axiosClient from "./axiosClient";
import type { UserType } from "../types/DbTypes";

type BackendUserRole = "ADMIN" | "USER" | "LIBRARIAN";

type BackendUserType = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	role: BackendUserRole;
	hasFee?: boolean;
};

const normalizeUser = (user: BackendUserType): UserType => ({
	userId: user.id,
	firstName: user.firstName,
	lastName: user.lastName,
	email: user.email,
	phone: user.phone,
	role: user.role,
	hasFee: user.hasFee ?? false,
});

export const getUsers = async () => {
	try {
		const response = await axiosClient.get<BackendUserType[]>("/user");
		return response.data.map(normalizeUser);
	} catch (error) {
		console.error("Failed to fetch users:", error);
		throw error;
	}
};

const api = {
	getUsers,
};

export default api;
