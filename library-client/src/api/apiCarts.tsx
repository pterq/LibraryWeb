import axiosClient from "./axiosClient";
import type { CartItemResponse, CartCountResponse } from "../types/DbTypes";

//endpoints
const RESERVATION_ENDPOINT = "/carts";

//===============================================================================
//Reservation

export const getAllCarts = async () => {
	try {
		const response = await axiosClient.get<CartItemResponse[]>(RESERVATION_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations:", error);
		throw error;
	}
};

export const getCartById = async (id: number) => {
	try {
		const response = await axiosClient.get<CartItemResponse>(`${RESERVATION_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch reservation with id ${id}:`, error);
		throw error;
	}
};

export const addCart = async (reservation: CartItemResponse) => {
	try {
		const response = await axiosClient.post<CartItemResponse>(
			RESERVATION_ENDPOINT,
			reservation,
		);
		return response.data;
	} catch (error) {
		console.error("Failed to add reservation:", error);
		throw error;
	}
};

export const updateCartById = async (id: number, reservation: CartItemResponse) => {
	try {
		const response = await axiosClient.put<CartItemResponse>(
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
		const response = await axiosClient.get<CartCountResponse[]>(
			`${RESERVATION_ENDPOINT}/counts`,
		);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations with counts:", error);
		throw error;
	}
};

export const getUserCartItemsByUserId = async (userId: number) => {
	try {
		const response = await axiosClient.get<CartItemResponse[]>(
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
