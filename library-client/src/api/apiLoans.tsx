import axiosClient from "./axiosClient";
import type {
	UserType,
	UserRoleType,
	AuthorType,
	AuthorForm,
	BookType,
	BookPhysicalType,
	CategoryType,
	LoanType,
	CartType,
	FeeType,
	LoanStatusType,
	FeesWithCountsType,
	CartCountType,
	CategoriesWithCountsType,
	CategoryForm,
	LoanCountType,
} from "../types/DbTypes";

//endpoints
const BOOKS_ENDPOINT = "/books";
const BOOK_COPY_ENDPOINT = "/copies";
const CATEGORIES_ENDPOINT = "/categories";
const AUTHORS_ENDPOINT = "/authors";
const USER_ENDPOINT = "/user";
const LOAN_ENDPOINT = "/loans";
const FEE_ENDPOINT = "/fees";
const RESERVATION_ENDPOINT = "/reservations";

//===============================================================================
//Loan

export const getLoans = async () => {
	try {
		const response = await axiosClient.get<LoanType[]>(LOAN_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch loans:", error);
		throw error;
	}
};

export const getLoansByLoanStatus = async (status: LoanStatusType) => {
	try {
		const response = await axiosClient.get<LoanType[]>(`${LOAN_ENDPOINT}/status/${status}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans with status ${status}:`, error);
		throw error;
	}
};

export const getLoansByUserId = async (userId: number | null) => {
	try {
		const response = await axiosClient.get<LoanType[]>(`${LOAN_ENDPOINT}/userBooks/${userId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans for user with id ${userId}:`, error);
		throw error;
	}
};

export const addLoan = async (loan: LoanType) => {
	try {
		const response = await axiosClient.post<LoanType>(LOAN_ENDPOINT, loan);
		return response.data;
	} catch (error) {
		console.error("Failed to add loan:", error);
		throw error;
	}
};

export const updateLoanById = async (id: number, loan: LoanType) => {
	try {
		const response = await axiosClient.put<LoanType>(`${LOAN_ENDPOINT}/${id}`, loan);
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
