import axiosClient from "./axiosClient";
import type {
	CartItemResponse,
	CartCountResponse,
	CartItemForm,
	LoanAddToCartForm,
} from "../types/DbTypes";

//endpoints
const RESERVATION_ENDPOINT = "/carts";

//===============================================================================
//Reservation

export const getAllCartItems = async () => {
	try {
		const response = await axiosClient.get<CartItemResponse[]>(RESERVATION_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch cart items:", error);
		throw error;
	}
};

export const createCartItem = async (cartItem: LoanAddToCartForm) => {
	try {
		const response = await axiosClient.post<CartItemResponse>(RESERVATION_ENDPOINT, cartItem);
		return response.data;
	} catch (error) {
		console.error("Failed to add cart item:", error);
		throw error;
	}
};

export const getCartItemsByUserId = async (id: number) => {
	try {
		const response = await axiosClient.get<CartItemResponse[]>(`${RESERVATION_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch cart item with id ${id}:`, error);
		throw error;
	}
};

export const deleteCartItemByCartItemId = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${RESERVATION_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete cart item with id ${id}:`, error);
		throw error;
	}
};

export const updateCartItemByCartItemId = async (id: number, cartItem: CartItemForm) => {
	try {
		const response = await axiosClient.put<CartItemResponse>(
			`${RESERVATION_ENDPOINT}/${id}`,
			cartItem,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to update cart item with id ${id}:`, error);
		throw error;
	}
};

export const getAllUsersCartItemCounts = async () => {
	try {
		const response = await axiosClient.get<CartCountResponse[]>(
			`${RESERVATION_ENDPOINT}/counts`,
		);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch cart item counts:", error);
		throw error;
	}
};

const apiCarts = {
	getAllCartItems,
	getCartItemsByUserId,
	createCartItem,
	updateCartItemByCartItemId,
	deleteCartItemByCartItemId,
	getAllUsersCartItemCounts,
};

export default apiCarts;
