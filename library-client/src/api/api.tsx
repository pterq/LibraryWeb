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
} from "../types/DbTypes";

//===============================================================================
//Author

export const getAuthors = async () => {
	try {
		const response = await axiosClient.get<AuthorType[]>("/authors");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch authors:", error);
		throw error;
	}
};

export const addAuthor = async (author: AuthorType) => {
	try {
		const response = await axiosClient.post<AuthorType>("/authors", author);
		return response.data;
	} catch (error) {
		console.error("Failed to add author:", error);
		throw error;
	}
};

export const updateAuthor = async (id: number, author: AuthorType) => {
	try {
		const response = await axiosClient.put<AuthorType>(`/authors/${id}`, author);
		return response.data;
	} catch (error) {
		console.error(`Failed to update author with id ${id}:`, error);
		throw error;
	}
};

export const deleteAuthor = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/authors/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete author with id ${id}:`, error);
		throw error;
	}
};

export const searchAuthors = async (query: string) => {
	try {
		const response = await axiosClient.get<AuthorType[]>(`/authors/search?query=${query}`);
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
		const response = await axiosClient.get<BookType[]>("/book");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch books:", error);
		throw error;
	}
};

export const addBook = async (book: BookType) => {
	try {
		const response = await axiosClient.post<BookType>("/book", book);
		return response.data;
	} catch (error) {
		console.error("Failed to add book:", error);
		throw error;
	}
};

export const getBookById = async (id: number) => {
	try {
		const response = await axiosClient.get<BookType>(`/book/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch book with id ${id}:`, error);
		throw error;
	}
};

export const updateBookById = async (id: number, book: BookType) => {
	try {
		const response = await axiosClient.put<BookType>(`/book/${id}`, book);
		return response.data;
	} catch (error) {
		console.error(`Failed to update book with id ${id}:`, error);
		throw error;
	}
};

export const deleteBookById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/book/${id}`);
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
		const response = await axiosClient.get<BookPhysicalType[]>("/book-copy");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch book copies:", error);
		throw error;
	}
};

export const addBookCopy = async (bookCopy: BookPhysicalType) => {
	try {
		const response = await axiosClient.post<BookPhysicalType>("/book-copy", bookCopy);
		return response.data;
	} catch (error) {
		console.error("Failed to add book copy:", error);
		throw error;
	}
};

export const getBookCopyById = async (id: number) => {
	try {
		const response = await axiosClient.get<BookPhysicalType>(`/book-copy/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch book copy with id ${id}:`, error);
		throw error;
	}
};

export const updateBookCopyById = async (id: number, bookCopy: BookPhysicalType) => {
	try {
		const response = await axiosClient.put<BookPhysicalType>(`/book-copy/${id}`, bookCopy);
		return response.data;
	} catch (error) {
		console.error(`Failed to update book copy with id ${id}:`, error);
		throw error;
	}
};

export const deleteBookCopyById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/book-copy/${id}`);
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
		const response = await axiosClient.get<CategoryType[]>("/category");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		throw error;
	}
};

export const getCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.get<CategoryType>(`/category/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch category with id ${id}:`, error);
		throw error;
	}
};

export const addCategory = async (category: CategoryType) => {
	try {
		const response = await axiosClient.post<CategoryType>("/category", category);
		return response.data;
	} catch (error) {
		console.error("Failed to add category:", error);
		throw error;
	}
};

export const updateCategoryById = async (id: number, category: CategoryType) => {
	try {
		const response = await axiosClient.put<CategoryType>(`/category/${id}`, category);
		return response.data;
	} catch (error) {
		console.error(`Failed to update category with id ${id}:`, error);
		throw error;
	}
};

export const deleteCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/category/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete category with id ${id}:`, error);
		throw error;
	}
};

export const getCategoriesWithCounts = async () => {
	try {
		const response =
			await axiosClient.get<{ categoryId: number; categoryName: string; count: number }[]>(
				"/category/counts",
			);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories counts:", error);
		throw error;
	}
};

//===============================================================================
//Loan

export const getLoans = async () => {
	try {
		const response = await axiosClient.get<LoanType[]>("/loan");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch loans:", error);
		throw error;
	}
};

export const getLoansByLoanStatus = async (status: LoanStatusType) => {
	try {
		const response = await axiosClient.get<LoanType[]>(`/loan/status/${status}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans with status ${status}:`, error);
		throw error;
	}
};

export const getLoansByUserId = async (userId: number) => {
	try {
		const response = await axiosClient.get<LoanType[]>(`/loan/user/${userId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans for user with id ${userId}:`, error);
		throw error;
	}
};

export const addLoan = async (loan: LoanType) => {
	try {
		const response = await axiosClient.post<LoanType>("/loan", loan);
		return response.data;
	} catch (error) {
		console.error("Failed to add loan:", error);
		throw error;
	}
};

export const updateLoanById = async (id: number, loan: LoanType) => {
	try {
		const response = await axiosClient.put<LoanType>(`/loan/${id}`, loan);
		return response.data;
	} catch (error) {
		console.error(`Failed to update loan with id ${id}:`, error);
		throw error;
	}
};

export const deleteLoanById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/loan/${id}`);
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
		>("/loan/counts");
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
		const response = await axiosClient.get<ReservationType[]>("/reservation");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations:", error);
		throw error;
	}
};

export const getReservationById = async (id: number) => {
	try {
		const response = await axiosClient.get<ReservationType>(`/reservation/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch reservation with id ${id}:`, error);
		throw error;
	}
};

export const addReservation = async (reservation: ReservationType) => {
	try {
		const response = await axiosClient.post<ReservationType>("/reservation", reservation);
		return response.data;
	} catch (error) {
		console.error("Failed to add reservation:", error);
		throw error;
	}
};

export const updateReservationById = async (id: number, reservation: ReservationType) => {
	try {
		const response = await axiosClient.put<ReservationType>(`/reservation/${id}`, reservation);
		return response.data;
	} catch (error) {
		console.error(`Failed to update reservation with id ${id}:`, error);
		throw error;
	}
};

export const deleteReservationById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/reservation/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete reservation with id ${id}:`, error);
		throw error;
	}
};

//===============================================================================
//Fee

export const getFees = async () => {
	try {
		const response = await axiosClient.get<FeeType[]>("/fee");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch fees:", error);
		throw error;
	}
};

export const getFeeByStatus = async (status: string) => {
	try {
		const response = await axiosClient.get<FeeType[]>(`/fee/status/${status}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fees with status ${status}:`, error);
		throw error;
	}
};

export const getFeeById = async (id: number) => {
	try {
		const response = await axiosClient.get<FeeType>(`/fee/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fee with id ${id}:`, error);
		throw error;
	}
};

export const addFee = async (fee: FeeType) => {
	try {
		const response = await axiosClient.post<FeeType>("/fee", fee);
		return response.data;
	} catch (error) {
		console.error("Failed to add fee:", error);
		throw error;
	}
};

export const updateFeeById = async (id: number, fee: FeeType) => {
	try {
		const response = await axiosClient.put<FeeType>(`/fee/${id}`, fee);
		return response.data;
	} catch (error) {
		console.error(`Failed to update fee with id ${id}:`, error);
		throw error;
	}
};

export const deleteFeeById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/fee/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete fee with id ${id}:`, error);
		throw error;
	}
};

export const updateFeeStatusById = async (id: number, status: string) => {
	try {
		const response = await axiosClient.put<FeeType>(`/fee/${id}/status`, { status });
		return response.data;
	} catch (error) {
		console.error(`Failed to update fee status with id ${id}:`, error);
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
	userId: user.id,
	firstName: user.firstName,
	lastName: user.lastName,
	email: user.email,
	phone: user.phone,
	role: user.role,
	hasFee: user.hasFee ?? false,
});

export const getUsers = async () => {
	try {
		const response = await axiosClient.get<BackendUserType[]>("/user");
		return response.data.map(normalizeUser);
	} catch (error) {
		console.error("Failed to fetch users:", error);
		throw error;
	}
};

export const getUserById = async (id: number) => {
	try {
		const response = await axiosClient.get<BackendUserType>(`/user/${id}`);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to fetch user with id ${id}:`, error);
		throw error;
	}
};

export const addUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>("/user", user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to add user:", error);
		throw error;
	}
};

export const updateUser = async (id: number, user: BackendUserType) => {
	try {
		const response = await axiosClient.put<BackendUserType>(`/user/${id}`, user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to update user with id ${id}:`, error);
		throw error;
	}
};

export const deleteUser = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/user/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete user with id ${id}:`, error);
		throw error;
	}
};

export const registerUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>("/user/register", user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to register user:", error);
		throw error;
	}
};

export const loginUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>("/user/login", user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to login user:", error);
		throw error;
	}
};

export const changeUserPassword = async (id: number, newPassword: string) => {
	try {
		const response = await axiosClient.put<BackendUserType>(`/user/${id}/change-password`, {
			newPassword,
		});
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
	getCategoriesCounts: getCategoriesWithCounts,

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
