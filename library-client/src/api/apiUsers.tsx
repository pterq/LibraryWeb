import axiosClient from "./axiosClient";
import type {
	UserType,
	UserRoleType,
	LoginForm,
	LoginResponse,
	RegisterForm,
	RegisterResponse,
} from "../types/DbTypes";

//endpoints
const USER_ENDPOINT = "/user";

//===============================================================================
//User

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
	id: user.id,
	firstName: user.firstName,
	lastName: user.lastName,
	email: user.email,
	phone: user.phone,
	role: user.role,
	hasFee: user.hasFee ?? false,
});

export const getUsers = async () => {
	try {
		const response = await axiosClient.get<BackendUserType[]>(USER_ENDPOINT);
		return response.data.map(normalizeUser);
	} catch (error) {
		console.error("Failed to fetch users:", error);
		throw error;
	}
};

export const getUserById = async (id: number) => {
	try {
		const response = await axiosClient.get<BackendUserType>(`${USER_ENDPOINT}/${id}`);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to fetch user with id ${id}:`, error);
		throw error;
	}
};

export const addUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>(USER_ENDPOINT, user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to add user:", error);
		throw error;
	}
};

export const updateUserById = async (id: number, user: BackendUserType) => {
	try {
		const response = await axiosClient.put<BackendUserType>(`${USER_ENDPOINT}/${id}`, user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to update user with id ${id}:`, error);
		throw error;
	}
};

export const deleteUserById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${USER_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete user with id ${id}:`, error);
		throw error;
	}
};

export const registerUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>(`${USER_ENDPOINT}/register`, user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to register user:", error);
		throw error;
	}
};

export const loginUser = async (user: LoginForm) => {
	try {
		const response = await axiosClient.post<LoginResponse>(`${USER_ENDPOINT}/login`, user);
		return response.data;
	} catch (error) {
		console.error("Failed to login user:", error);
		throw error;
	}
};

export const changeUserPassword = async (id: number, newPassword: string) => {
	try {
		const response = await axiosClient.put<BackendUserType>(
			`${USER_ENDPOINT}/${id}/change-password`,
			{
				newPassword,
			},
		);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to change password for user with id ${id}:`, error);
		throw error;
	}
};

const apiUsers = {
	getUsers,
	getUserById,
	addUser,
	updateUserById,
	deleteUserById,
	registerUser,
	loginUser,
	changeUserPassword,
};

export default apiUsers;
