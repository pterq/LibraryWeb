import axiosClient from "./axiosClient";
import type { LoanResponse, LoanStatusType, LoanCountType } from "../types/DbTypes";

//endpoints
const LOAN_ENDPOINT = "/loans";

//===============================================================================
//Loan

export const getLoans = async () => {
	try {
		const response = await axiosClient.get<LoanResponse[]>(LOAN_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch loans:", error);
		throw error;
	}
};

export const getLoansByLoanStatus = async (status: LoanStatusType) => {
	try {
		const response = await axiosClient.get<LoanResponse[]>(`${LOAN_ENDPOINT}/status/${status}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans with status ${status}:`, error);
		throw error;
	}
};

export const getLoansByUserId = async (userId: number) => {
	try {
		const response = await axiosClient.get<LoanResponse[]>(
			`${LOAN_ENDPOINT}/userBooks/${userId}`,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans for user with id ${userId}:`, error);
		throw error;
	}
};

export const addLoan = async (loan: LoanResponse) => {
	try {
		const response = await axiosClient.post<LoanResponse>(LOAN_ENDPOINT, loan);
		return response.data;
	} catch (error) {
		console.error("Failed to add loan:", error);
		throw error;
	}
};

export const updateLoanById = async (id: number, loan: LoanResponse) => {
	try {
		const response = await axiosClient.put<LoanResponse>(`${LOAN_ENDPOINT}/${id}`, loan);
		return response.data;
	} catch (error) {
		console.error(`Failed to update loan with id ${id}:`, error);
		throw error;
	}
};

export const deleteLoanById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${LOAN_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete loan with id ${id}:`, error);
		throw error;
	}
};

export const getLoansWithCounts = async () => {
	try {
		const response = await axiosClient.get<LoanCountType[]>(`${LOAN_ENDPOINT}/counts`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch loans with counts:", error);
		throw error;
	}
};

const apiLoans = {
	getLoans,
	getLoansByLoanStatus,
	getLoansByUserId,
	addLoan,
	updateLoanById,
	deleteLoanById,
	getLoansWithCounts,
};

export default apiLoans;
