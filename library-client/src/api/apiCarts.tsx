import axiosClient from "./axiosClient";
import type { CartType, CartCountType } from "../types/DbTypes";

//endpoints
const RESERVATION_ENDPOINT = "/carts";

//===============================================================================
//Reservation

export const getAllCarts = async () => {
	try {
		const response = await axiosClient.get<CartType[]>(RESERVATION_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations:", error);
		throw error;
	}
};

export const getCartById = async (id: number) => {
	try {
		const response = await axiosClient.get<CartType>(`${RESERVATION_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch reservation with id ${id}:`, error);
		throw error;
	}
};

export const addCart = async (reservation: CartType) => {
	try {
		const response = await axiosClient.post<CartType>(RESERVATION_ENDPOINT, reservation);
		return response.data;
	} catch (error) {
		console.error("Failed to add reservation:", error);
		throw error;
	}
};

export const updateCartById = async (id: number, reservation: CartType) => {
	try {
		const response = await axiosClient.put<CartType>(
			`${RESERVATION_ENDPOINT}/${id}`,
			reservation,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to update reservation with id ${id}:`, error);
		throw error;
	}
};

export const deleteCartById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${RESERVATION_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete reservation with id ${id}:`, error);
		throw error;
	}
};

export const getCartsWithCounts = async () => {
	try {
		const response = await axiosClient.get<CartCountType[]>(`${RESERVATION_ENDPOINT}/counts`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations with counts:", error);
		throw error;
	}
};

export const getUserCartItemsByUserId = async (userId: number) => {
	try {
		const response = await axiosClient.get<CartType[]>(
			`${RESERVATION_ENDPOINT}/user/${userId}`,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch reservations for user with id ${userId}:`, error);
		throw error;
	}
};

const apiCarts = {
	getAllCarts,
	getCartById,
	addCart,
	updateCartById,
	deleteCartById,
	getCartsWithCounts,
	getUserCartItemsByUserId,
};

export default apiCarts;
