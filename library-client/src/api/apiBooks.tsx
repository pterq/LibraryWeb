import axiosClient from "./axiosClient";
import type { BookType } from "../types/DbTypes";

//endpoints
const BOOKS_ENDPOINT = "/books";

//===============================================================================
//Book

export type BookCreatePayload = {
	title: string;
	description: string;
	imageUrl: string | null;
	isbn: string;
	publishedYear: number | null;
	categoryIds: number[];
	authorIds: number[];
};

export const getBooks = async () => {
	try {
		const response = await axiosClient.get<BookType[]>(BOOKS_ENDPOINT);
		return response.data;
	} catch (error) {
		console.error("Failed to fetch books:", error);
		throw error;
	}
};

export const addBook = async (book: BookCreatePayload) => {
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

const apiBooks = {
	getBooks,
	getBookById,
	addBook,
	updateBookById,
	deleteBookById,
};

export default apiBooks;
