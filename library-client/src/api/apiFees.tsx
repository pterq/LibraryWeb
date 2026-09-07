import axiosClient from "./axiosClient";
import type { FeeType, FeesCountType } from "../types/DbTypes";

const FEE_ENDPOINT = "/fees";

//===============================================================================
//Fee

export const getFees = async () => {
	try {
		const response = await axiosClient.get<FeeType[]>(FEE_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch fees:", error);
		throw error;
	}
};

export const getFeeByStatus = async (status: string) => {
	try {
		const response = await axiosClient.get<FeeType[]>(`${FEE_ENDPOINT}/status/${status}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fees with status ${status}:`, error);
		throw error;
	}
};

export const getFeeById = async (id: number) => {
	try {
		const response = await axiosClient.get<FeeType>(`${FEE_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fee with id ${id}:`, error);
		throw error;
	}
};

export const addFee = async (fee: FeeType) => {
	try {
		const response = await axiosClient.post<FeeType>(FEE_ENDPOINT, fee);
		return response.data;
	} catch (error) {
		console.error("Failed to add fee:", error);
		throw error;
	}
};

export const updateFeeById = async (id: number, fee: FeeType) => {
	try {
		const response = await axiosClient.put<FeeType>(`${FEE_ENDPOINT}/${id}`, fee);
		return response.data;
	} catch (error) {
		console.error(`Failed to update fee with id ${id}:`, error);
		throw error;
	}
};

export const deleteFeeById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${FEE_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete fee with id ${id}:`, error);
		throw error;
	}
};

export const updateFeeStatusById = async (id: number, status: string) => {
	try {
		const response = await axiosClient.put<FeeType>(`${FEE_ENDPOINT}/${id}/status`, { status });
		return response.data;
	} catch (error) {
		console.error(`Failed to update fee status with id ${id}:`, error);
		throw error;
	}
};

export const getFeesWithCounts = async () => {
	try {
		const response = await axiosClient.get<FeesCountType[]>(`${FEE_ENDPOINT}/counts`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch fees with counts:", error);
		throw error;
	}
};

export const getFeesByUserId = async (userId: number) => {
	try {
		const response = await axiosClient.get<FeeType[]>(`${FEE_ENDPOINT}/userFees/${userId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fees for user with id ${userId}:`, error);
		throw error;
	}
};

const apiFees = {
	getFees,
	getFeeByStatus,
	getFeeById,
	addFee,
	updateFeeById,
	deleteFeeById,
	updateFeeStatusById,
	getFeesWithCounts,
	getFeesByUserId,
};

export default apiFees;
