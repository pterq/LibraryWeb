import axiosClient from "./axiosClient";
import type { ReservationType, ReservationCountType } from "../types/DbTypes";

//endpoints
const RESERVATION_ENDPOINT = "/carts";

//===============================================================================
//Reservation

export const getReservations = async () => {
	try {
		const response = await axiosClient.get<ReservationType[]>(RESERVATION_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations:", error);
		throw error;
	}
};

export const getReservationById = async (id: number) => {
	try {
		const response = await axiosClient.get<ReservationType>(`${RESERVATION_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch reservation with id ${id}:`, error);
		throw error;
	}
};

export const addReservation = async (reservation: ReservationType) => {
	try {
		const response = await axiosClient.post<ReservationType>(RESERVATION_ENDPOINT, reservation);
		return response.data;
	} catch (error) {
		console.error("Failed to add reservation:", error);
		throw error;
	}
};

export const updateReservationById = async (id: number, reservation: ReservationType) => {
	try {
		const response = await axiosClient.put<ReservationType>(
			`${RESERVATION_ENDPOINT}/${id}`,
			reservation,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to update reservation with id ${id}:`, error);
		throw error;
	}
};

export const deleteReservationById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${RESERVATION_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete reservation with id ${id}:`, error);
		throw error;
	}
};

export const getReservationsWithCounts = async () => {
	try {
		const response = await axiosClient.get<ReservationCountType[]>(
			`${RESERVATION_ENDPOINT}/counts`,
		);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations with counts:", error);
		throw error;
	}
};

export const getReservationByUserId = async (userId: number | null) => {
	try {
		const response = await axiosClient.get<ReservationType[]>(
			`${RESERVATION_ENDPOINT}/user/${userId}`,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch reservations for user with id ${userId}:`, error);
		throw error;
	}
};

const apiCarts = {
	getReservations,
	getReservationById,
	addReservation,
	updateReservationById,
	deleteReservationById,
	getReservationsWithCounts,
	getReservationByUserId,
};

export default apiCarts;
