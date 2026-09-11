import axiosClient from "./axiosClient";
import type {
	LoanResponse,
	LoanStatusType,
	LoanCountType,
	LoanStatusChangeRequest,
} from "../types/DbTypes";

//endpoints
const LOAN_ENDPOINT = "/loans";

//===============================================================================
//Loan

export const getAll = async () => {
	try {
		const response = await axiosClient.get<LoanResponse[]>(LOAN_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch loans:", error);
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

export const getLoanByLoanId = async (loanId: number) => {
	try {
		const response = await axiosClient.get<LoanResponse>(`${LOAN_ENDPOINT}/${loanId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loan with id ${loanId}:`, error);
		throw error;
	}
};

export const addLoanReserve = async (loan: LoanStatusChangeRequest) => {
	try {
		const response = await axiosClient.post<LoanResponse>(`${LOAN_ENDPOINT}/reserve`, loan);
		return response.data;
	} catch (error) {
		console.error("Failed to add loan with status RESERVED:", error);
		throw error;
	}
};

export const borrowBookByLoanId = async (loanId: number) => {
	try {
		const response = await axiosClient.post<LoanResponse>(`${LOAN_ENDPOINT}/borrow/${loanId}`);

		return response.data;
	} catch (error) {
		console.error(`Failed to change loan with id ${loanId} to BORROW:`, error);
		throw error;
	}
};

export const returnBookByLoanId = async (loanId: number) => {
	try {
		const response = await axiosClient.post<LoanResponse>(`${LOAN_ENDPOINT}/return/${loanId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to change loan with id ${loanId} to RETURN:`, error);
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

export const updateLoanById = async (id: number, loan: LoanResponse) => {
	try {
		const response = await axiosClient.put<LoanResponse>(`${LOAN_ENDPOINT}/${id}`, loan);
		return response.data;
	} catch (error) {
		console.error(`Failed to update loan with id ${id}:`, error);
		throw error;
	}
};

//@PostMapping("/borrow/{loanId}")

export const setLoanBorrow = async (loanId: number) => {
	try {
		const response = await axiosClient.post<LoanResponse>(`${LOAN_ENDPOINT}/borrow/${loanId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to change loan with id ${loanId} to BORROWED:`, error);
		throw error;
	}
};

//@PostMapping("/return/{loanId}")
export const setLoanReturn = async (loanId: number) => {
	try {
		const response = await axiosClient.post<LoanResponse>(`${LOAN_ENDPOINT}/return/${loanId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to change loan with id ${loanId} to RETURNED:`, error);
		throw error;
	}
};

//@PostMapping("/overdue/{loanId}")
export const setLoanOverdue = async (loanId: number) => {
	try {
		const response = await axiosClient.post<LoanResponse>(`${LOAN_ENDPOINT}/overdue/${loanId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to change loan with id ${loanId} to OVERDUE:`, error);
		throw error;
	}
};

const apiLoans = {
	getLoans: getAll,
	borrowBookByLoanId,
	returnBookByLoanId,

	getLoansByUserId,
	addLoanReserve,
	updateLoanById,
	deleteLoanById,
	getLoansWithCounts,
	getLoanByLoanId,

	setLoanBorrow,
	setLoanReturn,
	setLoanOverdue,
};

export default apiLoans;
