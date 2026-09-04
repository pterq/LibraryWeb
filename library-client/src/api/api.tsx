import axiosClient from "./axiosClient";
import type {
	UserType,
	UserRoleType,
	AuthorType,
	BookType,
	BookPhysicalType,
	CategoryType,
	LoanType,
	ReservationType,
	FeeType,
	LoanStatusType,
	FeesWithCountsType,
	LoanCountType,
	ReservationCountType,
	CategoriesWithCountsType,
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
//Author

export const getAuthors = async () => {
	try {
		const response = await axiosClient.get<AuthorType[]>(AUTHORS_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch authors:", error);
		throw error;
	}
};

export const addAuthor = async (author: AuthorType) => {
	try {
		const response = await axiosClient.post<AuthorType>(AUTHORS_ENDPOINT, author);
		return response.data;
	} catch (error) {
		console.error("Failed to add author:", error);
		throw error;
	}
};

export const updateAuthor = async (id: number, author: AuthorType) => {
	try {
		const response = await axiosClient.put<AuthorType>(`${AUTHORS_ENDPOINT}/${id}`, author);
		return response.data;
	} catch (error) {
		console.error(`Failed to update author with id ${id}:`, error);
		throw error;
	}
};

export const deleteAuthor = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${AUTHORS_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete author with id ${id}:`, error);
		throw error;
	}
};

export const searchAuthors = async (query: string) => {
	try {
		const response = await axiosClient.get<AuthorType[]>(
			`${AUTHORS_ENDPOINT}/search?query=${query}`,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to search authors with query "${query}":`, error);
		throw error;
	}
};

//===============================================================================
//Book

export const getBooks = async () => {
	try {
		const response = await axiosClient.get<BookType[]>(BOOKS_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch books:", error);
		throw error;
	}
};

export const addBook = async (book: BookType) => {
	try {
		const response = await axiosClient.post<BookType>(BOOKS_ENDPOINT, book);
		return response.data;
	} catch (error) {
		console.error("Failed to add book:", error);
		throw error;
	}
};

export const getBookById = async (id: number) => {
	try {
		const response = await axiosClient.get<BookType>(`${BOOKS_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch book with id ${id}:`, error);
		throw error;
	}
};

export const updateBookById = async (id: number, book: BookType) => {
	try {
		const response = await axiosClient.put<BookType>(`${BOOKS_ENDPOINT}/${id}`, book);
		return response.data;
	} catch (error) {
		console.error(`Failed to update book with id ${id}:`, error);
		throw error;
	}
};

export const deleteBookById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${BOOKS_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete book with id ${id}:`, error);
		throw error;
	}
};

//===============================================================================
//BookCopy

export const getBookCopies = async () => {
	try {
		const response = await axiosClient.get<BookPhysicalType[]>(BOOK_COPY_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch book copies:", error);
		throw error;
	}
};

export const addBookCopy = async (bookCopy: BookPhysicalType) => {
	try {
		const response = await axiosClient.post<BookPhysicalType>(BOOK_COPY_ENDPOINT, bookCopy);
		return response.data;
	} catch (error) {
		console.error("Failed to add book copy:", error);
		throw error;
	}
};

export const getBookCopyById = async (id: number) => {
	try {
		const response = await axiosClient.get<BookPhysicalType>(`${BOOK_COPY_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch book copy with id ${id}:`, error);
		throw error;
	}
};

export const updateBookCopyById = async (id: number, bookCopy: BookPhysicalType) => {
	try {
		const response = await axiosClient.put<BookPhysicalType>(
			`${BOOK_COPY_ENDPOINT}/${id}`,
			bookCopy,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to update book copy with id ${id}:`, error);
		throw error;
	}
};

export const deleteBookCopyById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${BOOK_COPY_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete book copy with id ${id}:`, error);
		throw error;
	}
};

//===============================================================================
//Category

export const getCategories = async () => {
	try {
		const response = await axiosClient.get<CategoryType[]>(CATEGORIES_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		throw error;
	}
};

export const getCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.get<CategoryType>(`${CATEGORIES_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch category with id ${id}:`, error);
		throw error;
	}
};

export const addCategory = async (category: CategoryType) => {
	try {
		const response = await axiosClient.post<CategoryType>(CATEGORIES_ENDPOINT, category);
		return response.data;
	} catch (error) {
		console.error("Failed to add category:", error);
		throw error;
	}
};

export const updateCategoryById = async (id: number, category: CategoryType) => {
	try {
		const response = await axiosClient.put<CategoryType>(
			`${CATEGORIES_ENDPOINT}/${id}`,
			category,
		);
		return response.data;
	} catch (error) {
		console.error(`Failed to update category with id ${id}:`, error);
		throw error;
	}
};

export const deleteCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`${CATEGORIES_ENDPOINT}/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete category with id ${id}:`, error);
		throw error;
	}
};

export const getCategoriesWithCounts = async () => {
	try {
		const response = await axiosClient.get<CategoriesWithCountsType[]>(
			`${CATEGORIES_ENDPOINT}/counts`,
		);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories with counts:", error);
		throw error;
	}
};

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
		const response = await axiosClient.get<
			{
				loanId: number;
				user: UserType;
				firstName: string;
				lastName: string;
				numberOfLoans: number;
			}[]
		>(`${LOAN_ENDPOINT}/counts`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch loans with counts:", error);
		throw error;
	}
};

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
		const response = await axiosClient.get<FeesWithCountsType[]>(`${FEE_ENDPOINT}/counts`);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch fees with counts:", error);
		throw error;
	}
};

export const getFeesByUserId = async (userId: number | null) => {
	try {
		const response = await axiosClient.get<FeeType[]>(`${FEE_ENDPOINT}/user/${userId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fees for user with id ${userId}:`, error);
		throw error;
	}
};

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

export const updateUser = async (id: number, user: BackendUserType) => {
	try {
		const response = await axiosClient.put<BackendUserType>(`${USER_ENDPOINT}/${id}`, user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to update user with id ${id}:`, error);
		throw error;
	}
};

export const deleteUser = async (id: number) => {
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

export const loginUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>(`${USER_ENDPOINT}/login`, user);
		return normalizeUser(response.data);
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

//===============================================================================

const api = {
	getAuthors,
	addAuthor,
	updateAuthor,
	deleteAuthor,
	searchAuthors,

	getUsers,
	getUserById,
	addUser,
	updateUser,
	deleteUser,
	registerUser,
	loginUser,
	changeUserPassword,

	getFees,
	getFeeById,
	addFee,
	updateFeeById,
	deleteFeeById,
	getFeeByStatus,
	updateFeeStatusById,
	getBooks,
	addBook,
	updateBookById,
	deleteBookById,
	getBookCopies,
	addBookCopy,
	updateBookCopyById,
	deleteBookCopyById,
	getBookCopyById,
	getBookById,
	getCategories,
	addCategory,
	updateCategoryById,
	deleteCategoryById,
	getCategoryById,
	getCategoriesWithCounts,

	getLoans,
	getLoansByLoanStatus,
	addLoan,
	getLoansByUserId,
	deleteLoanById,
	updateLoanById,
	getLoansWithCounts,

	getReservations,
	addReservation,
	updateReservationById,
	deleteReservationById,
	getReservationById,
};

export default api;
