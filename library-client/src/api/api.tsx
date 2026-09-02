import axiosClient from "./axiosClient";
import type { UserType, UserRoleType } from "../types/DbTypes";

type BackendUserType = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	role: UserRoleType;
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

export const getUserById = async (id: number) => {
	try {
		const response = await axiosClient.get<BackendUserType>(`/user/${id}`);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to fetch user with id ${id}:`, error);
		throw error;
	}
};

const api = {
	getUsers,
	getUserById,
};

export default api;
