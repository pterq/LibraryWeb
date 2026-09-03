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

const getAuthors = async () => {
	try {
		const response = await axiosClient.get<AuthorType[]>("/author");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch authors:", error);
		throw error;
	}
};

const addAuthor = async (author: AuthorType) => {
	try {
		const response = await axiosClient.post<AuthorType>("/author", author);
		return response.data;
	} catch (error) {
		console.error("Failed to add author:", error);
		throw error;
	}
};

const updateAuthor = async (id: number, author: AuthorType) => {
	try {
		const response = await axiosClient.put<AuthorType>(`/author/${id}`, author);
		return response.data;
	} catch (error) {
		console.error(`Failed to update author with id ${id}:`, error);
		throw error;
	}
};

const deleteAuthor = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/author/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete author with id ${id}:`, error);
		throw error;
	}
};

const searchAuthors = async (query: string) => {
	try {
		const response = await axiosClient.get<AuthorType[]>(`/author/search?query=${query}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to search authors with query "${query}":`, error);
		throw error;
	}
};

//===============================================================================
//Book

const getBooks = async () => {
	try {
		const response = await axiosClient.get<BookType[]>("/book");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch books:", error);
		throw error;
	}
};

const addBook = async (book: BookType) => {
	try {
		const response = await axiosClient.post<BookType>("/book", book);
		return response.data;
	} catch (error) {
		console.error("Failed to add book:", error);
		throw error;
	}
};

const getBookById = async (id: number) => {
	try {
		const response = await axiosClient.get<BookType>(`/book/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch book with id ${id}:`, error);
		throw error;
	}
};

const updateBookById = async (id: number, book: BookType) => {
	try {
		const response = await axiosClient.put<BookType>(`/book/${id}`, book);
		return response.data;
	} catch (error) {
		console.error(`Failed to update book with id ${id}:`, error);
		throw error;
	}
};

const deleteBookById = async (id: number) => {
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

const getBookCopies = async () => {
	try {
		const response = await axiosClient.get<BookPhysicalType[]>("/book-copy");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch book copies:", error);
		throw error;
	}
};

const addBookCopy = async (bookCopy: BookPhysicalType) => {
	try {
		const response = await axiosClient.post<BookPhysicalType>("/book-copy", bookCopy);
		return response.data;
	} catch (error) {
		console.error("Failed to add book copy:", error);
		throw error;
	}
};

const getBookCopyById = async (id: number) => {
	try {
		const response = await axiosClient.get<BookPhysicalType>(`/book-copy/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch book copy with id ${id}:`, error);
		throw error;
	}
};

const updateBookCopyById = async (id: number, bookCopy: BookPhysicalType) => {
	try {
		const response = await axiosClient.put<BookPhysicalType>(`/book-copy/${id}`, bookCopy);
		return response.data;
	} catch (error) {
		console.error(`Failed to update book copy with id ${id}:`, error);
		throw error;
	}
};

const deleteBookCopyById = async (id: number) => {
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

const getCategories = async () => {
	try {
		const response = await axiosClient.get<CategoryType[]>("/category");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		throw error;
	}
};

const getCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.get<CategoryType>(`/category/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch category with id ${id}:`, error);
		throw error;
	}
};

const addCategory = async (category: CategoryType) => {
	try {
		const response = await axiosClient.post<CategoryType>("/category", category);
		return response.data;
	} catch (error) {
		console.error("Failed to add category:", error);
		throw error;
	}
};

const updateCategoryById = async (id: number, category: CategoryType) => {
	try {
		const response = await axiosClient.put<CategoryType>(`/category/${id}`, category);
		return response.data;
	} catch (error) {
		console.error(`Failed to update category with id ${id}:`, error);
		throw error;
	}
};

const deleteCategoryById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/category/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete category with id ${id}:`, error);
		throw error;
	}
};

const getCategoriesCounts = async () => {
	try {
		const response =
			await axiosClient.get<{ categoryId: number; count: number }[]>("/category/counts");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch categories counts:", error);
		throw error;
	}
};

//===============================================================================
//Loan

const getLoans = async () => {
	try {
		const response = await axiosClient.get<LoanType[]>("/loan");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch loans:", error);
		throw error;
	}
};

const getLoansByLoanStatus = async (status: LoanStatusType) => {
	try {
		const response = await axiosClient.get<LoanType[]>(`/loan/status/${status}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans with status ${status}:`, error);
		throw error;
	}
};

const getLoansByUserId = async (userId: number) => {
	try {
		const response = await axiosClient.get<LoanType[]>(`/loan/user/${userId}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch loans for user with id ${userId}:`, error);
		throw error;
	}
};

const addLoan = async (loan: LoanType) => {
	try {
		const response = await axiosClient.post<LoanType>("/loan", loan);
		return response.data;
	} catch (error) {
		console.error("Failed to add loan:", error);
		throw error;
	}
};

const updateLoanById = async (id: number, loan: LoanType) => {
	try {
		const response = await axiosClient.put<LoanType>(`/loan/${id}`, loan);
		return response.data;
	} catch (error) {
		console.error(`Failed to update loan with id ${id}:`, error);
		throw error;
	}
};

const deleteLoanById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/loan/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete loan with id ${id}:`, error);
		throw error;
	}
};

//===============================================================================
//Reservation

const getReservations = async () => {
	try {
		const response = await axiosClient.get<ReservationType[]>("/reservation");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch reservations:", error);
		throw error;
	}
};

const getReservationById = async (id: number) => {
	try {
		const response = await axiosClient.get<ReservationType>(`/reservation/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch reservation with id ${id}:`, error);
		throw error;
	}
};

const addReservation = async (reservation: ReservationType) => {
	try {
		const response = await axiosClient.post<ReservationType>("/reservation", reservation);
		return response.data;
	} catch (error) {
		console.error("Failed to add reservation:", error);
		throw error;
	}
};

const updateReservationById = async (id: number, reservation: ReservationType) => {
	try {
		const response = await axiosClient.put<ReservationType>(`/reservation/${id}`, reservation);
		return response.data;
	} catch (error) {
		console.error(`Failed to update reservation with id ${id}:`, error);
		throw error;
	}
};

const deleteReservationById = async (id: number) => {
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

const getFees = async () => {
	try {
		const response = await axiosClient.get<FeeType[]>("/fee");
		return response.data;
	} catch (error) {
		console.error("Failed to fetch fees:", error);
		throw error;
	}
};

const getFeeByStatus = async (status: string) => {
	try {
		const response = await axiosClient.get<FeeType[]>(`/fee/status/${status}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fees with status ${status}:`, error);
		throw error;
	}
};

const getFeeById = async (id: number) => {
	try {
		const response = await axiosClient.get<FeeType>(`/fee/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch fee with id ${id}:`, error);
		throw error;
	}
};

const addFee = async (fee: FeeType) => {
	try {
		const response = await axiosClient.post<FeeType>("/fee", fee);
		return response.data;
	} catch (error) {
		console.error("Failed to add fee:", error);
		throw error;
	}
};

const updateFeeById = async (id: number, fee: FeeType) => {
	try {
		const response = await axiosClient.put<FeeType>(`/fee/${id}`, fee);
		return response.data;
	} catch (error) {
		console.error(`Failed to update fee with id ${id}:`, error);
		throw error;
	}
};

const deleteFeeById = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/fee/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete fee with id ${id}:`, error);
		throw error;
	}
};

const updateFeeStatusById = async (id: number, status: string) => {
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

const addUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>("/user", user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to add user:", error);
		throw error;
	}
};

const updateUser = async (id: number, user: BackendUserType) => {
	try {
		const response = await axiosClient.put<BackendUserType>(`/user/${id}`, user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error(`Failed to update user with id ${id}:`, error);
		throw error;
	}
};

const deleteUser = async (id: number) => {
	try {
		const response = await axiosClient.delete(`/user/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to delete user with id ${id}:`, error);
		throw error;
	}
};

const registerUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>("/user/register", user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to register user:", error);
		throw error;
	}
};

const loginUser = async (user: BackendUserType) => {
	try {
		const response = await axiosClient.post<BackendUserType>("/user/login", user);
		return normalizeUser(response.data);
	} catch (error) {
		console.error("Failed to login user:", error);
		throw error;
	}
};

const changeUserPassword = async (id: number, newPassword: string) => {
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
	getUsers,
	getUserById,
	addUser,
	updateUser,
	deleteUser,
	registerUser,
	loginUser,
	changeUserPassword,
	updateAuthor,
	deleteAuthor,
	searchAuthors,
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
	getCategoriesCounts,
	getLoans,
	getLoansByLoanStatus,
	addLoan,
	getLoansByUserId,
	deleteLoanById,
	updateLoanById,

	getReservations,
	addReservation,
	updateReservationById,
	deleteReservationById,
	getReservationById,
};

export default api;
